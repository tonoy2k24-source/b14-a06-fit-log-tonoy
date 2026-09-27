"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { getAllWorkouts } from "../Apibox/api";
import WorkoutCard from "./WorkoutCard";

const sortOptions = [
  { value: "duration", label: "Duration" },
  { value: "caloriesBurned", label: "Calories" },
  { value: "rating", label: "Rating" },
];

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-white/5 bg-[#14151a]">
      <div className="aspect-video w-full bg-white/5" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-1/3 rounded-full bg-white/10" />
        <div className="h-5 w-3/4 rounded bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-white/5" />
        <div className="h-3 w-2/3 rounded bg-white/5" />
      </div>
    </div>
  );
}

export default function Library() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState("duration");

  useEffect(() => {
    let cancelled = false;
    getAllWorkouts()
      .then((data) => {
        if (!cancelled) setWorkouts(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    const list = [...workouts];
    if (sortBy === "duration") return list.sort((a, b) => a.duration - b.duration);
    return list.sort((a, b) => b[sortBy] - a[sortBy]);
  }, [workouts, sortBy]);

  return (
    <section
      id="library"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-(family-name:--font-oswald) text-3xl font-bold uppercase">
            The Library
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Twelve lifts covering every major muscle group.
          </p>
        </div>

        <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
          Sort By
          <span className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer appearance-none rounded-md border border-white/10 bg-[#14151a] py-2 pl-3 pr-9 text-sm normal-case text-white outline-none focus:border-[#ccff00]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </span>
        </label>
      </div>

      {loading && (
        <>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#ccff00]">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading workouts…
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </>
      )}

      {error && !loading && (
        <p className="mt-10 text-center text-sm text-red-400">
          Could not load workouts. Please refresh the page.
        </p>
      )}

      {!loading && !error && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </section>
  );
}