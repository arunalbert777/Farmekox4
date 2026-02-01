'use client';

import { useState, useRef, useEffect, useActionState, useTransition, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Mic, Bot, User, Loader2, Volume2, MicOff } from 'lucide-react';
import { getAiRecommendation, getAudioForText } from '@/lib/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
}

const initialChatState: { recommendation: string; language: string } | { error: string } | null = null;
const initialAudioState: { audio: string } | { error: string } | null = null;

let speechRecognition: SpeechRecognition | null = null;

export default function AiAssistant() {
  const [chatState, chatFormAction, isChatPending] = useActionState(getAiRecommendation, initialChatState);
  const [audioState, audioFormAction, isAudioPending] = useActionState(getAudioForText, initialAudioState);
  const [isChatTransitionPending, startChatTransition] = useTransition();
  const [isAudioTransitionPending, startAudioTransition] = useTransition();

  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState('');
  const { toast } = useToast();
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const processedRecommendation = useRef<string | null>(null);

  const handleChatSubmit = useCallback((text: string) => {
    if (text.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      const formData = new FormData();
      formData.append('userInput', text);
      formData.append('language', language);
      startChatTransition(() => {
        chatFormAction(formData);
      });
      setUserInput('');
    }
  }, [language, chatFormAction, startChatTransition]);

  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "Speech Recognition Not Supported",
        description: "Your browser does not support speech recognition.",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;

    speechRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleChatSubmit(transcript);
    };

    speechRecognition.onerror = (event) => {
      toast({
        variant: "destructive",
        title: "Speech Recognition Error",
        description: event.error,
      });
      setIsListening(false);
    };

     speechRecognition.onstart = () => {
      setIsListening(true);
    };

    speechRecognition.onend = () => {
      setIsListening(false);
    };

  }, [toast, handleChatSubmit]);

  useEffect(() => {
    if (chatState && 'recommendation' in chatState && chatState.recommendation) {
        if (processedRecommendation.current !== chatState.recommendation) {
            const newMessage: Message = { role: 'assistant', content: chatState.recommendation };
            setMessages((prev) => [...prev, newMessage]);

            const formData = new FormData();
            formData.append('text', chatState.recommendation);
            formData.append('language', chatState.language);
            startAudioTransition(() => {
                audioFormAction(formData);
            });
            processedRecommendation.current = chatState.recommendation;
        }
    } else if (chatState && 'error' in chatState && chatState.error) {
        toast({
            variant: "destructive",
            title: "AI Error",
            description: chatState.error,
        });
    }
  }, [chatState, toast, audioFormAction, startAudioTransition]);

   useEffect(() => {
    if (audioState) {
      if ('audio' in audioState && audioState.audio) {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.audioUrl) {
            lastMessage.audioUrl = audioState.audio;
          }
          return newMessages;
        });

        if (audioRef.current) {
          audioRef.current.src = audioState.audio;
          audioRef.current.play();
        }
      } else if ('error' in audioState && audioState.error) {
        toast({
          variant: "destructive",
          title: "Audio Error",
          description: audioState.error,
        });
      }
    }
  }, [audioState, toast]);

  useEffect(() => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTo({
        top: chatScrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleMicClick = () => {
    if (isListening) {
      speechRecognition?.stop();
    } else {
      if(speechRecognition) {
        speechRecognition.lang = language === 'kn' ? 'kn-IN' : 'en-US';
        speechRecognition.start();
      }
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleChatSubmit(userInput);
  }

  const playAudio = (audioUrl: string) => {
    if(audioRef.current){
        audioRef.current.src = audioUrl;
        audioRef.current.play();
    }
  };

  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');
  const isProcessing = isChatPending || isAudioPending || isAudioTransitionPending || isChatTransitionPending;

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Your smart farming partner for expert advice.</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
                <Label htmlFor="language-toggle" className="text-sm font-medium">EN</Label>
                <Switch 
                  id="language-toggle" 
                  checked={language === 'kn'}
                  onCheckedChange={(checked) => setLanguage(checked ? 'kn' : 'en')}
                  disabled={isProcessing}
                />
                <Label htmlFor="language-toggle" className="text-sm font-medium">KN</Label>
            </div>
          </div>
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
                      {message.role === 'assistant' && message.audioUrl && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 mt-1" onClick={() => playAudio(message.audioUrl!)}>
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      )}
                       {message.role === 'assistant' && !message.audioUrl && isProcessing && index === messages.length - 1 && (
                          <Loader2 className="h-4 w-4 mt-1 animate-spin" />
                       )}
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
            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div className="relative">
                <Textarea
                  name="userInput"
                  placeholder="Ask for crop recommendations..."
                  className="pr-24"
                  required
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isProcessing}
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1">
                    <Button type="button" size="icon" variant={isListening ? "destructive" : "ghost"} onClick={handleMicClick} disabled={isProcessing}>
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button type="submit" size="icon" variant="ghost" disabled={isProcessing}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            </form>
            <audio ref={audioRef} className="hidden" />
          </CardContent>
    </Card>
  );
}
