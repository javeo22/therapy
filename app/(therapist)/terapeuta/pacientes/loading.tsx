import { PatientCardSkeleton } from "@/components/ui/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="py-6">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="h-10 w-full rounded-xl mb-4" />
      <div className="flex flex-col gap-2">
        <PatientCardSkeleton />
        <PatientCardSkeleton />
        <PatientCardSkeleton />
      </div>
    </div>
  );
}
