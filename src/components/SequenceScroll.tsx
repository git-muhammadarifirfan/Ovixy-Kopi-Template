"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";

const FRAME_COUNT = 240;

export default function SequenceScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(5, "0");
        img.src = `/sequence/frame_${paddedIndex}.webp`;

        await new Promise<void>((resolve) => {
          img.onload = () => {
            loadedImages.push(img);
            loadedCount++;
            setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
            resolve();
          };
          img.onerror = () => {
            loadedImages.push(loadedImages[loadedImages.length - 1] || img);
            loadedCount++;
            setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
            resolve();
          };
        });
      }

      setImages(loadedImages);
      setLoading(false);
    };

    loadImages();
  }, []);

  // Render Canvas Logic
  useEffect(() => {
    if (!loading && images.length > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const renderFrame = (index: number) => {
        const img = images[Math.floor(index)];
        if (!img) return;

        // Cover fit logic
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > canvasRatio) {
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
        } else {
          drawHeight = canvas.width / imgRatio;
          offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      };

      // Initial render
      renderFrame(frameIndex.get());

      // Handle resize
      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(frameIndex.get());
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      // Subscribe to frame changes
      const unsubscribe = frameIndex.on("change", (latest) => {
        renderFrame(latest);
      });

      return () => {
        window.removeEventListener("resize", handleResize);
        unsubscribe();
      };
    }
  }, [loading, images, frameIndex]);

  // Text Overlay Opacities
  const mobileText1Opacity = useTransform(frameIndex, [0, 30, 60], [1, 1, 0]);
  const text1Opacity = isMobile ? mobileText1Opacity : 1;
  const text2Opacity = useTransform(frameIndex, [60, 80, 110, 130], [0, 1, 1, 0]);
  const text3Opacity = useTransform(frameIndex, [130, 150, 180, 200], [0, 1, 1, 0]);
  const text4Opacity = useTransform(frameIndex, [200, 220, 239], [0, 1, 1]);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#27190e] text-white"
          >
            <div className="text-4xl font-bold tracking-widest uppercase mb-4 animate-pulse">
              Ovixy
            </div>
            <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="mt-4 text-sm font-mono opacity-60">
              {loadingProgress}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={containerRef} className="relative h-[400vh] w-full bg-[#27190e]">
        <motion.div 
          initial={{ y: 120 }}
          animate={{ y: loading ? 120 : 0 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="sticky top-0 h-screen w-full overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlays */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* 0% Text */}
            <motion.div
              style={{ opacity: text1Opacity }}
              className="absolute text-center flex flex-col items-center"
            >
              <h1 className="text-6xl md:text-9xl font-bold tracking-tighter uppercase text-white drop-shadow-2xl">
                The Essence <br /> of Coffee
              </h1>
              <p className="mt-6 text-xl md:text-2xl font-light tracking-wide text-white/80">
                Brewed to perfection. Scroll to explore.
              </p>
            </motion.div>

            {/* 30% Text */}
            <motion.div
              style={{ opacity: text2Opacity }}
              className="absolute left-[10%] max-w-lg"
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
                Ethically <br /> Sourced.
              </h2>
              <p className="mt-4 text-xl text-white/80 font-light">
                We travel the world to find the best beans. Direct trade, fair prices, exceptional quality.
              </p>
            </motion.div>

            {/* 60% Text */}
            <motion.div
              style={{ opacity: text3Opacity }}
              className="absolute right-[10%] max-w-lg text-right"
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
                Expertly <br /> Roasted.
              </h2>
              <p className="mt-4 text-xl text-white/80 font-light">
                Our master roasters bring out the unique flavor profiles of every single origin bean we serve.
              </p>
            </motion.div>

            {/* 90% Text */}
            <motion.div
              style={{ opacity: text4Opacity }}
              className="absolute text-center flex flex-col items-center pointer-events-auto"
            >
              <h2 className="text-5xl md:text-8xl font-bold tracking-tight text-white drop-shadow-lg mb-10">
                Taste the <br /> Difference
              </h2>
              <button
                className="group relative px-10 py-5 bg-white text-[#27190e] rounded-full overflow-hidden text-lg font-bold tracking-widest uppercase transition-transform hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Order Now</span>
                <div className="absolute inset-0 h-full w-full bg-[#d4a373] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
