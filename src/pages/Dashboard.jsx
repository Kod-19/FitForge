import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Flame, ListPlus, Library, ArrowRight } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setProfile(snap.data());
      setLoading(false);
    }

    fetchProfile();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {loading ? "Welcome" : `Welcome back, ${profile?.name?.split(" ")[0] || "Athlete"}`}
        </h1>
        <p className="text-slate-400 text-sm mt-1">Let's keep the streak going.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Flame className="text-orange-500" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{loading ? "—" : profile?.streak ?? 0}</p>
            <p className="text-slate-400 text-xs">Day streak</p>
          </div>
        </div>

        <Link
          to="/builder"
          className="bg-slate-900 rounded-xl p-5 flex items-center gap-4 hover:bg-slate-800 transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <ListPlus className="text-orange-500" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">Build a workout</p>
            <p className="text-slate-400 text-xs">Create a new plan</p>
          </div>
          <ArrowRight className="text-slate-600 group-hover:text-orange-500 transition" size={16} />
        </Link>

        <Link
          to="/library"
          className="bg-slate-900 rounded-xl p-5 flex items-center gap-4 hover:bg-slate-800 transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Library className="text-orange-500" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">Exercise library</p>
            <p className="text-slate-400 text-xs">Browse with video demos</p>
          </div>
          <ArrowRight className="text-slate-600 group-hover:text-orange-500 transition" size={16} />
        </Link>
      </div>

      <div className="bg-linear-to-r from-orange-500/10 to-slate-900 border border-orange-500/20 rounded-xl p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-white font-medium text-sm">Need a quick walkthrough?</h2>
            <p className="text-slate-400 text-sm mt-1">
              See how to create and track workouts in FitForge.
            </p>
          </div>
          <a
            href="https://scribehow.com/embed-preview/How_to_Create_and_Track_Workouts_in_Fit_Forge__bsk96466T66AzlX591itXQ?as=video&size=flexible&voice=shimmer&scaleMode=contain"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            Watch video
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-5">
        <h2 className="text-white font-medium text-sm mb-3">Today's plan</h2>
        <p className="text-slate-500 text-sm">
          No workout planned for today yet.{" "}
          <Link to="/builder" className="text-orange-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}