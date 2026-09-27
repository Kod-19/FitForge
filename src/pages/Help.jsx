import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Dumbbell,
  Search,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const guideCards = [
  {
    step: "01",
    title: "Start on the dashboard",
    icon: BookOpen,
    description:
      "After you sign in, use the dashboard as your home screen. This is where you can get a quick overview of your fitness activity.",
    bullets: [
      "Check your account status and recent activity.",
      "Use the top navigation to move between pages.",
      "Keep your routine simple and build from there.",
    ],
    linkTo: "/",
    linkLabel: "Open dashboard",
  },
  {
    step: "02",
    title: "Build your plan",
    icon: Dumbbell,
    description:
      "Create a weekly workout plan that matches your schedule and goals.",
    bullets: [
      "Name your plan and choose active days.",
      "Add exercises with sets, reps, and rest times.",
      "Save the plan when it looks right.",
    ],
    linkTo: "/builder",
    linkLabel: "Go to builder",
  },
  {
    step: "03",
    title: "Find exercises",
    icon: Search,
    description:
      "Use the exercise library to browse moves and get ideas for your training sessions.",
    bullets: [
      "Search by exercise name or body part.",
      "Open cards for details and demonstrations.",
      "Choose exercises that fit your plan.",
    ],
    linkTo: "/library",
    linkLabel: "Visit library",
  },
  {
    step: "04",
    title: "Log your workout",
    icon: CheckCircle2,
    description:
      "After training, record what you completed so your progress stays accurate.",
    bullets: [
      "Pick the workout plan you used.",
      "Mark each exercise as you finish it.",
      "Save the session to keep your streak moving.",
    ],
    linkTo: "/log",
    linkLabel: "Open log",
  },
  {
    step: "05",
    title: "Track progress",
    icon: TrendingUp,
    description:
      "Use the progress page to review your consistency and understand your training trends.",
    bullets: [
      "Keep an eye on weekly workout volume.",
      "See how often you train across the month.",
      "Use the data to adjust your routine.",
    ],
    linkTo: "/progress",
    linkLabel: "View progress",
  },
  {
    step: "06",
    title: "Manage your profile",
    icon: UserRound,
    description:
      "Keep your profile updated so your account info stays clear and personal.",
    bullets: [
      "Update your display name when needed.",
      "Review your email and account details.",
      "Keep everything organized and easy to find.",
    ],
    linkTo: "/profile",
    linkLabel: "Go to profile",
  },
];

export default function Help() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <header className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Getting started
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">
              How to use FitForge
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Follow this guide in order. It is designed to keep things simple
              and help you understand the app without feeling overwhelmed.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {guideCards.map(
          ({
            step,
            title,
            icon: Icon,
            description,
            bullets,
            linkTo,
            linkLabel,
          }) => (
            <article
              key={title}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                    <Icon size={18} />
                  </div>
                  <h2 className="text-base font-semibold text-white">
                    {title}
                  </h2>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {step}
                </span>
              </div>

              <p className="text-sm leading-6 text-slate-400">{description}</p>

              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="mt-1 text-orange-500">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={linkTo}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-orange-500 transition hover:text-orange-400"
              >
                {linkLabel}
                <ArrowRight size={14} />
              </Link>
            </article>
          ),
        )}
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold text-white">A few quick tips</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          <li>• Start small and keep your plan realistic.</li>
          <li>• Use the exercise library whenever you need ideas.</li>
          <li>• Log workouts right after training to stay consistent.</li>
          <li>• Come back to this page anytime you need a quick reminder.</li>
        </ul>
      </section>
    </div>
  );
}
