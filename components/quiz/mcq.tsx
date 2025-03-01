"use client"
import { Game, Questions } from "@prisma/client";
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "../ui/button";
import { differenceInSeconds } from "date-fns";
import Link from "next/link";
import { BarChart, ChevronLeft, ChevronRight, Loader2, Timer } from "lucide-react";
import { checkAnswerSchema, endGameSchema } from "@/schemas/questions";
import { cn, formatTimeDelta } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import MCQCounter from "./mcq-counter";

type Props = {
  game: Game & { questions: Pick<Questions, "id" | "options" | "question">[] };
};

const MCQ = ({ game }: Props) => {
  const shuffledQuestions = React.useMemo(() => {
    return [...game.questions].sort(() => Math.random() - 0.5);
  }, [game.questions]);
  const [answered, setAnswered] = React.useState(false);

  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [hasEnded, setHasEnded] = React.useState(false);
  const [stats, setStats] = React.useState({
    correct_answers: 0,
    wrong_answers: 0,
  });
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
  const [now, setNow] = React.useState(new Date());

  const currentQuestion = React.useMemo(() => {
    return shuffledQuestions[questionIndex];
  }, [questionIndex, shuffledQuestions]);

  const options = React.useMemo(() => {
    if (!currentQuestion || !currentQuestion.options) return [];
    return currentQuestion.options;
  }, [currentQuestion]);

  const { toast } = useToast();
  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: options[selectedChoice],
        gameId: game.id,
      };
      const response = await axios.post(`/api/checkAnswer`, payload);
      return response.data;
    },
  });

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };
      const response = await axios.post(`/api/endGame`, payload);
      return response.data;
    },
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  React.useEffect(() => {
    const savedStats = sessionStorage.getItem(`quiz_stats_${game.id}`);
    const savedHasEnded = sessionStorage.getItem(`quiz_hasEnded_${game.id}`);
    const savedQuestionIndex = sessionStorage.getItem(`quiz_questionIndex_${game.id}`);
    const savedSelectedChoice = sessionStorage.getItem(`quiz_selectedChoice_${game.id}`);

    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    if (savedHasEnded === "true") {
      setHasEnded(true);
    }

    if (savedQuestionIndex) {
      setQuestionIndex(Number(savedQuestionIndex));
    }

    if (savedSelectedChoice) {
      setSelectedChoice(Number(savedSelectedChoice));
    }
  }, [game.id]);

  React.useEffect(() => {
    sessionStorage.setItem(`quiz_stats_${game.id}`, JSON.stringify(stats));
    sessionStorage.setItem(`quiz_hasEnded_${game.id}`, hasEnded.toString());
    sessionStorage.setItem(`quiz_questionIndex_${game.id}`, questionIndex.toString());
    sessionStorage.setItem(`quiz_selectedChoice_${game.id}`, selectedChoice.toString());
  }, [stats, hasEnded, game.id, questionIndex, selectedChoice]);

  const handleEndGame = () => {
    endGame();
    setHasEnded(true);
  };

  const handleNext = React.useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          setStats((stats) => ({
            ...stats,
            correct_answers: stats.correct_answers + 1,
          }));
          toast({
            title: "Правильно",
            description: "Отличная работа!",
            variant: "default",
          });
        } else {
          setStats((stats) => ({
            ...stats,
            wrong_answers: stats.wrong_answers + 1,
          }));
          toast({
            title: "Неправильно",
            description: "Ой-ой, попробуй в следующий раз",
            variant: "destructive",
          });
        }
        if (questionIndex === shuffledQuestions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }
        setQuestionIndex((questionIndex) => questionIndex + 1);
      },
    });
  }, [checkAnswer, questionIndex, shuffledQuestions.length, toast, endGame]);

  const handlePrevious = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const handleSkip = () => {
    if (questionIndex < shuffledQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  if (hasEnded) {
    return (
      <div className="flex flex-col justify-center">
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          Вы завершили за{" "}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/app/statistics/${game.id}`}
          className={cn(buttonVariants({ size: "lg" }), "mt-2")}
        >
          Перейти к статистике
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <Button
          variant="destructive"
          className="mt-5"
          size="lg"
          disabled={hasEnded}
          onClick={handleEndGame}
        >
          Завершить квиз
        </Button>
        <div className="flex flex-col">
          <div className="flex self-start mt-3 text-slate-400 ">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <MCQCounter
          correct_answers={stats.correct_answers}
          wrong_answers={stats.wrong_answers}
        />
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg ">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4 ">
        {options.map((option, index) => {
          return (
            <Button
              key={option}
              variant={selectedChoice === index ? "default" : "outline"}
              className="justify-start w-full py-8 mb-4"
              onClick={() => setSelectedChoice(index)}
            >
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md">
                  {index + 1}
                </div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          );
        })}
        <div className="flex flex-row w-full justify-between mt-4">
          {/* <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={questionIndex === 0 || isChecking || hasEnded}
          >
            <ChevronLeft className="w-4 h-4 ml-2" /> Назад
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleSkip}
            disabled={isChecking || hasEnded || questionIndex === shuffledQuestions.length - 1}
          >
            Пропустить
          </Button> */}
          <Button
            variant="outline"
            size="lg"
            disabled={isChecking || hasEnded}
            onClick={handleNext}
          >
            {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Следующий <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

      </div>
    </div>
  );
};

export default MCQ;
