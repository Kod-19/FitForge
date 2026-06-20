import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Flame, CalendarCheck } from "lucide-react";
import { db } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";

export default function Progress() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchLogs() {
      const q = query(collection(db, "users", user.uid, "logs"), orderBy("date", "asc"));
      const snap = await getDocs(q);
      setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }

    fetchLogs();
  }, [user]);

  // Group logs by week, summing total completed exercises per week
  const chartData = groupLogsByWeek(logs);

  if (loading) return <p className="text-slate-500 text-sm">Loading your history...</p>;

  if (logs.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 text-center">
        <p className="text-slate-400 text-sm">
          No workout history yet. Finish a workout in the Log page to see your progress here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Progress</h1>
        <p className="text-slate-400 text-sm mt-1">Your training volume over time.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div className="bg-slate-900 rounded-xl p-5 flex items-center gap-3">
          <CalendarCheck className="text-orange-500" size={20} />
          <div>
            <p className="text-2xl font-bold text-white">{logs.length}</p>
            <p className="text-slate-400 text-xs">Workouts logged</p>
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl p-5 flex items-center gap-3">
          <Flame className="text-orange-500" size={20} />
          <div>
            <p className="text-2xl font-bold text-white">
              {logs.reduce((sum, log) => sum + (log.completedExercises?.length || 0), 0)}
            </p>
            <p className="text-slate-400 text-xs">Exercises completed</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-5">
        <h2 className="text-white font-medium text-sm mb-4">Exercises completed per week</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }}
              labelStyle={{ color: "#fff" }}
            />
            <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900 rounded-xl divide-y divide-slate-800">
        {[...logs].reverse().slice(0, 10).map((log) => (
          <div key={log.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">{log.planName}</p>
              <p className="text-slate-500 text-xs">
                {log.completedExercises?.length || 0} of {log.totalExercises} exercises
              </p>
            </div>
            <p className="text-slate-500 text-xs">{formatDate(log.date)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Buckets logs into ISO week labels and sums completed exercises per week
function groupLogsByWeek(logs) {
  const weeks = {};

  for (const log of logs) {
    if (!log.date?.toDate) continue;
    const d = log.date.toDate();
    const weekLabel = `Wk ${getISOWeek(d)}`;
    const count = log.completedExercises?.length || 0;
    weeks[weekLabel] = (weeks[weekLabel] || 0) + count;
  }

  return Object.entries(weeks).map(([week, count]) => ({ week, count }));
}

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "";
  return timestamp.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric" });
}