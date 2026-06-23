"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function CountUp({ to, duration = 2 }: { to: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      // Easing function (easeOutExpo)
      const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setCount(Math.floor(easeOut * to));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [to, duration, isInView]);

  return <span ref={ref}>{count}</span>;
}

export default function BentoSection() {
  return (
    <section className="relative z-10 w-full bg-[#1a110a] px-6 py-24 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-16">
          The Art of <br /> Roasting
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 relative rounded-3xl overflow-hidden bg-[#27190e] border border-white/10 p-8 flex flex-col justify-end"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80" 
              alt="Coffee beans" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-20">
              <h3 className="text-3xl font-bold uppercase mb-2">Single Origin</h3>
              <p className="text-white/70 max-w-md">Sourced from the finest high-altitude farms across the globe.</p>
            </div>
          </motion.div>

          {/* Card 2 - Stat */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl overflow-hidden bg-[#d4a373] text-[#1a110a] p-8 flex flex-col justify-center items-center text-center"
          >
            <div className="text-7xl font-bold tracking-tighter mb-4">
              <CountUp to={240} />+
            </div>
            <p className="text-xl font-bold uppercase tracking-widest">Global Farms</p>
          </motion.div>

          {/* Card 3 - Stat */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-8 flex flex-col justify-center items-center text-center backdrop-blur-sm"
          >
            <div className="text-7xl font-bold tracking-tighter mb-4 text-[#d4a373]">
              <CountUp to={15} />
            </div>
            <p className="text-xl font-bold uppercase tracking-widest text-white/80">Awards Won</p>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="md:col-span-2 relative rounded-3xl overflow-hidden bg-[#27190e] border border-white/10 p-8 flex flex-col justify-end"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80" 
              alt="Pour over coffee" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-20">
              <h3 className="text-3xl font-bold uppercase mb-2">Precision Brewing</h3>
              <p className="text-white/70 max-w-md">Every cup is crafted with scientific precision to extract maximum flavor.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
