import { WorkoutPlanDetailPage } from "@/features/workout-plans/detail";

// # /admin/workout-plans/[id]
export default function WorkoutPlanDetailRoute({ params }: { params: { id: string } }) {
  return (
    <div>
      <WorkoutPlanDetailPage planId={params.id} />
    </div>
  );
}
