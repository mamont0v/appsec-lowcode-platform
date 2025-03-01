"use server";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { auth } from "@/auth";

// POST api/game
export async function POST(req: Request, res: Response) {
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
    const userId = session.user.id;


    const body = await req.json(); // получаем id топика
    const { topic } = body;
    // Создаем игру
    const game = await prisma.game.create({
      data: {
        timeStarted: new Date(),
        userId: userId, //
        score: 0,
        topicId: topic
      }
    });


    // Получение вопросов из базы данных
    const questions = await prisma.questions.findMany({
      where: { topicId: topic },
    });

    // Получаем вопросы с бека
    // const { data } = await axios.post(`${process.env.API_URL as string}/api/questions`, { topic });



    // type manyQuestions = {
    //   id: string,
    //   question: string,
    //   answer: string,
    //   options: [string, string, string, string]
    // }

    // Создаем ассоциации игры и вопросов
    const gameQuestions = questions.map((question) => {
      return {
        gameId: game.id,
        questionId: question.id, // Здесь мы используем существующий question ID
      };
    });

    await prisma.gameQuestion.createMany({ data: gameQuestions });

    return NextResponse.json({ gameId: game.id }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: "Failed to fetch questions from backend." },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        { status: 500 }
      );
    }
  }
}
