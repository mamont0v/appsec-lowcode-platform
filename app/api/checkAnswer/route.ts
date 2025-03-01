"use server";

import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import stringSimilarity from "string-similarity";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "You must be logged in to create a game."
        },
        { status: 401 }

      )
    }
    // const userId = session.user.id;

    const body = await req.json();

    const { questionId, userInput, gameId } = checkAnswerSchema.parse(body);

    const question = await prisma.questions.findUnique({
      where: { id: questionId },
    });


    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    // Находим запись GameQuestion с использованием комбинации gameId и questionId
    const gameQuestion = await prisma.gameQuestion.findUnique({
      where: {
        gameId_questionId: {
          gameId,
          questionId
        }
      },
    });

    if (!gameQuestion) {
      return NextResponse.json(
        { message: "Game question not found" },
        { status: 404 }
      );
    }

    // Обновляем ответ пользователя
    await prisma.gameQuestion.update({
      where: { id: gameQuestion.id },  // Используем id найденной записи
      data: { userAnswer: userInput }
    });

    // Проверяем правильность ответа
    const isCorrect = stringSimilarity.compareTwoStrings(
      question.answer.toLowerCase().trim(),
      userInput.toLowerCase().trim()
    ) > 0.8;  // можно настроить порог схожести

    // Обновляем информацию о правильности ответа
    await prisma.gameQuestion.update({
      where: { id: gameQuestion.id },
      data: { isCorrect }
    });

    return NextResponse.json({
      isCorrect,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues },
        { status: 400 }
      );
    }

    // Общая ошибка на случай других исключений
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
