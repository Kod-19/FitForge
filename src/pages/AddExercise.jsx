import { useState, useRef } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { UploadCloud, Video, X } from "lucide-react";
import toast from "react-hot-toast";
import { db } from "../firebase/firebase";
import { uploadToCloudinary } from "../utils/cloudinary";

const MUSCLE_GROUPS = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

export default function AddExercise() {
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState(MUSCLE_GROUPS[0]);
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  function handleVideoSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      return toast.error("Please select a video file");
    }
    if (file.size > 50 * 1024 * 1024) {
      return toast.error("Video must be under 50MB");
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file)); // local preview before upload
  }

  function clearVideo() {
    setVideoFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return toast.error("Exercise needs a name");
    if (!videoFile) return toast.error("Add a demo video");

    setUploading(true);
    try {
      // 1. Upload video to Cloudinary, get back the hosted URL
      const videoURL = await uploadToCloudinary(videoFile);

      // 2. Save the exercise doc to Firestore, pointing at that URL
      await addDoc(collection(db, "exercises"), {
        name: name.trim(),
        muscleGroup,
        description: description.trim(),
        videoURL,
        createdAt: serverTimestamp(),
      });

      toast.success(`${name} added to the library`);

      // Reset form
      setName("");
      setDescription("");
      setMuscleGroup(MUSCLE_GROUPS[0]);
      clearVideo();
    } catch {
      toast.error("Couldn't add exercise. Try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Add Exercise</h1>
        <p className="text-slate-400 text-sm mt-1">
          Add a new movement to the shared exercise library.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 rounded-xl p-5 space-y-4">
        <div>
          <label className="text-slate-400 text-xs">Exercise name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Barbell Squat"
            className="w-full mt-1 px-4 py-2.5 rounded-lg bg-slate-800 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="text-slate-400 text-xs">Muscle group</label>
          <select
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            className="w-full mt-1 px-4 py-2.5 rounded-lg bg-slate-800 text-white outline-none focus:ring-2 focus:ring-orange-500"
          >
            {MUSCLE_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-slate-400 text-xs">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief form cues or instructions..."
            rows={3}
            className="w-full mt-1 px-4 py-2.5 rounded-lg bg-slate-800 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>

        <div>
          <label className="text-slate-400 text-xs">Demo video</label>

          {!videoPreview ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full mt-1 border-2 border-dashed border-slate-700 rounded-lg py-8 flex flex-col items-center gap-2 text-slate-500 hover:border-orange-500 hover:text-orange-500 transition"
            >
              <UploadCloud size={24} />
              <span className="text-sm">Click to select a video</span>
              <span className="text-xs">MP4, MOV — up to 50MB</span>
            </button>
          ) : (
            <div className="mt-1 relative rounded-lg overflow-hidden bg-black">
              <video src={videoPreview} controls className="w-full aspect-video" />
              <button
                type="button"
                onClick={clearVideo}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 transition flex items-center justify-center"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-medium disabled:opacity-50"
        >
          <Video size={16} />
          {uploading ? "Uploading..." : "Add to library"}
        </button>
      </form>
    </div>
  );
}