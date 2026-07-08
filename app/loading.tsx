export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-100/80 backdrop-blur-sm">
      <span className="loading loading-spinner loading-lg text-primary" />
      <p className="mt-4 text-sm text-base-content/50 font-mono">Loading...</p>
    </div>
  );
}
