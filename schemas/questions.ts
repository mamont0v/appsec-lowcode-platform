import { z } from "zod";

export const getQuestionsSchema = z.object({
  topic: z.string()
});

export const checkAnswerSchema = z.object({
  userInput: z.string(),
  questionId: z.string(),
  gameId: z.string(),
});

export const endGameSchema = z.object({
  gameId: z.string(),
});
