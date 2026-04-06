import { CardSkeleton } from "@/components/ui/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="py-6">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <div className="flex flex-col gap-3">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
