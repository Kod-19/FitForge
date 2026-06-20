import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Search, Play, X } from "lucide-react";
import { db } from "../firebase/firebase";

const MUSCLE_GROUPS = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");
  const [activeVideo, setActiveVideo] = useState(null); // exercise currently shown in modal

  useEffect(() => {
    async function fetchExercises() {
      const snap = await getDocs(collection(db, "exercises"));
      setExercises(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    fetchExercises();
  }, []);

  const filtered = exercises.filter((ex) => {
    const matchesGroup = activeGroup === "All" || ex.muscleGroup === activeGroup;
    const matchesSearch = ex.name?.toLowerCase().includes(search.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Exercise Library</h1>
        <p className="text-slate-400 text-sm mt-1">Browse movements with video demos.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-900 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {MUSCLE_GROUPS.map((group) => (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                activeGroup === group
                  ? "bg-orange-500 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading exercises...</p>
      ) : filtered.length === 0 ? (
        <p className="text-slate-500 text-sm">No exercises match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setActiveVideo(ex)}
              className="text-left bg-slate-900 rounded-xl overflow-hidden hover:bg-slate-800 transition group"
            >
              <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                {ex.thumbnailURL ? (
                  <img src={ex.thumbnailURL} alt={ex.name} className="w-full h-full object-cover" />
                ) : (
                  <Play className="text-slate-600" size={28} />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                  <Play className="text-white opacity-0 group-hover:opacity-100 transition" size={28} fill="white" />
                </div>
              </div>
              <div className="p-3">
                <p className="text-white font-medium text-sm">{ex.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">{ex.muscleGroup}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-slate-900 rounded-xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-white font-medium">{activeVideo.name}</h3>
              <button onClick={() => setActiveVideo(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <video
              src={activeVideo.videoURL}
              controls
              autoPlay
              className="w-full aspect-video bg-black"
            />
            {activeVideo.description && (
              <p className="text-slate-400 text-sm p-4">{activeVideo.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}