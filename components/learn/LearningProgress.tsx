"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  createEmptyProgress,
  getContinueSlug,
  LEARNING_PROGRESS_KEY,
  parseProgress,
  toggleCompletedLesson,
  type LearningProgressState,
} from "@/lib/learning-progress";

const progressEvent = "ai-principles-progress";

function useLearningProgress() {
  const [state, setState] = useState<LearningProgressState>(createEmptyProgress);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    try {
      setState(parseProgress(window.localStorage.getItem(LEARNING_PROGRESS_KEY)));
      setAvailable(true);
    } catch {
      setAvailable(false);
    }

    const sync = () => {
      try {
        setState(parseProgress(window.localStorage.getItem(LEARNING_PROGRESS_KEY)));
      } catch {
        setAvailable(false);
      }
    };
    window.addEventListener(progressEvent, sync);
    return () => window.removeEventListener(progressEvent, sync);
  }, []);

  function save(next: LearningProgressState) {
    try {
      window.localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(next));
      setState(next);
      window.dispatchEvent(new Event(progressEvent));
    } catch {
      setAvailable(false);
    }
  }

  return { state, available, save };
}

export function LearningProgress({ lessonSlugs }: { lessonSlugs: string[] }) {
  const { state, available } = useLearningProgress();
  if (!available || lessonSlugs.length === 0) return null;

  const completedCount = lessonSlugs.filter((slug) =>
    state.completed.includes(slug)
  ).length;
  const continueSlug = getContinueSlug(state, lessonSlugs);
  const percent = Math.round((completedCount / lessonSlugs.length) * 100);

  return (
    <section className="mb-8 rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">你的学习进度</p>
          <p className="mt-1 text-sm text-slate-600">
            已完成 {completedCount}/{lessonSlugs.length} 课
          </p>
        </div>
        {continueSlug && (
          <Link
            href={`/learn/${continueSlug}`}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            继续学习
          </Link>
        )}
      </div>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label="课程完成进度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="h-full bg-brand-600" style={{ width: `${percent}%` }} />
      </div>
    </section>
  );
}

export function CompleteLessonButton({ slug }: { slug: string }) {
  const { state, available, save } = useLearningProgress();
  if (!available) return null;

  const completed = state.completed.includes(slug);
  return (
    <button
      type="button"
      onClick={() => save(toggleCompletedLesson(state, slug))}
      aria-pressed={completed}
      className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
        completed
          ? "bg-emerald-100 text-emerald-800"
          : "bg-brand-600 text-white hover:bg-brand-700"
      }`}
    >
      {completed ? "✓ 已完成本课" : "完成本课"}
    </button>
  );
}

export function LessonVisitTracker({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const current = parseProgress(
        window.localStorage.getItem(LEARNING_PROGRESS_KEY)
      );
      if (current.recent === slug) return;
      window.localStorage.setItem(
        LEARNING_PROGRESS_KEY,
        JSON.stringify({ ...current, recent: slug })
      );
      window.dispatchEvent(new Event(progressEvent));
    } catch {
      // 阅读课程不依赖本地存储，存储不可用时静默降级。
    }
  }, [slug]);

  return null;
}
