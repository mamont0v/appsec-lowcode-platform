import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/forms/QuizCreation";
import Navbar from "@/components/navbar";
import MainContainer from "@/components/main-container";

export const metadata = {
  title: "Quiz | Quizzzy",
  description: "Quiz yourself on anything!",
};

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

const Quiz = async ({ searchParams }: Props) => {

  // check auth
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  // Ожидание доступа к `searchParams`
  const params = await searchParams;
  const topic = params.topic ?? "";
  return (
    <>
      <Navbar />
      <MainContainer>
        <QuizCreation topic={topic} />
      </MainContainer>
    </>
  )

};

export default Quiz;
