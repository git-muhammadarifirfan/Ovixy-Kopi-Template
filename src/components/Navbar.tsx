"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Our Story", href: "#about" },
  { title: "Menu", href: "#menu" },
  { title: "Locations", href: "#locations" },
  { title: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-6 mix-blend-difference text-white">
        <Link href="/" className="text-2xl font-bold tracking-tight z-[60]">
          Ovixy
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="z-[60] p-2 hover:opacity-70 transition-opacity"
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%", transition: { delay: 0.5, duration: 0.5 } }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-[#1a110a] flex flex-col justify-center items-center"
          >
            <div className="flex flex-col gap-6 text-center">
              {navLinks.map((link, i) => (
                <div key={link.title} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{
                      duration: 0.5,
                      delay: isOpen ? 0.2 + i * 0.1 : 0.1,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={clsx(
                        "text-5xl md:text-8xl font-bold uppercase tracking-tighter hover:text-[#d4a373] transition-colors"
                      )}
                    >
                      {link.title}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: isOpen ? 0.8 : 0 }}
              className="absolute bottom-10 flex gap-8 text-sm tracking-widest uppercase opacity-60"
            >
              <Link href="#" className="hover:opacity-100 transition-opacity">Instagram</Link>
              <Link href="#" className="hover:opacity-100 transition-opacity">Twitter</Link>
              <Link href="#" className="hover:opacity-100 transition-opacity">Facebook</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
