'use client';

import { useState, useRef, useEffect, useActionState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Mic, Paperclip, Bot, User, Camera, Loader2 } from 'lucide-react';
import { getAiRecommendation, getFertilizerId } from '@/lib/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const initialChatState: { recommendation: string } | { error: string } = { recommendation: '' };
const initialFertilizerState: { result: string } | { error: string } = { result: '' };

export default function AiAssistant() {
  const [chatState, chatFormAction] = useActionState(getAiRecommendation, initialChatState);
  const [fertilizerState, fertilizerFormAction] = useActionState(getFertilizerId, initialFertilizerState);

  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [isChatPending, setIsChatPending] = useState(false);
  const [isFertilizerPending, setIsFertilizerPending] = useState(false);

  useEffect(() => {
    if ('recommendation' in chatState && chatState.recommendation) {
      setMessages((prev) => [...prev, { role: 'assistant', content: chatState.recommendation }]);
    } else if ('error' in chatState && chatState.error) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: chatState.error,
      });
    }
    setIsChatPending(false);
  }, [chatState]);

  useEffect(() => {
    if ('error' in fertilizerState && fertilizerState.error) {
       toast({
        variant: "destructive",
        title: "AI Error",
        description: fertilizerState.error,
      });
    }
     setIsFertilizerPending(false);
  }, [fertilizerState]);

  useEffect(() => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTo({
        top: chatScrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleChatSubmit = (formData: FormData) => {
    const userInput = formData.get('userInput') as string;
    if (userInput.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: userInput }]);
      setIsChatPending(true);
      chatFormAction(formData);
      const form = document.getElementById('chat-form') as HTMLFormElement;
      form.reset();
    }
  };

  const handleFertilizerSubmit = (formData: FormData) => {
      setIsFertilizerPending(true);
      fertilizerFormAction(formData);
  }

  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <Card className="h-full">
      <Tabs defaultValue="crop-advisor" className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>Your smart farming partner for expert advice.</CardDescription>
          <TabsList className="grid w-full grid-cols-2 mt-2">
            <TabsTrigger value="crop-advisor">Crop Advisor</TabsTrigger>
            <TabsTrigger value="fertilizer-id">Fertilizer ID</TabsTrigger>
          </TabsList>
        </CardHeader>

        <TabsContent value="crop-advisor" className="flex-grow flex flex-col h-0">
          <CardContent className="flex-grow flex flex-col h-0">
            <ScrollArea className="flex-grow pr-4 -mr-4 h-0" ref={chatScrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`rounded-lg px-3 py-2 max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User" />}
                        <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isChatPending && (
                    <div className="flex items-start gap-3">
                         <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                         <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                           <Loader2 className="h-5 w-5 animate-spin"/>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
            <form action={handleChatSubmit} id="chat-form" className="mt-4 space-y-4">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                 <Input name="location" placeholder="Location (e.g. Belgaum)" required className="text-xs h-8" />
                 <Input name="weatherConditions" placeholder="Weather (e.g. Sunny, 30C)" required className="text-xs h-8" />
                 <Input name="soilConditions" placeholder="Soil (e.g. Loamy)" required className="text-xs h-8" />
                 <Input name="cropType" placeholder="Crop (e.g. Sugarcane)" required className="text-xs h-8" />
               </div>
              <div className="relative">
                <Textarea
                  name="userInput"
                  placeholder="Ask about crop recommendations..."
                  className="pr-24"
                  required
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1">
                    <Button type="button" size="icon" variant="ghost">
                        <Mic className="h-4 w-4" />
                    </Button>
                    <Button type="submit" size="icon" variant="ghost" disabled={isChatPending}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </TabsContent>

        <TabsContent value="fertilizer-id" className="flex-grow flex flex-col h-0">
          <CardContent className="flex-grow flex flex-col h-0">
             <form action={handleFertilizerSubmit} className="space-y-4">
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
              {'result' in fertilizerState && fertilizerState.result && (
                <div className="mt-4 flex-grow">
                    <Label className="font-bold">Result</Label>
                    <ScrollArea className="h-48 mt-2 w-full rounded-md border p-4">
                        <pre className="text-sm whitespace-pre-wrap font-sans">{fertilizerState.result}</pre>
                    </ScrollArea>
                </div>
             )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
