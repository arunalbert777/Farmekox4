import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, CalendarDays, Map, Bot, TestTube, Bug } from 'lucide-react';

const features = [
  {
    title: 'AI Assistant',
    description: 'Get crop advice',
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
  {
    title: 'Fertilizer ID',
    description: 'Identify from barcode',
    href: '/fertilizer-id',
    icon: TestTube,
  },
  {
    title: 'Pest & Disease ID',
    description: 'Identify crop issues',
    href: '/pest-disease-id',
    icon: Bug,
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
