import { DashboardSkeleton } from "@/components/ui/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="py-6">
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="h-8 w-1/2 mb-4" />
      <DashboardSkeleton />
    </div>
  );
}
