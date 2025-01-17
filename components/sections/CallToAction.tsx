"use client";
import springImage from '@/assets/spring.png'
import starImage from '@/assets/star.png';
import ArrowRight from '@/assets/arrow-right.svg';
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from 'react';
import { TypewriterEffectSmoothDemo } from '@/components/TypewriterEffectSmoothDemo';


export const CallToAction = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  })

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  return (
    <section className="bg-gradient-to-b from-white to-[#e1a6eb] py-24 overflow-x-clip">
      <div className="container">
      <TypewriterEffectSmoothDemo />
        <div className='section-heading relative'>
        
          {/* <h2 className='section-title'>Оставь заявку</h2> */}
          <p className="section-description mt-5">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ex ante velit suscipit nunc vulputate dis eros facilisi massa. Himenaeos ligula sollicitudin cursus luctus volutpat accumsan. Sociosqu ad iaculis dis vestibulum enim.
          </p>
          <motion.img
            src={starImage.src}
            alt="Star Image"
            width={360}
            className="absolute -left-[350px] -top-[137px]"
            style={{
              translateY
            }}
          />
          <motion.img
            src={springImage.src}
            alt="Star Image"
            width={360}
            className="absolute -right-[331px] -top-[19px]"
            style={{
              translateY
            }}
          />
        </div>
        <div className='flex gap-2 mt-10 justify-center'>
          <button className='btn btn-primary'>
            Click
          </button>
          <button className='btn btn-text gap-1'>
            <span>Узнать больше</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
