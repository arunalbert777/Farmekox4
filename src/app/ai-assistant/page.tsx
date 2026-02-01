import AiAssistant from '@/components/dashboard/ai-assistant';
import Header from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AiAssistantPage() {
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
            <h1 className="font-semibold text-lg md:text-xl">AI Assistant</h1>
        </div>
        <div className="flex-1">
            <AiAssistant />
        </div>
      </main>
    </div>
  );
}
