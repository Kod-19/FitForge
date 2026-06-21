import { useEffect, useState } from "react";
import { Search, Play, X } from "lucide-react";
import { getBodyPartList, getExercisesByBodyPart, searchExercisesByName, getExerciseImageUrl } from "../utils/exerciseDB";
import LazyExerciseGif from "../components/LazyExerciseGif";

export default function ExerciseLibrary() {
  const [bodyParts, setBodyParts] = useState([]);
  const [activeBodyPart, setActiveBodyPart] = useState("back");
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeExercise, setActiveExercise] = useState(null);

  // Load the list of body part categories once, on mount
  useEffect(() => {
    getBodyPartList()
      .then(setBodyParts)
      .catch(() => setBodyParts(["back", "chest", "legs", "shoulders", "arms", "core"]));
  }, []);

  // Refetch exercises whenever the selected body part changes
  useEffect(() => {
    setLoading(true);
    getExercisesByBodyPart(activeBodyPart)
      .then((data) => {
        console.log("ExerciseDB response:", data); // temporary -- inspect gifUrl values
        setExercises(data);
      })
      .catch(() => setExercises([]))
      .finally(() => setLoading(false));
  }, [activeBodyPart]);

  // Debounced search: waits 400ms after typing stops before hitting the API
  useEffect(() => {
    if (!search.trim()) return;

    const timeout = setTimeout(() => {
      setLoading(true);
      searchExercisesByName(search)
        .then(setExercises)
        .catch(() => setExercises([]))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Exercise Library</h1>
        <p className="text-slate-400 text-sm mt-1">Search exercises by name or target body part.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises (e.g. squat, curl)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-900 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {bodyParts.map((part) => (
            <button
              key={part}
              onClick={() => {
                setSearch("");
                setActiveBodyPart(part);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap capitalize transition ${
                activeBodyPart === part && !search
                  ? "bg-orange-500 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {part}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading exercises...</p>
      ) : exercises.length === 0 ? (
        <p className="text-slate-500 text-sm">No exercises found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setActiveExercise(ex)}
              className="text-left bg-slate-900 rounded-xl overflow-hidden hover:bg-slate-800 transition group"
            >
              <div className="aspect-video bg-slate-800 relative overflow-hidden">
                <LazyExerciseGif
                  src={getExerciseImageUrl(ex.id, 180)}
                  alt={ex.name}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                  <Play className="text-white opacity-0 group-hover:opacity-100 transition" size={28} fill="white" />
                </div>
              </div>
              <div className="p-3">
                <p className="text-white font-medium text-sm capitalize">{ex.name}</p>
                <p className="text-slate-500 text-xs mt-0.5 capitalize">
                  {ex.target} · {ex.equipment}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {activeExercise && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setActiveExercise(null)}
        >
          <div
            className="bg-slate-900 rounded-xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800 sticky top-0 bg-slate-900">
              <h3 className="text-white font-medium capitalize">{activeExercise.name}</h3>
              <button onClick={() => setActiveExercise(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <img
              src={getExerciseImageUrl(activeExercise.id, 360)}
              alt={activeExercise.name}
              className="w-full bg-black"
            />

            <div className="p-4 space-y-3">
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs capitalize">
                  Target: {activeExercise.target}
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs capitalize">
                  Equipment: {activeExercise.equipment}
                </span>
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs capitalize">
                  Body part: {activeExercise.bodyPart}
                </span>
              </div>

              {activeExercise.instructions?.length > 0 && (
                <div>
                  <p className="text-slate-400 text-xs mb-1">Instructions</p>
                  <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
                    {activeExercise.instructions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}