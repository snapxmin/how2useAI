interface LearningPathStep {
  day: number;
  title: string;
  description: string;
  level: string;
}

interface LearningPathTimelineProps {
  steps: LearningPathStep[];
}

export function LearningPathTimeline({ steps }: LearningPathTimelineProps) {
  return (
    <div className="mt-6">
      <div className="hidden lg:block">
        <div className="flex items-stretch">
          {steps.map((step, index) => (
            <div key={step.day} className="flex min-w-0 flex-1 items-stretch">
              <div className="group relative flex min-w-0 flex-1 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-brand-300 hover:shadow-md">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                    {step.level}
                  </span>
                  <span className="text-lg font-bold text-brand-600">{step.day} 天</span>
                </div>
                <h3 className="mt-3 font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
                <div className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-sm">
                  {index + 1}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex w-14 shrink-0 flex-col items-center justify-center px-1">
                  <div className="flex items-center text-brand-400">
                    <div className="h-0.5 w-4 bg-gradient-to-r from-brand-300 to-brand-500" />
                    <svg
                      className="h-6 w-6 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12h12m0 0-5-5m5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-brand-500">
                    跃迁
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lg:hidden">
        <div className="relative space-y-0">
          {steps.map((step, index) => (
            <div key={step.day} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-sm">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="my-1 flex flex-1 flex-col items-center">
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-brand-400 to-brand-200" />
                    <svg
                      className="h-4 w-4 text-brand-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 5v12m0 0-5-5m5 5 5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="mb-6 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                    {step.level}
                  </span>
                  <span className="text-base font-bold text-brand-600">{step.day} 天</span>
                </div>
                <h3 className="mt-2 font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
