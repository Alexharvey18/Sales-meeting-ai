import { z } from 'zod';

const envSchema = z.object({
  VITE_OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
});

export function validateEnv() {
  const parsed = envSchema.safeParse({
    VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables: ${parsed.error.errors.map(e => e.message).join(', ')}`
    );
  }
}