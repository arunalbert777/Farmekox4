'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sprout } from '@/components/icons';
import { useAuth } from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, signInAnonymously } from 'firebase/auth';
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
  const [guestSubmitting, setGuestSubmitting] = useState(false);

  useEffect(() => {
    if (!auth) return;
    if (step === 1 && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, [auth, step]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const appVerifier = window.recaptchaVerifier!;
      
      let phoneNumber = phone;
      if (!phoneNumber.startsWith('+')) {
        // Assuming a 10 digit Indian number if no country code is given, based on the placeholder.
        phoneNumber = `+91${phoneNumber.replace(/\s/g, '')}`;
      }

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setStep(2);
      toast({ title: 'OTP Sent!', description: `An OTP has been sent to ${phoneNumber}` });
    } catch (error: any)
      {
      console.error("Error sending OTP:", error);
      let description = error.message || 'Please try again.';
      if (error.code === 'auth/configuration-not-found') {
          description = 'Phone sign-in is not enabled for this project. Please enable it in the Firebase Console (Authentication > Sign-in method) and add your domain to the list of authorized domains.';
      } else if (error.code === 'auth/invalid-phone-number') {
        description = 'The phone number format is invalid. Please use the E.164 format (e.g. +919876543210).';
      }

      toast({
        variant: "destructive",
        title: "Failed to send OTP",
        description: description,
      });
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
            // @ts-ignore
            if (window.grecaptcha) {
            // @ts-ignore
            window.grecaptcha.reset(widgetId);
            }
        });
      }

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

  const handleGuestLogin = async () => {
    if (!auth) return;
    setGuestSubmitting(true);
    try {
        await signInAnonymously(auth);
        toast({ title: 'Success!', description: "You've logged in as a guest." });
        router.push('/');
    } catch (error: any) {
        console.error("Error signing in as guest:", error);
        toast({
            variant: 'destructive',
            title: 'Guest login failed',
            description: error.message || 'Could not sign in as guest.',
        });
    } finally {
        setGuestSubmitting(false);
    }
  };
  
  const anySubmitting = isSubmitting || guestSubmitting;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Sprout className="h-12 w-12 text-primary" />
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
                  disabled={anySubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={anySubmitting}>
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

          {step === 1 && (
            <>
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                        </span>
                    </div>
                </div>

                <Button variant="outline" className="w-full" onClick={handleGuestLogin} disabled={anySubmitting}>
                    {guestSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guest Login
                </Button>
            </>
          )}

          <div id="recaptcha-container" className="mt-4" />
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
