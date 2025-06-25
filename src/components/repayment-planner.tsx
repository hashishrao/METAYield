'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Sparkles } from 'lucide-react';

import {
  analyzeYieldStrategy,
  type AnalyzeYieldStrategyOutput,
} from '@/ai/flows/analyze-yield-strategy';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';

const formSchema = z.object({
  spendingAmount: z.coerce
    .number({
      required_error: 'Please enter your monthly spending.',
      invalid_type_error: 'Please enter a valid number.',
    })
    .positive('Spending must be a positive number.'),
  riskTolerance: z.enum(['conservative', 'balanced', 'aggressive'], {
    required_error: 'Please select your risk tolerance.',
  }),
});

export function RepaymentPlanner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeYieldStrategyOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      spendingAmount: 1500,
      riskTolerance: 'balanced',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const aiResult = await analyzeYieldStrategy({
        // In a real app, this would be fetched from the user's connected wallet and protocols.
        currentYield: 7.8,
        spendingAmount: values.spendingAmount,
        riskTolerance: values.riskTolerance,
      });
      setResult(aiResult);
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'Could not generate a strategy. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="h-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          AI Repayment Planner
        </CardTitle>
        <CardDescription>
          Tell us your spending and risk tolerance to get a custom repayment plan.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="spendingAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Spending (USDC)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 1500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="riskTolerance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Tolerance</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your risk level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                'Analyze Strategy'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>

      {(loading || result) && (
        <CardContent>
          <div className="mt-6 rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-medium">Suggested Strategy</h3>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge
                    variant={result.repaymentFeasibility ? 'default' : 'destructive'}
                    className="capitalize"
                  >
                    {result.suggestedStrategy}
                  </Badge>
                  {result.repaymentFeasibility ? (
                     <span className="text-sm font-medium text-green-600">Feasible</span>
                  ) : (
                     <span className="text-sm font-medium text-destructive">Not Feasible</span>
                  )}
                </div>
                <div className="flex items-start gap-3 rounded-md bg-muted p-3 text-sm">
                  <Sparkles className="mt-1 size-5 shrink-0 animate-pulse text-primary" />
                  <p className="text-muted-foreground">{result.explanation}</p>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
