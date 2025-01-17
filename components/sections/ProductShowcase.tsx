"use client";
import productImage from '@/assets/product-image.png';
import pyramidImage from '@/assets/pyramid.png'
import tubeImage from '@/assets/tube.png';
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from 'react';
import { ThreeDCardDemo } from '@/components/ThreeDCardDemo';

export const ProductShowcase = () => {
  const productRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: productRef,
    offset: ["start end", "end start"]
  })

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section ref={productRef} className='bg-gradient-to-b from-[#ffffff] to-[#F2DCFF] py-24 overflow-x-clip'>
      <div className='container'>
        <div className='max-w-[640px] mx-auto'>
          <div className='flex justify-center'>
            <div className='tag'>Пример работы</div>
          </div>
          <h2 className='section-title mt-5'>
            A more effective way to track progress
          </h2>
          <p className='section-description mt-5'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className='relative'>
          {/* <motion.img src={productImage.src} alt="Product Image" className="mt-10" /> */}
          <ThreeDCardDemo/>
          <motion.img src={pyramidImage.src}
            alt="Pyramid Image"
            height={262}
            width={262}
            className="hidden md:block absolute -right-36 -top-32"
            style={{
              translateY
            }}
          />
          <motion.img src={tubeImage.src}
            alt="Tube Image"
            height={248}
            width={248}
            className="hidden md:block absolute bottom-24 -left-36"
            style={{
              translateY
            }}
          />
        </div>
      </div>
    </section>
  );
};
