'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FarmekoLogo } from '@/components/icons';
import { useAuth } from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Extend Window interface to include recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!auth) return;
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, [auth]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const appVerifier = window.recaptchaVerifier!;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmationResult;
      setStep(2);
      toast({ title: 'OTP Sent!', description: `An OTP has been sent to ${phone}` });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      let description = error.message || 'Please try again.';
      if (error.code === 'auth/configuration-not-found') {
          description = 'Phone sign-in is not enabled for this project. Please enable it in the Firebase Console (Authentication > Sign-in method) and add your domain to the list of authorized domains.';
      }

      toast({
        variant: "destructive",
        title: "Failed to send OTP",
        description: description,
      });
      
      // It's possible for reCAPTCHA to expire, so we can try to re-render it.
      window.recaptchaVerifier?.render().then(widgetId => {
        // @ts-ignore
        if (window.grecaptcha) {
          // @ts-ignore
          window.grecaptcha.reset(widgetId);
        }
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const confirmationResult = window.confirmationResult!;
      await confirmationResult.confirm(otp);
      toast({ title: "Success!", description: "You've been logged in."});
      router.push('/');
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
       toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: 'The OTP you entered is incorrect. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <FarmekoLogo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome to FarmekoX</CardTitle>
          <CardDescription>Your AI-powered farming assistant.</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+91 98765 43210" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          )}
          {step === 2 && (
             <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input 
                  id="otp" 
                  type="text" 
                  placeholder="123456" 
                  required 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 {isSubmitting ? 'Verifying...' : 'Verify & Login'}
              </Button>
            </form>
          )}
          <div id="recaptcha-container" className="my-4" />
        </CardContent>
        <CardFooter className="flex justify-center">
           {step === 2 && (
             <Button variant="link" size="sm" onClick={() => setStep(1)} disabled={isSubmitting}>
                Change phone number?
              </Button>
           )}
        </CardFooter>
      </Card>
    </div>
  );
}
