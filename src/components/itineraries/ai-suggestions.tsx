'use client';

import * as React from 'react';
import { Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAiSuggestions } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface AiSuggestionsProps {
  location: string;
  activities: string;
}

export function AiSuggestions({ location, activities }: AiSuggestionsProps) {
  const [suggestions, setSuggestions] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setSuggestions(null);
    const result = await getAiSuggestions({ location, activities });
    setIsLoading(false);

    if (result.success && result.data) {
      setSuggestions(result.data.suggestions);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  function cleanSuggestion(text: string): string {
    // Remove markdown, asterisks, and excessive formatting
    return text
      .replace(/\*\*/g, '') // remove bold
      .replace(/\*/g, '') // remove asterisks
      .replace(/\n+/g, ' ') // replace newlines with space
      .replace(/\s+/g, ' ') // collapse whitespace
      .replace(/\s([.,!?:;])/g, '$1') // remove space before punctuation
      .trim();
  }

  function formatSuggestion(text: string): JSX.Element {
    // Split into points by common delimiters
    const points = text
      .replace(/\*\*/g, '') // remove bold markdown
      .split(/\* |\n|\d+\. /) // split on bullet or numbered list
      .map(s => s.trim())
      .filter(Boolean);

    // Bold place names or key attractions (first phrase before colon or dash)
    return (
      <ul className="list-disc pl-6 space-y-2">
        {points.map((point, idx) => {
          // Try to bold the first phrase before a colon or dash
          const match = point.match(/^([^:–-]+)[:–-](.*)$/);
          if (match) {
            return (
              <li key={idx}>
                <span className="font-bold text-accent">{match[1].trim()}:</span>
                <span> {match[2].trim()}</span>
              </li>
            );
          }
          return <li key={idx}>{point}</li>;
        })}
      </ul>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-accent" />
            AI Trip Recommendations
        </CardTitle>
        <CardDescription>
          Get AI-powered suggestions to enhance your trip based on your current plans.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!suggestions && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">Click the button to get started!</p>
            <Button onClick={handleGetSuggestions} disabled={isLoading}>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Suggestions
            </Button>
          </div>
        )}

        {isLoading && (
            <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        )}

        {suggestions && (
          <div className="prose prose-sm max-w-none text-muted-foreground">
            {formatSuggestion(suggestions)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
