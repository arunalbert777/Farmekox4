'use client';

import { useState, useRef, useEffect, useActionState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Mic, Bot, User, Loader2 } from 'lucide-react';
import { getAiRecommendation } from '@/lib/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const initialChatState: { recommendation: string } | { error: string } | null = null;

export default function AiAssistant() {
  const [chatState, chatFormAction, isChatPending] = useActionState(getAiRecommendation, initialChatState);

  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatState) {
        if ('recommendation' in chatState && chatState.recommendation) {
          setMessages((prev) => [...prev, { role: 'assistant', content: chatState.recommendation }]);
        } else if ('error' in chatState && chatState.error) {
          toast({
            variant: "destructive",
            title: "AI Error",
            description: chatState.error,
          });
        }
    }
  }, [chatState, toast]);

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
      chatFormAction(formData);
      const form = document.getElementById('chat-form') as HTMLFormElement;
      form.reset();
    }
  };

  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>Your smart farming partner for expert advice.</CardDescription>
        </CardHeader>
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
              <div className="relative">
                <Textarea
                  name="userInput"
                  placeholder="Ask for crop recommendations... Please provide details like location, weather, soil type etc."
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
    </Card>
  );
}
