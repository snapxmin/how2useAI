export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <p className="mt-4 text-slate-600">页面未找到</p>
      <a
        href="/"
        className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 text-white hover:bg-brand-700"
      >
        返回首页
      </a>
    </div>
  );
}
