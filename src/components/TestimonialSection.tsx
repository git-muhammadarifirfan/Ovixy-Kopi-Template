"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    text: "THE BEST COFFEE EXPERIENCE I'VE EVER HAD. THE ATTENTION TO DETAIL IS UNMATCHED.",
    author: "SARAH JENNINGS",
    role: "COFFEE ENTHUSIAST"
  },
  {
    text: "Ovixy HAS REDEFINED WHAT IT MEANS TO ROAST SPECIALTY COFFEE. PURE BRILLIANCE.",
    author: "DAVID CHEN",
    role: "CAFE OWNER"
  },
  {
    text: "FROM BEAN TO CUP, EVERY STEP IS CURATED FOR PERFECTION. TRULY A MASTERCLASS.",
    author: "EMILY R.",
    role: "FOOD CRITIC"
  }
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative z-10 w-full h-screen bg-[#27190e] flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <span className="text-[20vw] font-bold tracking-tighter whitespace-nowrap">TESTIMONIALS</span>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight uppercase leading-tight mb-12">
              "{testimonials[currentIndex].text}"
            </h2>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[#d4a373] font-bold tracking-widest uppercase">
                {testimonials[currentIndex].author}
              </span>
              <span className="text-sm font-light tracking-widest text-white/50 uppercase">
                {testimonials[currentIndex].role}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-3 mt-16">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 transition-all duration-300 ${idx === currentIndex ? "w-12 bg-[#d4a373]" : "w-4 bg-white/20"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
