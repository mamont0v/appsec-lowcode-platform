"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import productImage from '@/assets/product-image.png';
import Link from "next/link";

export function ThreeDCardDemo() {
  return (
    <CardContainer className="inter-var w-full">
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src={productImage}
            height="1500"
            width="1500"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>        
    </CardContainer>
  );
}
