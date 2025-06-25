'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Loader2,
  Sparkles,
  BadgeCheck,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

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
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionComplete, setExecutionComplete] = useState(false);
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
    setExecutionComplete(false);
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

  const handleExecute = async () => {
    setIsExecuting(true);
    // Simulate API call to a smart contract
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsExecuting(false);
    setExecutionComplete(true);
    // The AlertDialog will close automatically on action click
  };

  return (
    <Card className="flex h-full flex-col shadow-lg">
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

      <CardContent className="flex-1">
        {loading && (
          <div className="mt-6 rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-medium">Analyzing...</h3>
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/2 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          </div>
        )}

        {result && !executionComplete && (
           <div className="mt-6 rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-medium">Suggested Strategy</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge
                  variant={result.repaymentFeasibility ? 'default' : 'destructive'}
                  className="capitalize"
                >
                  {result.suggestedStrategy}
                </Badge>
                <span className={cn(
                  "text-sm font-medium",
                  result.repaymentFeasibility ? "text-green-600" : "text-destructive"
                )}>
                  {result.repaymentFeasibility ? "Feasible" : "Not Feasible"}
                </span>
              </div>
              <div className="flex items-start gap-3 rounded-md bg-muted p-3 text-sm">
                <Sparkles className="mt-1 size-5 shrink-0 animate-pulse text-primary" />
                <p className="text-muted-foreground">{result.explanation}</p>
              </div>

              <div className="space-y-2 rounded-md border bg-background/50 p-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Yield Coverage</span>
                    <span className={cn("font-medium", result.yieldCoverageRatio < 1 ? "text-destructive" : "text-green-600")}>
                        {(result.yieldCoverageRatio * 100).toFixed(0)}%
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Gas Fee</span>
                    <span className="font-medium">${result.estimatedGasFee.toFixed(2)}</span>
                </div>
              </div>

              {result.repaymentFeasibility && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full">
                      Execute Repayment
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Repayment</AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to execute a repayment of{' '}
                        <b>{form.getValues('spendingAmount').toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</b>
                        . This action will use your generated yield and incur a small gas fee.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleExecute} disabled={isExecuting}>
                        {isExecuting ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          'Confirm & Execute'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
           </div>
        )}
        
        {executionComplete && (
            <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-center">
              <BadgeCheck className="mb-3 size-12 text-green-600" />
              <h3 className="text-lg font-semibold text-green-700">Repayment Executed!</h3>
              <p className="mb-4 text-sm text-green-600/80">
                Your transaction has been submitted successfully.
              </p>
              <Button asChild variant="link">
                <Link href="https://goerli.lineascan.build/blocks" target="_blank" rel="noopener noreferrer">
                  View CCTP Transfer (Testnet) <ExternalLink className="ml-2" />
                </Link>
              </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
