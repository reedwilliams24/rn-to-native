import type { Exercise as ExerciseDef } from "@/content/types";
import { loadExercise } from "@/lib/exercises";
import { Exercise } from "./Exercise";

export async function Exercises({ slug, exercises }: { slug: string; exercises: ExerciseDef[] }) {
  const data = await Promise.all(exercises.map((e) => loadExercise(slug, e)));
  return (
    <div className="space-y-12">
      {data.map((d) => (
        <Exercise key={d.id} slug={slug} data={d} />
      ))}
    </div>
  );
}
