"use server";

import { quizCreationSchema } from '@/schemas/forms/quiz';
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db"; // Импортируем Prisma Client
import { auth } from '@/auth';

// export const runtime = "nodejs";
// export const maxDuration = 500;

// POST api/questions
export const POST = async (req: Request, res: Response) => {
  try {
    // check auth
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Please auth"
        },
        { status: 401 }

      )
    }
    // const userId = session.user.id;


    const body = await req.json();
    const { topic } = quizCreationSchema.parse(body);

    if (!topic) {
      return NextResponse.json(
        { error: "Topic ID is required" },
        { status: 400 }
      );
    }

    // Извлекаем вопросы, связанные с конкретным топиком
    const questions: any = await prisma.questions.findMany({
      where: {
        topicId: topic,
      },
    });

    return NextResponse.json(
      {
        questions: questions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues },
        { status: 500 }
      )
    }
  };
}