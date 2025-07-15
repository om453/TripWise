'use server';

import { suggestPlacesOfInterest } from '@/ai/flows/suggest-places-flow';
import type { SuggestPlacesOfInterestInput } from '@/ai/flows/suggest-places-flow';

export async function getAiSuggestions(input: SuggestPlacesOfInterestInput) {
  try {
    const result = await suggestPlacesOfInterest(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get AI suggestions.' };
  }
}
