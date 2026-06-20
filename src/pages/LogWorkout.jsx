import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { CheckCircle2, Circle, Save } from "lucide-react";
import toast from "react-hot-toast";
import { db } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";

export default function LogWorkout() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [completed, setCompleted] = useState({}); // { exerciseIndex: true/false }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function fetchPlans() {
      const snap = await getDocs(collection(db, "users", user.uid, "plans"));
      const fetched = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPlans(fetched);
      if (fetched.length > 0) setSelectedPlanId(fetched[0].id);
      setLoading(false);
    }

    fetchPlans();
  }, [user]);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  function toggleExercise(index) {
    setCompleted((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  async function handleFinishWorkout() {
    if (!selectedPlan) return;

    const completedExercises = selectedPlan.exercises.filter((_, i) => completed[i]);
    if (completedExercises.length === 0) {
      return toast.error("Mark at least one exercise as done first");
    }

    setSaving(true);
    try {
      // Save the log entry
      await addDoc(collection(db, "users", user.uid, "logs"), {
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        completedExercises,
        totalExercises: selectedPlan.exercises.length,
        date: serverTimestamp(),
      });

      // Bump the user's streak by 1
      await updateDoc(doc(db, "users", user.uid), {
        streak: increment(1),
      });

      toast.success("Workout logged. Streak +1!");
      setCompleted({});
    } catch {
      toast.error("Couldn't save your log. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-slate-500 text-sm">Loading your plans...</p>;

  if (plans.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 text-center">
        <p className="text-slate-400 text-sm">
          You don't have any saved plans yet. Build one first in the Workout Builder.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Log Workout</h1>
        <p className="text-slate-400 text-sm mt-1">Check off exercises as you complete them.</p>
      </div>

      <select
        value={selectedPlanId}
        onChange={(e) => {
          setSelectedPlanId(e.target.value);
          setCompleted({});
        }}
        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 text-white outline-none focus:ring-2 focus:ring-orange-500"
      >
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name}
          </option>
        ))}
      </select>

      {selectedPlan && (
        <div className="bg-slate-900 rounded-xl divide-y divide-slate-800">
          {selectedPlan.exercises.map((ex, i) => (
            <button
              key={i}
              onClick={() => toggleExercise(i)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-800/50 transition"
            >
              {completed[i] ? (
                <CheckCircle2 className="text-orange-500 shrink-0" size={20} />
              ) : (
                <Circle className="text-slate-600 shrink-0" size={20} />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${completed[i] ? "text-white" : "text-slate-300"}`}>
                  {ex.name}
                </p>
                <p className="text-slate-500 text-xs">
                  {ex.sets} sets × {ex.reps} reps · {ex.restSeconds}s rest
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleFinishWorkout}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-medium disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? "Saving..." : "Finish workout"}
      </button>
    </div>
  );
}