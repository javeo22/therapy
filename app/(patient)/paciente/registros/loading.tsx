import { CardSkeleton } from "@/components/ui/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="py-6">
      <Skeleton className="h-8 w-1/2 mb-4" />
      <Skeleton className="h-4 w-20 mb-2" />
      <div className="flex flex-col gap-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
