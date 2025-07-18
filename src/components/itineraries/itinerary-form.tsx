
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useItinerary } from '@/context/itinerary-context';
import { useState } from 'react';
import { useRef } from 'react';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  destination: z.string().min(2, 'Destination is required.'),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid start date' }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid end date' }),
  category: z.enum(['adventure', 'leisure', 'work']),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  photo: z.string().url('Must be a valid URL.'),
});

export function ItineraryForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { addItinerary } = useItinerary();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
      category: 'leisure',
      description: '',
      photo: 'https://placehold.co/600x400.png',
    },
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImageUrl(base64);
      form.setValue('photo', base64);
      setImageUploading(false);
      toast({ title: 'Image uploaded!', description: 'Your image has been uploaded successfully.' });
    };
    reader.onerror = () => {
      setImageUploading(false);
      toast({ variant: 'destructive', title: 'Image Upload Error', description: 'Failed to upload image.' });
    };
    reader.readAsDataURL(file);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    (async () => {
      setIsLoading(true);
      try {
        await addItinerary(values);
        toast({
          title: 'Itinerary Created!',
          description: 'Your new adventure has been saved.',
        });
        router.push('/');
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to create itinerary. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Itinerary Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image upload section */}
            <div className="flex flex-col items-center gap-4">
              {imageUrl ? (
                <img src={imageUrl} alt="Itinerary" className="w-full max-w-xs rounded-lg shadow" />
              ) : (
                <div className="w-full max-w-xs h-40 bg-muted flex items-center justify-center rounded-lg border border-dashed border-accent">
                  <span className="text-muted-foreground">No image uploaded</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
              >
                {imageUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer in the Alps" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Interlaken, Switzerland" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a trip type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="leisure">Leisure</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your trip..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto" disabled={form.formState.isSubmitting || isLoading}>
              {isLoading ? 'Creating...' : 'Create Itinerary'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
