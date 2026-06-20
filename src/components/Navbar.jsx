import { NavLink, useNavigate } from "react-router-dom";
import { Dumbbell, LayoutDashboard, ListPlus, Library, ClipboardList, TrendingUp, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../firebase/auth";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/builder", label: "Builder", icon: ListPlus },
  { to: "/library", label: "Library", icon: Library },
  { to: "/log", label: "Log", icon: ClipboardList },
  { to: "/progress", label: "Progress", icon: TrendingUp },
];

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logoutUser();
      toast.success("Logged out");
      navigate("/login");
    } catch {
      toast.error("Couldn't log out. Try again.");
    }
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => {navigate("/")}}>
          <Dumbbell className="text-orange-500" size={22} />
          <span className="text-white font-bold">FitForge</span>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-500/10 text-orange-500"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <NavLink to="/profile" className="flex items-center gap-2">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "Profile"}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-sm font-semibold">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </NavLink>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white transition"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="sm:hidden flex items-center justify-between pb-3 gap-1 overflow-x-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-medium transition whitespace-nowrap ${
                isActive ? "text-orange-500" : "text-slate-400"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
