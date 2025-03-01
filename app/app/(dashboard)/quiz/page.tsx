import { redirect } from "next/navigation";
import QuizCreation from "@/components/forms/QuizCreation";
import Navbar from "@/components/landing/navbar-v1";
import MainContainer from "@/components/main-container";
import { auth } from "@/auth";

export const metadata = {
  title: "Quiz | Quizzzy",
  description: "Quiz yourself on anything!",
};

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

const Quiz = async ({ searchParams }: Props) => {
  // check auth
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  // Ожидание доступа к `searchParams`
  const params = await searchParams;
  const topic = params.topic ?? "";
  return (
    <div className='flex-1 flex flex-col h-full'>
      <div className="flex justify-between">
        <div className="flex flex-col">

          <h1 className="text-3xl font-bold">
            Квиз
          </h1>

          <p className="text-muted-foreground">
            Геймифицированное обучение кибербезопасности
          </p>
        </div>
        {/* <QuizCreation topic={topic} /> */}
      </div>

      <div className="h-full py-6">
        <QuizCreation topic={topic} />
      </div>
    </div>


  );

};

export default Quiz;
