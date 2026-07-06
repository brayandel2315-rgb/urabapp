'use client';

import { motion } from 'framer-motion';

export function HomeHero() {
  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-gradient-to-br from-emerald-900 to-slate-950 px-6 pb-12 pt-24 text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-4xl font-bold tracking-tight">Todo Urabá en una sola app</h1>
        <p className="mt-3 max-w-lg text-white/85">Compra, envía y descubre negocios locales.</p>
      </motion.div>
    </section>
  );
}
