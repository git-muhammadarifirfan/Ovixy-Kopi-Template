import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full bg-black px-6 py-12 md:py-24 text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">

        <div>
          <h2 className="text-4xl md:text-8xl font-bold tracking-tighter uppercase mb-6">Ovixy</h2>
          <p className="text-white/60 max-w-sm">
            Elevating the coffee experience, one cup at a time.
          </p>
        </div>

        <div className="flex gap-16 md:gap-24">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold tracking-widest uppercase text-[#d4a373] text-sm">Navigation</h4>
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <Link href="#about" className="hover:text-white/70 transition-colors">Our Story</Link>
            <Link href="#menu" className="hover:text-white/70 transition-colors">Menu</Link>
            <Link href="#locations" className="hover:text-white/70 transition-colors">Locations</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold tracking-widest uppercase text-[#d4a373] text-sm">Socials</h4>
            <Link href="#" className="hover:text-white/70 transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-white/70 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white/70 transition-colors">Facebook</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-white/40">
        <p>&copy; {new Date().getFullYear()} Ovixy Coffee. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
