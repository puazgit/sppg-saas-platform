import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function MarketingStatsSkeletonLoader() {
  return (
    <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-12 w-24 mx-auto mb-2" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function FeaturesSkeletonLoader() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Skeleton className="h-6 w-32 mx-auto mb-4" />
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-4 w-full mx-auto mb-2" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSkeletonLoader() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Skeleton className="h-6 w-32 mx-auto mb-4" />
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-4 w-full mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function PricingSkeletonLoader() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>

        {/* Pricing cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="relative">
              <CardContent className="p-8">
                {/* Badge placeholder */}
                <div className="mb-4">
                  <Skeleton className="h-6 w-20" />
                </div>
                
                {/* Title and price */}
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-10 w-full mb-6" />
                
                {/* Features list */}
                <div className="space-y-3 mb-8">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
                
                {/* Button */}
                <Skeleton className="h-11 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bottom CTA skeleton */}
        <div className="mt-16 text-center">
          <Skeleton className="h-12 w-64 mx-auto mb-6" />
          <Skeleton className="h-4 w-96 mx-auto mb-8" />
          <Skeleton className="h-11 w-48 mx-auto" />
        </div>
      </div>
    </section>
  )
}

export function CaseStudiesSkeletonLoader() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>

        {/* Case study tabs skeleton */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>

        {/* Main case study card skeleton */}
        <Card className="overflow-hidden mb-12">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image placeholder */}
              <Skeleton className="h-96 w-full" />
              
              {/* Content */}
              <div className="p-8">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-4 w-32 mb-6" />
                
                {/* Challenge section */}
                <div className="mb-6">
                  <Skeleton className="h-5 w-20 mb-3" />
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Skeleton className="h-4 w-4 rounded-full mt-0.5" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Solution section */}
                <div className="mb-8">
                  <Skeleton className="h-5 w-16 mb-3" />
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Skeleton className="h-4 w-4 rounded-full mt-0.5" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Testimonial */}
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results metrics skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 text-center">
                <Skeleton className="h-8 w-8 mx-auto mb-3" />
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA skeleton */}
        <div className="text-center">
          <Skeleton className="h-11 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
      </div>
    </section>
  )
}