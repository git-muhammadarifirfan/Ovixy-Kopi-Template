"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const text = "Ovixy IS MORE THAN JUST A COFFEE SHOP. IT'S A DESTINATION FOR THOSE WHO APPRECIATE THE CRAFT, THE COMMUNITY, AND THE CULTURE OF EXCEPTIONAL COFFEE ROASTING.";

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const words = text.split(" ");

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative z-10 w-full min-h-screen bg-[#27190e] -mt-[100vh] flex items-center justify-center px-6 py-24"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-[#d4a373] mb-12 text-center">
          Our Story
        </h2>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + (1 / words.length);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);

            return (
              <motion.span
                key={i}
                style={{ opacity }}
                className="text-4xl md:text-7xl font-bold uppercase tracking-tight text-white"
              >
                {word}
              </motion.span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
