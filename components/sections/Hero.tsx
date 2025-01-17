"use client";
import ArrowRight from '@/assets/arrow-right.svg';
import cogImage from '@/assets/cog.png';
import cylinderImage from '@/assets/cylinder.png'
import noodleImage from '@/assets/noodle.png'
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from 'react';
import { SparklesPreview } from '@/components/SparklesPreview';


export const Hero = () => {

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  })

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section ref={heroRef} className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#DE74EE,#EAEEFE_66%)] overflow-x-clip">
      <div className="container">
        <div className='md:flex items-center'>
          <div className='md:w-[478px]'>
            <div className="tag">
              Version 2.0 is here
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#DE74EE] text-transparent bg-clip-text mt-6">Кибер Квест</h1>
            
            <p className="text-xl text-[#391b3d] tracking-tight mt-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div className='flex gap-1 items-center mt-[30px]'>
              <button className="btn btn-primary">Получить товар</button>
              <button className="btn btn-text">
                <span>Узнать больше</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className='mt-20 md:mt-0 md:h-[678px] md:flex-1 relative '>
            <motion.img
              src={cogImage.src}
              alt="Fix your Network bro"
              className='md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0'
              animate={{
                translateY: [-30, 30],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
                ease: "easeInOut"
              }}
            />
            <motion.img
              src={cylinderImage.src}
              alt='cylinder'
              width={220}
              height={220}
              className='hidden md:block -top-8 -left-32 md:absolute'
              style={{
                translateY: translateY,
              }}
            />
            <motion.img
              src={noodleImage.src}
              alt='noodle'
              width={220}
              height={220}
              className='absolute lg:block top-[524px] left-[448px] rotate-[30deg]'
              style={{
                rotate: 30,
                translateY: translateY,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
