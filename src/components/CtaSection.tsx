"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CtaSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative z-10 w-full h-screen bg-[#1a110a] flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div
        animate={{
          x: mousePos.x * -50,
          y: mousePos.y * -50
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute inset-0 z-0 opacity-30"
      >
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[#d4a373] blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-orange-900 blur-[100px] mix-blend-screen" />
      </motion.div>

      <div className="relative z-10 text-center px-6">
        <h2 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter mb-8">
          Ready to <br /> Experience <br /> <span className="text-[#d4a373]">Ovixy?</span>
        </h2>

        <button className="group relative inline-flex items-center justify-center px-12 py-6 bg-white text-[#1a110a] rounded-full overflow-hidden text-xl font-bold tracking-widest uppercase transition-transform hover:scale-105 active:scale-95">
          <span className="relative z-10 mix-blend-difference text-white">Visit Our Stores</span>
          <div className="absolute inset-0 h-full w-full bg-[#d4a373] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
        </button>
      </div>
    </section>
  );
}
