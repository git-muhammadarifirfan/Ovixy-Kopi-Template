"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  // Outer circle spring physics (smooth lag)
  const outerX = useSpring(mouseX, { stiffness: 180, damping: 25 });
  const outerY = useSpring(mouseY, { stiffness: 180, damping: 25 });

  // Inner dot spring physics (instant feel)
  const innerX = useSpring(mouseX, { stiffness: 500, damping: 35 });
  const innerY = useSpring(mouseY, { stiffness: 500, damping: 35 });

  const [cursorState, setCursorState] = useState<"default" | "hover" | "hidden">("default");
  const [hoverText, setHoverText] = useState("");

  useEffect(() => {
    // Only apply on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      setCursorState("hidden");
      return;
    }

    // Hide real cursor
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest("a, button, [role='button'], .interactive-hover");
      
      if (interactiveEl) {
        setCursorState("hover");
        const text = interactiveEl.getAttribute("data-cursor-text") || "";
        setHoverText(text);
      } else {
        setCursorState("default");
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.documentElement.style.cursor = "auto";
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (cursorState === "hidden") return null;

  return (
    <>
      {/* Outer Follower Ring */}
      <motion.div
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: cursorState === "hover" ? 64 : 32,
          height: cursorState === "hover" ? 64 : 32,
          backgroundColor: cursorState === "hover" ? "rgba(212, 163, 115, 0.1)" : "rgba(255, 255, 255, 0)",
          borderColor: cursorState === "hover" ? "#d4a373" : "rgba(255, 255, 255, 0.5)",
          borderWidth: cursorState === "hover" ? 2 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center border border-solid"
      >
        {hoverText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] font-bold tracking-widest uppercase text-[#d4a373] pointer-events-none"
          >
            {hoverText}
          </motion.span>
        )}
      </motion.div>

      {/* Inner Follower Dot */}
      <motion.div
        style={{
          x: innerX,
          y: innerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: cursorState === "hover" ? 0.3 : 1,
          backgroundColor: cursorState === "hover" ? "#d4a373" : "#ffffff",
        }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] mix-blend-difference"
      />
    </>
  );
}
