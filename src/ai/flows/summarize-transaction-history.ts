// SummarizeTransactionHistory.ts
'use server';

/**
 * @fileOverview Summarizes the user's transaction history, including repayments and staking activities.
 *
 * - summarizeTransactionHistory - A function that summarizes the transaction history.
 * - SummarizeTransactionHistoryInput - The input type for the summarizeTransactionHistory function.
 * - SummarizeTransactionHistoryOutput - The return type for the summarizeTransactionHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTransactionHistoryInputSchema = z.object({
  transactionHistory: z
    .string()
    .describe(
      'A detailed log of the user transaction history, including repayment and staking activities.'
    ),
});
export type SummarizeTransactionHistoryInput = z.infer<
  typeof SummarizeTransactionHistoryInputSchema
>;

const SummarizeTransactionHistoryOutputSchema = z.object({
  summary: z.string().describe('A summarized analysis of the transaction history.'),
  averageRepaymentAmount: z
    .number()
    .describe('The average repayment amount in USD.'),
  totalYieldEarned: z.number().describe('The total yield earned in USD.'),
  potentialIssues: z
    .string()
    .describe('Any potential issues or anomalies detected in the transaction history.'),
});
export type SummarizeTransactionHistoryOutput = z.infer<
  typeof SummarizeTransactionHistoryOutputSchema
>;

export async function summarizeTransactionHistory(
  input: SummarizeTransactionHistoryInput
): Promise<SummarizeTransactionHistoryOutput> {
  return summarizeTransactionHistoryFlow(input);
}

const summarizeTransactionHistoryPrompt = ai.definePrompt({
  name: 'summarizeTransactionHistoryPrompt',
  input: {schema: SummarizeTransactionHistoryInputSchema},
  output: {schema: SummarizeTransactionHistoryOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing financial transaction histories.
  Analyze the provided transaction history to identify key trends, calculate financial metrics, and highlight any potential issues.

  Transaction History: {{{transactionHistory}}}

  Provide a concise summary, including the average repayment amount, total yield earned, and any notable anomalies or issues detected.
  Ensure that monetary amounts are returned as numbers without currency symbols.
  Potential issues should be a string describing any concerns about the account activity.
  Do not add introductory or concluding remarks. Do not include the units or currency symbols in the output numbers.
`,
});

const summarizeTransactionHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeTransactionHistoryFlow',
    inputSchema: SummarizeTransactionHistoryInputSchema,
    outputSchema: SummarizeTransactionHistoryOutputSchema,
  },
  async input => {
    const {output} = await summarizeTransactionHistoryPrompt(input);
    return output!;
  }
);
