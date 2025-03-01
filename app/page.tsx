import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google";
import Navbar from "@/components/landing/navbar-v2";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/landing/container-scroll";
import { InfiniteMovingCards } from "@/components/landing/Infinite-moving-cards";
import { HeroParallax } from "@/components/landing/connect-parallax";
import { LampComponent } from "@/components/landing/lamp";
import { CardBody, CardContainer, CardItem } from "@/components/landing/3d-card";
import { CheckIcon } from "lucide-react";
import { clients, products } from "@/constants";
import Image from "next/image";
import { GlowingEffectSector } from "@/components/landing/glowing-effect.-sector";


const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default async function HomePage() {

  const session = await auth();

  // if (!session) {
  //   return redirect("/auth/login");
  // }

  // if (session) {
  //   return redirect("/app");
  // }

  return (
    <main className="min-h-screen  h-full w-full items-center [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]">
      <Navbar />
      <section className="h-screen w-full rounded-md  !overflow-visible relative flex flex-col items-center  antialiased">
        <div className="flex flex-col">
          <ContainerScroll
            titleComponent={
              <div className="flex items-center flex-col">
                <Button
                  size={'lg'}
                  className="p-8 mb-8 md:mb-0 text-2xl w-full sm:w-fit border-t-2 rounded-full border-[#4D4D4D] bg-[#1F1F1F] hover:bg-white group transition-all flex items-center justify-center gap-4 hover:shadow-xl hover:shadow-neutral-500 duration-500"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-500 to-neutral-600  md:text-center font-sans group-hover:bg-gradient-to-r group-hover:from-black goup-hover:to-black">
                    Начни с нами уже сейчас
                  </span>
                </Button>
                <h1 className="text-5xl md:text-8xl  bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 font-sans font-bold mb-10">
                  Пока не придумали
                </h1>
              </div>
            }
          ><Image
              src={`/test-banner.png`}
              alt="hero"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-left-top"
              draggable={false}
            /></ContainerScroll>
        </div>
      </section>
    </main>
  );
}
