'use client';

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Loader2, Upload, Leaf } from 'lucide-react';
import { getPestOrDiseaseId } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Label } from '@/components/ui/label';

const initialPestOrDiseaseIdState:
  | { result: { isPlant: boolean; isHealthy: boolean; details: string } }
  | { error: string }
  | null = null;

export default function PestDiseaseId() {
  const [state, formAction, isPending] = useActionState(
    getPestOrDiseaseId,
    initialPestOrDiseaseIdState
  );
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUri);

        const formData = new FormData();
        formData.append('photoDataUri', dataUri);
        formAction(formData);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setImagePreview(dataUri);
        const formData = new FormData();
        formData.append('photoDataUri', dataUri);
        formAction(formData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pest & Disease ID</CardTitle>
        <CardDescription>
          Take a photo of a plant to identify pests and diseases.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="aspect-video w-full bg-muted rounded-md overflow-hidden flex items-center justify-center">
              {hasCameraPermission === true && (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
              )}
               {hasCameraPermission === false && (
                <div className="text-center text-muted-foreground p-4">
                  <Camera className="mx-auto h-12 w-12" />
                  <p>Camera not available or permission denied.</p>
                </div>
              )}
               {hasCameraPermission === null && (
                 <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCapture}
                className="w-full"
                disabled={isPending || !hasCameraPermission}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}
                Capture Photo
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            {hasCameraPermission === false && (
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature. You can still
                  upload an image.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="space-y-2">
            <Label>Result</Label>
            <Card className="h-[calc(100%-1.5rem-8px)]">
              <ScrollArea className="h-full">
                <CardContent className="p-4">
                  {isPending && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <p>Analyzing image...</p>
                    </div>
                  )}
                  {state && 'result' in state && state.result && (
                    <div className="space-y-4">
                       {imagePreview && <Image src={imagePreview} alt="Captured image" width={400} height={300} className="rounded-md object-cover" />}
                      {!state.result.isPlant ? (
                        <p>This does not appear to be a plant.</p>
                      ) : (
                        <>
                          <p>
                            <strong>Status:</strong>{' '}
                            {state.result.isHealthy
                              ? 'Healthy'
                              : 'Potential Issues Detected'}
                          </p>
                          <div>
                            <strong>Details:</strong>
                            <div className="text-sm whitespace-pre-wrap font-sans mt-1 prose prose-sm dark:prose-invert">
                              <pre>{state.result.details}</pre>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {!isPending && !state && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2">
                        <Leaf className="h-10 w-10" />
                        <p>Capture or upload an image to begin diagnosis.</p>
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
