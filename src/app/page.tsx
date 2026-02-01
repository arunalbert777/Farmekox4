import Header from '@/components/dashboard/header';
import WeatherCard from '@/components/dashboard/weather-card';
import { redirect } from 'next/navigation';
import FeatureGrid from '@/components/dashboard/feature-grid';

export default function DashboardPage() {
  const isAuthenticated = true; // Placeholder for auth logic

  if (!isAuthenticated) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
        <WeatherCard />
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">All Features</h2>
          <FeatureGrid />
        </div>
      </main>
    </div>
  );
}
