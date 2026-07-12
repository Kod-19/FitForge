import { BookOpen, Sparkles, Dumbbell, Search, CheckCircle2, TrendingUp, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const guideCards = [
  {
    title: "Start here",
    icon: Sparkles,
    description: "Welcome to FitForge. Think of it as your simple fitness companion that helps you plan, train, and track your progress.",
    bullets: [
      "Sign in and land on your Dashboard.",
      "Use the navigation bar to move between pages.",
      "Your streak and recent activity will appear here.",
    ],
    linkTo: "/",
    linkLabel: "Go to Dashboard",
  },
  {
    title: "Build a workout",
    icon: Dumbbell,
    description: "Create a plan that fits your day and your goals. You can save it and reuse it whenever you want.",
    bullets: [
      "Open Builder and give your plan a name.",
      "Pick the days you want to train.",
      "Add exercises, sets, reps, and rest time, then save.",
    ],
    linkTo: "/builder",
    linkLabel: "Open Builder",
  },
  {
    title: "Find exercises",
    icon: Search,
    description: "Browse the Exercise Library when you want inspiration or want to learn a new movement.",
    bullets: [
      "Search by exercise name like squat or curl.",
      "Tap a body-part button to browse similar moves.",
      "Open any exercise card to see instructions and a demo image.",
    ],
    linkTo: "/library",
    linkLabel: "Visit Library",
  },
  {
    title: "Log your sessions",
    icon: CheckCircle2,
    description: "After a workout, mark what you completed so your progress is saved.",
    bullets: [
      "Open Log and choose the plan you trained with.",
      "Tap each exercise as you finish it.",
      "Save your session to grow your streak.",
    ],
    linkTo: "/log",
    linkLabel: "Go to Log",
  },
  {
    title: "See your progress",
    icon: TrendingUp,
    description: "The Progress page helps you see how consistently you are training over time.",
    bullets: [
      "Check your weekly workout volume.",
      "See how many exercises you have completed.",
      "Review your recent workout history.",
    ],
    linkTo: "/progress",
    linkLabel: "Open Progress",
  },
  {
    title: "Update your profile",
    icon: UserRound,
    description: "Keep your profile feeling personal and up to date.",
    bullets: [
      "Open Profile to update your display name.",
      "Review your email and account details.",
      "Your information is saved automatically.",
    ],
    linkTo: "/profile",
    linkLabel: "Go to Profile",
  },
];

export default function Help() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-linear-to-r from-orange-500/10 to-slate-900 border border-orange-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
            <BookOpen className="text-orange-500" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">How to use FitForge</h1>
            <p className="text-slate-400 mt-2 text-sm leading-6">
              Welcome! This guide is here to make the app feel simple and easy to use. If you are new, start with the Dashboard and work your way through the features one step at a time.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {guideCards.map(({ title, icon: Icon, description, bullets, linkTo, linkLabel }) => (
          <div key={title} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Icon className="text-orange-500" size={18} />
              </div>
              <h2 className="text-white font-semibold">{title}</h2>
            </div>
            <p className="text-slate-400 text-sm leading-6">{description}</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <Link to={linkTo} className="inline-flex mt-4 text-sm text-orange-500 hover:underline">
              {linkLabel} →
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <h2 className="text-white font-semibold mb-3">A few quick tips</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>• Start small. One simple plan is better than a complicated one.</li>
          <li>• Use the Library whenever you want fresh ideas for exercises.</li>
          <li>• Logging your workout helps you build momentum and stay consistent.</li>
          <li>• Your profile is there to keep your account details tidy, so update your name whenever you want.</li>
          <li>• If you ever feel stuck, come back to this guide and follow the steps in order.</li>
        </ul>
      </div>
    </div>
  );
}
