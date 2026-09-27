"use client";
import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Bookmark, CalendarPlus, Loader2 } from "lucide-react";
import { getWorkoutById } from "../../../Apibox/api";
import { usePlan, PLAN_LIMIT } from "../../../context/PlanContext";

export default function WorkoutDetails() {
  const { id } = useParams();
  const { plan, addToPlan, saveForLater } = usePlan();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getWorkoutById(id)
      .then((data) => {
        if (cancelled) return;
        if (!data || !data.name) setFailed(true);
        else setWorkout(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (failed) notFound();

  if (loading || !workout) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-[#ccff00]">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading workout…
      </div>
    );
  }

  const planFull =
    plan.length >= PLAN_LIMIT && !plan.some((item) => item.id === workout.id);

  const handleAdd = () => {
    const result = addToPlan(workout);
    if (result === "added") toast.success("Added to today's plan");
    else if (result === "exists") toast("Already in today's plan");
    else toast.error(`Today's plan is full (${PLAN_LIMIT} lifts max)`);
  };

  const handleSave = () => {
    const result = saveForLater(workout);
    if (result === "saved") toast.success("Saved for later");
    else toast("Already saved");
  };

  const specs = [
    ["Equipment", workout.equipment],
    ["Difficulty", workout.difficulty],
    ["Sets", workout.sets],
    ["Reps", workout.reps],
    ["Duration", `${workout.duration} min`],
    ["Calories", `${workout.caloriesBurned} kcal`],
    ["Rating", workout.rating],
  ];

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:gap-12">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div>
        <h1 className="font-(family-name:--font-oswald) text-3xl font-bold uppercase sm:text-4xl">
          {workout.name}
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-400">
          {workout.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {workout.muscleGroups.map((group) => (
            <span
              key={group}
              className="rounded-full bg-[#ccff00] px-3 py-1 text-xs font-semibold text-black"
            >
              {group}
            </span>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#14151a]">
          {specs.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-white/5 px-4 py-3 text-sm last:border-b-0"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {label}
              </span>
              <span className="text-white">{value}</span>
            </div>
          ))}
        </div>

        <h2 className="mt-8 font-(family-name:--font-oswald) text-lg font-bold uppercase tracking-wide">
          Instructions
        </h2>
        <ol className="mt-3 space-y-2.5 text-sm text-gray-300">
          {workout.instructions.map((step, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-gray-500">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={handleAdd}
            disabled={planFull}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#ccff00] px-5 py-3 text-sm font-bold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CalendarPlus className="h-4 w-4" />
            Add to today&apos;s plan
          </button>
          <button
            onClick={handleSave}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:border-white/50"
          >
            <Bookmark className="h-4 w-4" />
            Save for later
          </button>
        </div>
      </div>
    </section>
  );
}