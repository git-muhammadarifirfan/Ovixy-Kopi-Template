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
      const mobile = window.innerWidth < 768;
      const loadedImages: HTMLImageElement[] = new Array(FRAME_COUNT);
      let loadedCount = 0;

      const CACHE_NAME = "sequence-scroll-cache-v3";
      let cache: Cache | null = null;
      try {
        if (typeof window !== "undefined" && "caches" in window) {
          cache = await caches.open(CACHE_NAME);
        }
      } catch (e) {
        console.warn("Cache storage not available:", e);
      }

      // Draw helper for immediate rendering of first frame or any early loaded frame
      const drawFrameOnCanvas = (img: HTMLImageElement) => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
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
          }
        }
      };

      // 1. Preload and render first frame immediately for instant UX feedback
      const firstFrameImg = new Image();
      const firstFrameUrl = "/sequence/frame_00000.webp";
      await new Promise<void>(async (resolve) => {
        firstFrameImg.onload = () => {
          loadedImages[0] = firstFrameImg;
          drawFrameOnCanvas(firstFrameImg);
          resolve();
        };
        firstFrameImg.onerror = () => {
          resolve();
        };

        try {
          if (cache) {
            const cachedResponse = await cache.match(firstFrameUrl);
            if (cachedResponse) {
              const blob = await cachedResponse.blob();
              firstFrameImg.src = URL.createObjectURL(blob);
              return;
            }
          }
        } catch (e) {}
        firstFrameImg.src = firstFrameUrl;
      });

      // Calculate total frames we actually need to download
      // For mobile: only load even frames (e.g. 0, 2, 4...) to cut download size by 50%
      const totalToLoad = mobile ? Math.ceil(FRAME_COUNT / 2) : FRAME_COUNT;

      // Adjust loadedCount for first frame if it was counted (index 0 is even, so it is loaded)
      if (loadedImages[0]) {
        loadedCount = 1;
        setLoadingProgress(Math.round((loadedCount / totalToLoad) * 100));
      }

      // 2. Load other frames concurrently using a worker pool
      const queue = Array.from({ length: FRAME_COUNT }, (_, i) => i).filter(i => i !== 0);
      const concurrency = 15; // Max parallel downloads

      const loadSingleImage = async (i: number) => {
        const paddedIndex = i.toString().padStart(5, "0");
        const url = `/sequence/frame_${paddedIndex}.webp`;

        return new Promise<void>(async (resolve) => {
          const img = new Image();

          const handleLoadSuccess = () => {
            loadedImages[i] = img;
            loadedCount++;
            setLoadingProgress(Math.round((loadedCount / totalToLoad) * 100));
            resolve();
          };

          const handleLoadError = () => {
            loadedCount++;
            setLoadingProgress(Math.round((loadedCount / totalToLoad) * 100));
            resolve();
          };

          try {
            let cachedResponse: Response | undefined;
            if (cache) {
              cachedResponse = await cache.match(url);
            }

            if (cachedResponse) {
              const blob = await cachedResponse.blob();
              const objectURL = URL.createObjectURL(blob);
              img.src = objectURL;
              img.onload = handleLoadSuccess;
              img.onerror = handleLoadError;
            } else {
              const response = await fetch(url);
              if (!response.ok) throw new Error("Fetch failed");
              const blob = await response.blob();

              if (cache) {
                const cacheResponse = new Response(blob, {
                  headers: { "Content-Type": "image/webp" },
                });
                await cache.put(url, cacheResponse);
              }

              const objectURL = URL.createObjectURL(blob);
              img.src = objectURL;
              img.onload = handleLoadSuccess;
              img.onerror = handleLoadError;
            }
          } catch (error) {
            // Direct fallback
            img.src = url;
            img.onload = handleLoadSuccess;
            img.onerror = handleLoadError;
          }
        });
      };

      const worker = async () => {
        while (queue.length > 0) {
          const i = queue.shift();
          if (i === undefined) break;

          // On mobile, skip downloading odd frames
          if (mobile && i % 2 !== 0) {
            continue;
          }

          await loadSingleImage(i);
        }
      };

      // Start worker pool
      const workers = Array.from({ length: concurrency }, () => worker());
      await Promise.all(workers);

      // Fill in skipped frames for mobile (pointing to neighboring frame)
      if (mobile) {
        for (let i = 0; i < FRAME_COUNT; i++) {
          if (i % 2 !== 0) {
            loadedImages[i] = loadedImages[i - 1] || loadedImages[i + 1] || loadedImages[0];
          }
        }
      }

      // Handle any failed loads to prevent empty spots
      for (let i = 0; i < FRAME_COUNT; i++) {
        if (!loadedImages[i]) {
          loadedImages[i] = loadedImages[i - 1] || loadedImages[i + 1] || loadedImages[0];
        }
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
