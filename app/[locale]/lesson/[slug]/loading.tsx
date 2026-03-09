import { SidebarNavigation } from "@/components/course/sidebar-navigation"
import { Skeleton } from "@/components/ui/skeleton"

export default function LessonLoading() {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNavigation />
      <div className="lg:pl-72">
        <div className="flex flex-col xl:flex-row min-h-screen">
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-12 xl:pr-6">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex justify-between gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-9 w-full max-w-xl" />
                <Skeleton className="h-5 w-full max-w-2xl" />
              </div>
              <Skeleton className="h-32 w-full rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[75%]" />
              </div>
            </div>
          </main>
          <aside className="xl:w-[400px] border-t xl:border-t-0 border-border">
            <div className="p-4 space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-28 w-full rounded-lg" />
              <Skeleton className="h-10 w-full" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
