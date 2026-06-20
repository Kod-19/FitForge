import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WorkoutBuilder() {
  const { user } = useAuth();
  const [planName, setPlanName] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [exercises, setExercises] = useState([
    { name: "", sets: 3, reps: 10, restSeconds: 60 },
  ]);
  const [saving, setSaving] = useState(false);

  function toggleDay(day) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function updateExercise(index, field, value) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  }

  function addExerciseRow() {
    setExercises((prev) => [...prev, { name: "", sets: 3, reps: 10, restSeconds: 60 }]);
  }

  function removeExerciseRow(index) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!planName.trim()) return toast.error("Give your plan a name");
    if (selectedDays.length === 0) return toast.error("Pick at least one day");
    if (exercises.some((ex) => !ex.name.trim()))
      return toast.error("Every exercise needs a name");

    setSaving(true);
    try {
      await addDoc(collection(db, "users", user.uid, "plans"), {
        name: planName.trim(),
        days: selectedDays,
        exercises,
        createdAt: serverTimestamp(),
      });
      toast.success("Plan saved!");
      setPlanName("");
      setSelectedDays([]);
      setExercises([{ name: "", sets: 3, reps: 10, restSeconds: 60 }]);
    } catch {
      toast.error("Couldn't save plan. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Workout Builder</h1>
        <p className="text-slate-400 text-sm mt-1">Design a plan and save it to your profile.</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-5 space-y-4">
        <div>
          <label className="text-slate-400 text-xs">Plan name</label>
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="e.g. Push Pull Legs"
            className="w-full mt-1 px-4 py-2.5 rounded-lg bg-slate-800 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="text-slate-400 text-xs">Days</label>
          <div className="flex gap-2 mt-1 flex-wrap">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  selectedDays.includes(day)
                    ? "bg-orange-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-medium text-sm">Exercises</h2>
          <button
            onClick={addExerciseRow}
            className="flex items-center gap-1 text-orange-500 text-sm hover:underline"
          >
            <Plus size={14} /> Add exercise
          </button>
        </div>

        {exercises.map((ex, i) => (
          <div key={i} className="flex flex-wrap gap-2 items-center bg-slate-800/50 p-3 rounded-lg">
            <input
              type="text"
              value={ex.name}
              onChange={(e) => updateExercise(i, "name", e.target.value)}
              placeholder="Exercise name"
              className="flex-1 min-w-[140px] px-3 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
            <input
              type="number"
              value={ex.sets}
              onChange={(e) => updateExercise(i, "sets", Number(e.target.value))}
              min={1}
              className="w-16 px-2 py-2 rounded-lg bg-slate-800 text-white text-sm text-center outline-none focus:ring-2 focus:ring-orange-500"
              title="Sets"
            />
            <span className="text-slate-500 text-xs">sets</span>
            <input
              type="number"
              value={ex.reps}
              onChange={(e) => updateExercise(i, "reps", Number(e.target.value))}
              min={1}
              className="w-16 px-2 py-2 rounded-lg bg-slate-800 text-white text-sm text-center outline-none focus:ring-2 focus:ring-orange-500"
              title="Reps"
            />
            <span className="text-slate-500 text-xs">reps</span>
            <input
              type="number"
              value={ex.restSeconds}
              onChange={(e) => updateExercise(i, "restSeconds", Number(e.target.value))}
              min={0}
              step={15}
              className="w-16 px-2 py-2 rounded-lg bg-slate-800 text-white text-sm text-center outline-none focus:ring-2 focus:ring-orange-500"
              title="Rest (seconds)"
            />
            <span className="text-slate-500 text-xs">sec rest</span>

            {exercises.length > 1 && (
              <button
                onClick={() => removeExerciseRow(i)}
                className="text-slate-500 hover:text-red-500 transition ml-auto"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-medium disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? "Saving..." : "Save plan"}
      </button>
    </div>
  );
}