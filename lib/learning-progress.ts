export const LEARNING_PROGRESS_KEY = "ai-principles-progress-v1";

export interface LearningProgressState {
  version: 1;
  completed: string[];
  recent: string | null;
}

export function createEmptyProgress(): LearningProgressState {
  return { version: 1, completed: [], recent: null };
}

export function parseProgress(value: string | null): LearningProgressState {
  if (!value) return createEmptyProgress();

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const completed = Array.isArray(parsed.completed)
      ? parsed.completed.filter(
          (slug): slug is string => typeof slug === "string"
        )
      : [];
    return {
      version: 1,
      completed,
      recent: typeof parsed.recent === "string" ? parsed.recent : null,
    };
  } catch {
    return createEmptyProgress();
  }
}

export function toggleCompletedLesson(
  state: LearningProgressState,
  slug: string
): LearningProgressState {
  const completed = state.completed.includes(slug)
    ? state.completed.filter((item) => item !== slug)
    : [...state.completed, slug];
  return { version: 1, completed, recent: slug };
}

export function getContinueSlug(
  state: LearningProgressState,
  lessonSlugs: string[]
): string | null {
  if (state.recent && lessonSlugs.includes(state.recent)) return state.recent;
  return (
    lessonSlugs.find((slug) => !state.completed.includes(slug)) ??
    lessonSlugs[0] ??
    null
  );
}
