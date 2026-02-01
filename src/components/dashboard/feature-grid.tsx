import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, CalendarDays, Map, Bot } from 'lucide-react';

const features = [
  {
    title: 'AI Assistant',
    description: 'Crop & fertilizer advice',
    href: '/ai-assistant',
    icon: Bot,
  },
  {
    title: 'Mandi Prices',
    description: 'Live market rates',
    href: '/mandi-prices',
    icon: BarChart,
  },
  {
    title: 'Crop Calendar',
    description: 'Sowing & irrigation schedule',
    href: '/crop-calendar',
    icon: CalendarDays,
  },
  {
    title: 'Nearby Resources',
    description: 'Find stores & mandis',
    href: '/map-view',
    icon: Map,
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <Link href={feature.href} key={feature.href} className="flex">
          <Card className="w-full hover:bg-muted/50 transition-colors">
            <CardHeader>
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                    <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
