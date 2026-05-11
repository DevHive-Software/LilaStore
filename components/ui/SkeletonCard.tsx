export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="bg-gray-200 aspect-square w-full" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded-full w-1/3" />
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-200 rounded-full w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 bg-gray-200 rounded-full w-1/4" />
          <div className="h-8 bg-gray-200 rounded-xl w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
