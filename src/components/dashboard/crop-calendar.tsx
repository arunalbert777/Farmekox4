'use client';

import { useState, useEffect } from 'react';
import { addDays, startOfMonth, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, type CalendarProps } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const cropData = {
  rice: {
    sowing: [2, 10, 18],
    irrigation: [5, 12, 15, 20, 25],
    label: 'Rice'
  },
  wheat: {
    sowing: [5, 15],
    irrigation: [8, 16, 22, 28],
    label: 'Wheat'
  },
  maize: {
    sowing: [1, 9, 17, 25],
    irrigation: [4, 11, 19, 26],
    label: 'Maize'
  },
};

type Crop = keyof typeof cropData;

export default function CropCalendar() {
  const [crop, setCrop] = useState<Crop>('rice');
  const [month, setMonth] = useState<Date>();
  const [today, setToday] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const now = new Date();
    setToday(now);
    setMonth(now);
  }, []);

  if (!today || !month) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crop Calendar</CardTitle>
          <CardDescription>Sowing and irrigation schedule.</CardDescription>
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-10 w-[180px]" />
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" /> <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" /> <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[298px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const startOfSelectedMonth = startOfMonth(month);

  const sowingDays = cropData[crop].sowing.map(day => addDays(startOfSelectedMonth, day - 1));
  const irrigationDays = cropData[crop].irrigation.map(day => addDays(startOfSelectedMonth, day - 1));

  const DayContent: CalendarProps['components'] = {
    Day: ({ date }) => {
        if (!date) {
            return <div />;
        }
        const isSowingDay = sowingDays.some(d => isSameDay(d, date));
        const isIrrigationDay = irrigationDays.some(d => isSameDay(d, date));
        
        return (
            <div className="relative h-full w-full flex justify-center items-center">
                <span>{date.getDate()}</span>
                {(isSowingDay || isIrrigationDay) && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                        {isSowingDay && <div className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                        {isIrrigationDay && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                    </div>
                )}
            </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crop Calendar</CardTitle>
        <CardDescription>Sowing and irrigation schedule.</CardDescription>
        <div className="flex items-center justify-between pt-2">
          <Select value={crop} onValueChange={(value) => setCrop(value as Crop)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a crop" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(cropData).map(key => (
                <SelectItem key={key} value={key}>
                  {cropData[key as Crop].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" /> Sowing
            </div>
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" /> Irrigation
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={today}
          month={month}
          onMonthChange={setMonth}
          className="rounded-md p-0"
          modifiers={{
            sowing: sowingDays,
            irrigation: irrigationDays,
          }}
          modifiersStyles={{
            sowing: {
              fontWeight: 'bold',
            },
            irrigation: {
              fontWeight: 'bold',
            },
          }}
          components={DayContent}
        />
      </CardContent>
    </Card>
  );
}
