import { get } from "@/shared/api/http";
import { Exercise, ExerciseParams } from "@/types/exercise";

export const getExercisesService = (params: ExerciseParams) => get<Exercise[]>(`fitness/api/exercise`, { params });
