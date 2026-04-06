import { DashboardSkeleton } from "@/components/ui/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="py-6">
      <Skeleton className="h-4 w-24 mb-1" />
      <Skeleton className="h-8 w-1/2 mb-6" />
      <DashboardSkeleton />
    </div>
  );
}
