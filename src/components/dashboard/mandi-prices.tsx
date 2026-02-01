import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';

const mandiData = [
  { crop: 'Paddy', price: '₹2,183', change: '+2.5%', status: 'up' },
  { crop: 'Wheat', price: '₹2,275', change: '-1.2%', status: 'down' },
  { crop: 'Maize', price: '₹2,090', change: '+0.8%', status: 'up' },
  { crop: 'Cotton', price: '₹6,620', change: '+3.1%', status: 'up' },
  { crop: 'Soybean', price: '₹4,650', change: '-0.5%', status: 'down' },
];

export default function MandiPrices() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="grid gap-1">
                <CardTitle>Mandi Prices</CardTitle>
                <CardDescription>Live prices from your local market.</CardDescription>
            </div>
            <Badge variant="outline" className="border-primary text-primary">Live</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop</TableHead>
              <TableHead className="text-right">Price (per Quintal)</TableHead>
              <TableHead className="text-right">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mandiData.map((item) => (
              <TableRow key={item.crop}>
                <TableCell className="font-medium">{item.crop}</TableCell>
                <TableCell className="text-right font-semibold">{item.price}</TableCell>
                <TableCell className="text-right">
                  <div
                    className={`flex items-center justify-end gap-1 ${
                      item.status === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.status === 'up' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    <span>{item.change}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
