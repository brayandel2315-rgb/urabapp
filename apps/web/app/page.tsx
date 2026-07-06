import { HomeHero } from '@/components/home/HomeHero';

export const revalidate = 60;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HomeHero />
      <p className="p-8 text-center text-sm text-muted-foreground">
        Next.js 15 shell — conectar a Supabase vía apps/api. Producción actual: Vite en raíz.
      </p>
    </main>
  );
}
