"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Check, ChevronDown, Clock, Flame, Loader2, Star, X } from "lucide-react";
import { usePlan } from "../../context/PlanContext";
import { getAllWorkouts } from "../../Apibox/api";

const sortOptions = [
  { value: "duration", label: "Duration" },
  { value: "caloriesBurned", label: "Calories" },
  { value: "rating", label: "Rating" },
];

function StatCard({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 font-(family-name:--font-oswald) text-3xl font-bold text-white first:text-[#ccff00]">
        {value}
      </p>
    </div>
  );
}

function WorkoutRow({ workout, showDone, onDone, onRemove }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-[#14151a] p-3 sm:flex-row sm:items-center">
      <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-md sm:h-16 sm:w-24">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          sizes="200px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-(family-name:--font-oswald) text-base font-bold uppercase">
          {workout.name}
        </h3>
        <p className="mt-0.5 text-xs text-gray-400">{workout.equipment}</p>
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#ccff00]" />
            {workout.duration} min
          </span>
          <span className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-[#ccff00]" />
            {workout.caloriesBurned} kcal
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-[#ccff00]" />
            {workout.rating}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/workout/${workout.id}`}
          className="rounded-md border border-white/20 px-3 py-2 text-xs font-medium text-white transition hover:border-white/50"
        >
          View Details
        </Link>
        {showDone && (
          <button
            onClick={onDone}
            disabled={workout.done}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#ccff00] px-3 py-2 text-xs font-bold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            {workout.done ? "Done" : "Mark as Done"}
          </button>
        )}
        <button
          onClick={onRemove}
          aria-label="Remove"
          className="cursor-pointer rounded-md p-2 text-gray-400 transition hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function MyPlan() {
  const { plan, saved, loaded, removeFromPlan, removeFromSaved, markDone } =
    usePlan();
  const [tab, setTab] = useState("plan");
  const [sortBy, setSortBy] = useState("duration");
  const [catalog, setCatalog] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getAllWorkouts()
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch(() => {
        if (!cancelled) setCatalog([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ready = loaded && catalog !== null;

  const fresh = (item) => {
    const latest = catalog ? catalog.find((w) => w.id === item.id) : null;
    return latest ? { ...latest, done: item.done } : item;
  };

  const planItems = plan.map(fresh);
  const savedItems = saved.map(fresh);

  const totalMinutes = planItems.reduce((sum, item) => sum + item.duration, 0);
  const totalCalories = planItems.reduce(
    (sum, item) => sum + item.caloriesBurned,
    0
  );

  const list = tab === "plan" ? planItems : savedItems;

  const sorted = useMemo(() => {
    const copy = [...list];
    if (sortBy === "duration") return copy.sort((a, b) => a.duration - b.duration);
    return copy.sort((a, b) => b[sortBy] - a[sortBy]);
  }, [list, sortBy]);

  const handleDone = (workout) => {
    markDone(workout.id);
    toast.success(`${workout.name} marked as done`);
  };

  const handleRemove = (workout) => {
    if (tab === "plan") removeFromPlan(workout.id);
    else removeFromSaved(workout.id);
    toast(`${workout.name} removed`);
  };

  const tabClass = (name) =>
    `cursor-pointer rounded-md px-4 py-2 text-xs font-medium transition ${
      tab === name ? "bg-[#2a2d36] text-white" : "text-gray-400 hover:text-white"
    }`;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-(family-name:--font-oswald) text-3xl font-bold uppercase">
        My Plan
      </h1>
      <p className="mt-1 text-sm text-gray-400">
        Cap of five lifts for today. Finish them, then load more.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl border border-white/5 bg-[#14151a] p-5 sm:p-6">
        <StatCard label="Exercises" value={ready ? plan.length : 0} />
        <StatCard label="Minutes" value={ready ? totalMinutes : 0} />
        <StatCard label="Calories" value={ready ? totalCalories : 0} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-white/5 bg-[#14151a] p-1">
          <button onClick={() => setTab("plan")} className={tabClass("plan")}>
            Today&apos;s Plan
          </button>
          <button onClick={() => setTab("saved")} className={tabClass("saved")}>
            Saved
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-400">
          Sort By
          <span className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer appearance-none rounded-md border border-white/10 bg-[#14151a] py-2 pl-3 pr-8 text-xs text-white outline-none focus:border-[#ccff00]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </span>
        </label>
      </div>

      <div className="mt-4 space-y-3">
        {!ready && (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#ccff00]">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading workouts…
          </div>
        )}

        {ready && sorted.length === 0 && (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-white/10 px-4 py-16 text-center">
            <h2 className="font-(family-name:--font-oswald) text-xl font-bold uppercase">
              Nothing here yet
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Browse the library and add a lift to get today moving.
            </p>
            <Link
              href="/"
              className="mt-5 rounded-full bg-[#ccff00] px-5 py-2.5 text-xs font-bold text-black transition hover:brightness-110"
            >
              Go to workouts
            </Link>
          </div>
        )}

        {ready &&
          sorted.map((workout) => (
            <WorkoutRow
              key={workout.id}
              workout={workout}
              showDone={tab === "plan"}
              onDone={() => handleDone(workout)}
              onRemove={() => handleRemove(workout)}
            />
          ))}
      </div>
    </section>
  );
}