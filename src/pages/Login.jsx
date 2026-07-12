import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Dumbbell } from "lucide-react";
import { registerUser, loginUser, loginWithGoogle, handleGoogleRedirectResult } from "../firebase/auth";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function finishRedirectLogin() {
      try {
        const user = await handleGoogleRedirectResult();
        if (user) {
          toast.success("Welcome!");
          navigate("/");
        }
      } catch (err) {
        toast.error(friendlyError(err?.code));
      }
    }

    finishRedirectLogin();
  }, [navigate]);

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
      const user = await loginWithGoogle();
      if (user) {
        toast.success("Welcome!");
        navigate("/");
      }
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
              autoComplete="name"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignUp ? "new-password" : "current-password"}
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
          className="cursor-pointer w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.6l6.9-6.9C35.1 2.38 29.9 0 24 0 14.64 0 6.4 5.48 2.56 13.44l8.02 6.22C12.86 13.5 17.96 9.5 24 9.5Z" />
            <path fill="#4285F4" d="M46.5 24c0-1.56-.14-3.06-.42-4.5H24v8.53h12.48c-.54 2.8-2.12 5.16-4.5 6.74l7.04 5.46C43.96 37.86 46.5 31.4 46.5 24Z" />
            <path fill="#FBBC05" d="M10.58 19.66 2.56 13.44A23.98 23.98 0 0 0 0 24c0 3.83.92 7.46 2.56 10.56l8.02-6.22c-1.12-3.18-1.12-6.64 0-9.68Z" />
            <path fill="#34A853" d="M24 47.5c6.48 0 11.92-2.14 15.9-5.82l-7.04-5.46c-2.02 1.36-4.62 2.16-8.86 2.16-6.04 0-11.14-4-12.96-9.5l-8.02 6.22C6.4 42.52 14.64 47.5 24 47.5Z" />
          </svg>
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
    case "auth/popup-blocked":
      return "Google sign-in was blocked. Please allow popups and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/operation-not-supported-in-this-environment":
      return "Google sign-in is not available in this browser. Please try another browser.";
    default:
      return "Something went wrong. Try again.";
  }
}
