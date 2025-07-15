'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting places of interest to extend a travel itinerary.
 *
 * The flow takes a location and planned activities as input and uses local tourism web resources to suggest additional sights.
 *
 * @fileOverview
 * - `suggestPlacesOfInterest`: Asynchronously suggests places of interest based on a given location and planned activities.
 * - `SuggestPlacesOfInterestInput`: Interface defining the input schema for the `suggestPlacesOfInterest` function.
 * - `SuggestPlacesOfInterestOutput`: Interface defining the output schema for the `suggestPlacesOfInterest` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPlacesOfInterestInputSchema = z.object({
  location: z.string().describe('The location for which to suggest places of interest.'),
  activities: z.string().describe('The activities already planned in the itinerary.'),
});
export type SuggestPlacesOfInterestInput = z.infer<
  typeof SuggestPlacesOfInterestInputSchema
>;

const SuggestPlacesOfInterestOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('A list of suggested places of interest based on the location and activities.'),
});
export type SuggestPlacesOfInterestOutput = z.infer<
  typeof SuggestPlacesOfInterestOutputSchema
>;

export async function suggestPlacesOfInterest(
  input: SuggestPlacesOfInterestInput
): Promise<SuggestPlacesOfInterestOutput> {
  return suggestPlacesOfInterestFlow(input);
}

const suggestPlacesOfInterestPrompt = ai.definePrompt({
  name: 'suggestPlacesOfInterestPrompt',
  input: {schema: SuggestPlacesOfInterestInputSchema},
  output: {schema: SuggestPlacesOfInterestOutputSchema},
  prompt: `You are a travel expert specializing in suggesting places of interest based on location and planned activities.

  Given the following location and planned activities, suggest additional places of interest using local tourism web resources.

  Location: {{{location}}}
  Planned Activities: {{{activities}}}

  Suggestions:`, // Ensure this value is properly formatted and safe for code.
});

const suggestPlacesOfInterestFlow = ai.defineFlow(
  {
    name: 'suggestPlacesOfInterestFlow',
    inputSchema: SuggestPlacesOfInterestInputSchema,
    outputSchema: SuggestPlacesOfInterestOutputSchema,
  },
  async input => {
    const {output} = await suggestPlacesOfInterestPrompt(input);
    return output!;
  }
);
