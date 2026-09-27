import Link from "next/link";
import Image from "next/image";
import { Clock, Flame, Star } from "lucide-react";

export default function WorkoutCard({ workout }) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="group block overflow-hidden rounded-xl border border-white/5 bg-[#14151a] transition hover:-translate-y-1 hover:border-[#ccff00]/40"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {workout.muscleGroups.map((group) => (
            <span
              key={group}
              className="rounded-full bg-[#ccff00] px-2.5 py-0.5 text-[10px] font-bold uppercase text-black"
            >
              {group}
            </span>
          ))}
        </div>

        <h3 className="mt-3 font-(family-name:--font-oswald) text-lg font-bold uppercase leading-tight">
          {workout.name}
        </h3>
        <p className="mt-1 text-xs text-gray-400">{workout.equipment}</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {workout.duration} min
          </span>
          <span className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" />
            {workout.caloriesBurned} kcal
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" />
            {workout.rating}
          </span>
        </div>
      </div>
    </Link>
  );
}