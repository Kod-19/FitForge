import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { db, auth } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setProfile(snap.data());
          setName(snap.data().name || "");
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

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

  if (loading)
    return <p className="text-slate-500 text-sm">Loading profile...</p>;

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your account details.
        </p>
      </div>

      <div className="bg-slate-900 rounded-xl p-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-3xl font-semibold">
          {profile?.name?.[0]?.toUpperCase() || "U"}
        </div>

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
        <p className="text-2xl font-bold text-white mt-1">
          {profile?.streak ?? 0} days
        </p>
      </div>
    </div>
  );
}
