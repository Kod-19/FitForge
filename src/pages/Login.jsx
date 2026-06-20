import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Dumbbell } from "lucide-react";
import { registerUser, loginUser, loginWithGoogle } from "../firebase/auth";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isSignUp) {
        await registerUser(email, password, name);
        toast.success("Account created!");
      } else {
        await loginUser(email, password);
        toast.success("Welcome back!");
      }
      navigate("/");
    } catch (err) {
      toast.error(friendlyError(err.code));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setSubmitting(true);
    try {
      await loginWithGoogle();
      toast.success("Welcome!");
      navigate("/");
    } catch (err) {
      toast.error(friendlyError(err.code));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Dumbbell className="text-orange-500" size={28} />
          <h1 className="text-xl font-bold text-white">FitForge</h1>
        </div>

        <h2 className="text-slate-300 text-sm text-center mb-6">
          {isSignUp ? "Create your account" : "Log in to continue"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            disabled={submitting}
            className="cursor-pointer w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-medium disabled:opacity-50"
          >
            {submitting ? "Please wait..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-slate-700 flex-1" />
          <span className="text-slate-500 text-xs">OR</span>
          <div className="h-px bg-slate-700 flex-1" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={submitting}
          className="cursor-pointer w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-white font-medium disabled:opacity-50"
        >
          Continue with Google
        </button>

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
