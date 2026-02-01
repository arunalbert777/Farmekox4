import Header from '@/components/dashboard/header';
import WeatherCard from '@/components/dashboard/weather-card';
import MandiPrices from '@/components/dashboard/mandi-prices';
import CropCalendar from '@/components/dashboard/crop-calendar';
import MapView from '@/components/dashboard/map-view';
import AiAssistant from '@/components/dashboard/ai-assistant';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const isAuthenticated = true; // Placeholder for auth logic

  if (!isAuthenticated) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <WeatherCard />
          <MandiPrices />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <AiAssistant />
          </div>
          <div className="row-start-1 xl:row-start-auto">
            <CropCalendar />
          </div>
        </div>
        <div className="grid gap-4">
            <MapView />
        </div>
      </main>
    </div>
  );
}
