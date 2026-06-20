import { useEffect, useState, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { Camera, Save } from "lucide-react";
import toast from "react-hot-toast";
import { db, auth } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";
import { uploadToCloudinary } from "../utils/cloudinary";

export default function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setProfile(snap.data());
        setName(snap.data().name || "");
      }
      setLoading(false);
    }

    fetchProfile();
  }, [user]);

  async function handlePhotoSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image file");
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image must be under 5MB");
    }

    setUploadingPhoto(true);
    try {
      // Upload to Cloudinary instead of Firebase Storage (avoids requiring the Blaze plan)
      const photoURL = await uploadToCloudinary(file);

      // Update both Firebase Auth profile and Firestore doc so they stay in sync
      await updateProfile(auth.currentUser, { photoURL });
      await updateDoc(doc(db, "users", user.uid), { photoURL });

      setProfile((prev) => ({ ...prev, photoURL }));
      toast.success("Profile photo updated");
    } catch {
      toast.error("Couldn't upload photo. Try again.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSaveName() {
    if (!name.trim()) return toast.error("Name can't be empty");

    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { name: name.trim() });
      await updateProfile(auth.currentUser, { displayName: name.trim() });
      toast.success("Name updated");
    } catch {
      toast.error("Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-slate-500 text-sm">Loading profile...</p>;

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account details.</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-6 flex flex-col items-center">
        <div className="relative">
          {profile?.photoURL ? (
            <img
              src={profile.photoURL}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-3xl font-semibold">
              {profile?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 transition flex items-center justify-center disabled:opacity-50"
            title="Change photo"
          >
            <Camera size={14} className="text-white" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
          />
        </div>

        {uploadingPhoto && <p className="text-slate-500 text-xs mt-3">Uploading...</p>}

        <p className="text-slate-500 text-xs mt-4">{profile?.email}</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-5 space-y-3">
        <label className="text-slate-400 text-xs">Display name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleSaveName}
          disabled={saving}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white text-sm font-medium disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save name"}
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl p-5">
        <p className="text-slate-400 text-xs">Current streak</p>
        <p className="text-2xl font-bold text-white mt-1">{profile?.streak ?? 0} days</p>
      </div>
    </div>
  );
}