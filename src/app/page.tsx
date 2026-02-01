'use client';

import Header from '@/components/dashboard/header';
import WeatherCard from '@/components/dashboard/weather-card';
import { redirect } from 'next/navigation';
import FeatureGrid from '@/components/dashboard/feature-grid';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
                <Skeleton className="h-[150px] w-full" />
                 <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">FarmekoX Features</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Skeleton className="h-[160px] w-full" />
                        <Skeleton className="h-[160px] w-full" />
                        <Skeleton className="h-[160px] w-full" />
                        <Skeleton className="h-[160px] w-full" />
                         <Skeleton className="h-[160px] w-full" />
                         <Skeleton className="h-[160px] w-full" />
                    </div>
                </div>
            </main>
        </div>
    );
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
        <WeatherCard />
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">FarmekoX Features</h2>
          <FeatureGrid />
        </div>
      </main>
    </div>
  );
}
