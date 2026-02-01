'use client';

import { useState } from 'react';
import { addDays, startOfMonth } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, type CalendarProps } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [month, setMonth] = useState(new Date());

  const today = new Date();
  const startOfSelectedMonth = startOfMonth(month);

  const sowingDays = cropData[crop].sowing.map(day => addDays(startOfSelectedMonth, day - 1));
  const irrigationDays = cropData[crop].irrigation.map(day => addDays(startOfSelectedMonth, day - 1));

  const DayContent: CalendarProps['components'] = {
    Day: ({ date }) => {
        const isSowingDay = sowingDays.some(d => d.toDateString() === date.toDateString());
        const isIrrigationDay = irrigationDays.some(d => d.toDateString() === date.toDateString());
        
        return (
            <div className="relative h-full w-full">
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
