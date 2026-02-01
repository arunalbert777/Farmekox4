'use client';

import { useActionState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Loader2 } from 'lucide-react';
import { getFertilizerId } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const initialFertilizerState: { result: string } | { error: string } | null = null;

export default function FertilizerId() {
  const [fertilizerState, fertilizerFormAction, isFertilizerPending] = useActionState(getFertilizerId, initialFertilizerState);
  const { toast } = useToast();

  useEffect(() => {
    if (fertilizerState && 'error' in fertilizerState && fertilizerState.error) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: fertilizerState.error,
      });
    }
  }, [fertilizerState, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fertilizer ID</CardTitle>
        <CardDescription>Identify fertilizer by providing details and a barcode scan (simulated).</CardDescription>
      </CardHeader>
      <CardContent>
         <form action={fertilizerFormAction} className="space-y-4">
            <div className="space-y-2">
                <Label>Crop Type</Label>
                <Input name="cropType" placeholder="e.g. Tomato" required />
            </div>
            <div className="space-y-2">
                <Label>Location</Label>
                <Input name="location" placeholder="e.g. Kolar" required />
            </div>
             <div className="space-y-2">
                <Label>Weather Conditions</Label>
                <Input name="weatherConditions" placeholder="e.g. Humid, 28C" required />
            </div>
            <Button type="submit" className="w-full" disabled={isFertilizerPending}>
                {isFertilizerPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Camera className="mr-2 h-4 w-4" />}
                Identify from Barcode
            </Button>
         </form>
          {fertilizerState && 'result' in fertilizerState && fertilizerState.result && (
            <div className="mt-4 flex-grow">
                <Label className="font-bold">Result</Label>
                <ScrollArea className="h-48 mt-2 w-full rounded-md border p-4">
                    <pre className="text-sm whitespace-pre-wrap font-sans">{fertilizerState.result}</pre>
                </ScrollArea>
            </div>
         )}
      </CardContent>
    </Card>
  );
}
