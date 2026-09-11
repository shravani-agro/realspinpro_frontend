export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl" />
        <div className="relative h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    </div>
  );
}