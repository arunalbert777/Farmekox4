'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sun, Cloud, CloudRain, CloudSun, CloudDrizzle } from 'lucide-react';

const weatherData = [
  { day: 'Today', icon: Sun, high: 32, low: 24 },
  { day: 'Tue', icon: CloudSun, high: 31, low: 23 },
  { day: 'Wed', icon: Cloud, high: 29, low: 22 },
  { day: 'Thu', icon: CloudDrizzle, high: 28, low: 21 },
  { day: 'Fri', icon: CloudRain, high: 27, low: 21 },
  { day: 'Sat', icon: Sun, high: 30, low: 22 },
  { day: 'Sun', icon: CloudSun, high: 31, low: 23 },
];

export default function WeatherCard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
            <CardTitle>7-Day Forecast</CardTitle>
            <CardDescription>{currentDate}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-2 overflow-x-auto pb-2">
          {weatherData.map((day) => {
            const Icon = day.icon;
            return (
              <div key={day.day} className="flex flex-col items-center space-y-2 p-2 rounded-lg min-w-[60px] text-center">
                <p className="font-medium text-sm">{day.day}</p>
                <Icon className="h-8 w-8 text-accent" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">{day.high}°</p>
                  <p className="text-muted-foreground">{day.low}°</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
