
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
import { storage } from '@/lib/utils';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const TAG_OPTIONS = ['Leisure', 'Adventure', 'Work'];

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  destination: z.string().min(2, 'Destination is required.'),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid start date' }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid end date' }),
  categories: z.array(z.string()).min(1, 'Select at least one category.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  photo: z.string().url('Must be a valid URL.'),
});

export function ItineraryForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { addItinerary } = useItinerary();
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
      categories: [],
      description: '',
      photo: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    (async () => {
      setIsLoading(true);
      try {
        await addItinerary(values);
        // Check if activities were added (location found)
        // This logic assumes addItinerary returns nothing, so we check after
        // If you want more robust feedback, refactor addItinerary to return a status
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    let timeoutId: NodeJS.Timeout | null = null;
    try {
      // Timeout after 30 seconds
      const uploadPromise = new Promise<string>(async (resolve, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Upload timed out. Please try again.')), 30000);
        try {
          const storageRef = ref(storage, `itinerary-images/${Date.now()}-${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      });
      const url = await uploadPromise;
      form.setValue('photo', url);
      toast({ title: 'Image uploaded!', description: 'Your image has been uploaded successfully.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Error', description: error?.message || 'Failed to upload image.' });
      form.setValue('photo', '');
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setUploading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Itinerary Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {TAG_OPTIONS.map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          className={`px-3 py-1 rounded-full border transition-all ${field.value.includes(tag) ? 'bg-accent text-white border-accent' : 'bg-muted text-muted-foreground border-muted'}`}
                          onClick={() => {
                            if (field.value.includes(tag)) {
                              field.onChange(field.value.filter((t: string) => t !== tag));
                            } else {
                              field.onChange([...field.value, tag]);
                            }
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                      {/* Custom tag input */}
                      <input
                        type="text"
                        placeholder="Add custom tag"
                        className="px-2 py-1 border rounded-full text-sm"
                        onKeyDown={e => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            e.preventDefault();
                            if (!field.value.includes(e.currentTarget.value.trim())) {
                              field.onChange([...field.value, e.currentTarget.value.trim()]);
                            }
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Select one or more categories or add your own.</FormDescription>
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
             <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Photo</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      {field.value && (
                        <img src={field.value} alt="Itinerary Cover" className="w-full h-40 object-cover rounded-lg border" />
                      )}
                      <Input type="hidden" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>Upload a cover image for your itinerary.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto" disabled={form.formState.isSubmitting || isLoading || uploading || !form.getValues('photo')}>
              {uploading ? (
                <>
                  <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-t-transparent border-accent rounded-full align-middle"></span>
                  Uploading Image...
                </>
              ) : isLoading ? 'Creating...' : 'Create Itinerary'}
            </Button>
            {uploading && (
              <span className="text-accent text-sm ml-4">Uploading image, please wait...</span>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
