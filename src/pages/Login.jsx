import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Dumbbell, Eye, EyeOff } from "lucide-react";
import { registerUser, loginUser } from "../firebase/auth";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      if (isSignUp) {
        await registerUser(trimmedEmail, password, name.trim());
        await savePasswordCredential(
          trimmedEmail,
          password,
          name.trim() || trimmedEmail,
        );
        toast.success("Account created!");
      } else {
        await loginUser(trimmedEmail, password);
        await savePasswordCredential(trimmedEmail, password, trimmedEmail);
        toast.success("Welcome back!");
      }
      navigate("/");
    } catch (err) {
      toast.error(friendlyError(err.code));
    } finally {
      setSubmitting(false);
    }
  }

  async function savePasswordCredential(id, passwordValue, displayName) {
    if (typeof window === "undefined") return;

    const supportsPasswordCredential =
      "PasswordCredential" in window && navigator.credentials?.store;
    if (!supportsPasswordCredential) return;

    try {
      const credential = new window.PasswordCredential({
        id,
        password: passwordValue,
        name: displayName,
      });
      await navigator.credentials.store(credential);
    } catch {
      // Ignore credential storage failures and fall back to browser autocomplete behavior.
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Dumbbell className="text-orange-500" size={28} />
          <h1 className="text-xl font-bold text-white">GetFit</h1>
        </div>

        <h2 className="text-slate-300 text-sm text-center mb-6">
          {isSignUp ? "Create your account" : "Log in to continue"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          {isSignUp && (
            <input
              type="text"
              id="full-name"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              name="name"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
            />
          )}

          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            name="username"
            inputMode="email"
            required
            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-2.5 pr-12 rounded-lg bg-slate-800 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="cursor-pointer w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-medium disabled:opacity-50"
          >
            {submitting ? "Please wait..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="text-slate-500 text-sm text-center mt-6">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="cursor-pointer text-orange-500 hover:underline"
          >
            {isSignUp ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

function friendlyError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    default:
      return "Something went wrong. Try again.";
  }
}
