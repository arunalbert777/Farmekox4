import Header from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bug } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PestDiseaseIdPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon" className="h-8 w-8">
                <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Link>
            </Button>
            <h1 className="font-semibold text-lg md:text-xl">Pest & Disease ID</h1>
        </div>
        <div className="flex-1">
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>This feature will help you identify pests and diseases from photos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center h-48 bg-muted rounded-md">
                        <Bug className="h-16 w-16 text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
