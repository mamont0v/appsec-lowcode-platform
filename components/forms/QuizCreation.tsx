"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { z } from 'zod';
import LoadingQuestions from "../quiz/loading-questions";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { BentoGrid, BentoGridItem } from "../quiz/bento-grid";

interface Topic {
  id: string;
  name: string;
  description?: string;
}

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({ topic: topicParam }: { topic: string }) => {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showLoader, setShowLoader] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: { topic: topicParam },
  });

  // Mutation для запроса создания игры
  const { mutate: getQuestions } = useMutation({
    mutationFn: async ({ topic }: Input) => {
      const response = await axios.post("/api/game", { topic });
      return response.data;
    },
    onError: (error) => {
      setShowLoader(false);
      if (error instanceof AxiosError && error.response?.status === 500) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      }
    },
    onSuccess: ({ gameId }: { gameId: string }) => {
      setFinishedLoading(true);
      setTimeout(() => {
        router.push(`/app/play/${gameId}`);
      }, 2000);
    },
  });

  const onSubmit = async (data: Input) => {
    setShowLoader(true);
    getQuestions(data);
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("/api/topics");
        const data: Topic[] = await response.json();
        setTopics(data);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      }
    };
    fetchTopics();
  }, []);

  if (showLoader) return <LoadingQuestions finished={finishedLoading} />;
  return (
    <div className="h-full py-6 flex flex-col gap-4">
      {topics.length === 0 ? (
        <p>Загружаем список тем...</p>
      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic) => (
            <Card key={topic.id} className="flex flex-col gap-2 justify-between items-center py-5">
              <CardHeader>
                <CardTitle className="flex justify-center text-2xl font-bold ">{topic.name}</CardTitle>
                <CardDescription className="flex justify-center">{topic.description}</CardDescription>
              </CardHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-center">
                <Button
                  type="submit"
                  onClick={() => form.setValue("topic", topic.id)}
                  className=""
                >
                  Начать
                </Button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default QuizCreation;
