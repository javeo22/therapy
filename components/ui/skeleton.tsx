interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-surface-container-high ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-3xl bg-surface-container p-6 flex flex-col gap-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function PatientCardSkeleton() {
  return (
    <div className="rounded-3xl bg-surface-container p-4 flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-16 rounded-3xl" />
        <Skeleton className="h-16 rounded-3xl" />
      </div>
      <Skeleton className="h-48 rounded-3xl" />
      <Skeleton className="h-32 rounded-3xl" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-6 w-2/3" />
      <div className="rounded-3xl bg-surface-container p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-1/4" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </div>
      <Skeleton className="h-12 rounded-full" />
    </div>
  );
}
