"use client";
import offzoneLogo from '@/assets/logo-offzone.png'
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";


export const LogoTicker = () => {
  return (
    <div className='py-8 md:py-12 bg-white'>
      <div className='container'>
        <div className='flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]'>
          <motion.div
            className='flex gap-14 flex-none pr-14'
            animate={{
              translateX: "-50%"
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
              repeatType: "loop"
            }}>
            <Image
              src={offzoneLogo}
              alt='cylinder'
            />
            <Image
              src={offzoneLogo}
              alt='cylinder'
            />
            <Image
              src={offzoneLogo}
              alt='cylinder'
            />
            <Image
              src={offzoneLogo}
              alt='cylinder'
            />
            <Image
              src={offzoneLogo}
              alt='cylinder'
            />


            {/* For Animation */}
            <Image
              src={offzoneLogo}
              alt='cylinder'
            />
            <Image
              src={offzoneLogo}
              alt='cylinder'
            />
            <Image
              src={offzoneLogo}
              alt='cylinder'
            />
            <Image
              src={offzoneLogo}
              alt='cylinder'
            />
            <Image
              src={offzoneLogo}
              alt='cylinder'
            />


          </motion.div>
        </div>
      </div>
    </div>
  );
};
