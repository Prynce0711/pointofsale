"use client";

import { motion } from "framer-motion";

const screenTransition = { duration: 0.32, ease: "easeOut" as const };

export default function Loading() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF4EA] bg-[radial-gradient(circle_at_top_left,#ead9c4_0,#f8f3ea_42%,#fffaf3_100%)] px-4 py-8 text-[#24150f] sm:px-6 lg:px-10">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,250,243,0.78),rgba(247,239,227,0.58))]" />
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={screenTransition}
        className="relative grid min-h-[calc(100vh-4rem)] place-items-center"
      >
        <div className="grid justify-items-center gap-5 text-center">
          <CoffeeMark />
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.08, ease: "easeOut" }}
              className="text-2xl font-semibold text-[#2c1810]"
            >
              Brewing your workspace...
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.16, ease: "easeOut" }}
              className="mt-2 text-sm text-[#7b6254]"
            >
              Preparing Bean Counter POS
            </motion.p>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

function CoffeeMark() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="relative h-28 w-28"
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-0 flex -translate-x-1/2 gap-1">
        {[0, 1, 2].map((item) => (
          <motion.span
            key={item}
            animate={{ opacity: [0, 0.8, 0], y: [10, -2, -16] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              delay: item * 0.22,
              ease: "easeOut",
            }}
            className="h-8 w-1.5 rounded-full bg-[#c9823a]/70"
          />
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 h-16 w-20 -translate-x-1/2 rounded-b-3xl rounded-t-xl border border-[#E6D2BC] bg-[#FFFAF3] shadow-[0_18px_40px_rgba(61,35,21,0.16)]">
        <div className="absolute right-0 top-3 h-9 w-9 translate-x-1/2 rounded-full border-4 border-[#FFFAF3]" />
        <div className="absolute inset-x-3 top-3 h-2 rounded-full bg-[#d7a260]" />
      </div>
      <div className="absolute bottom-1 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-[#8B5A35]/20" />
    </motion.div>
  );
}
