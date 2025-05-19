import LandingPage from "@/pages/landing-page";
import TrendingNow from "@/pages/trending";

export default function Home() {
  return (
    <main className="w-full h-full">
      <div className="w-full h-full bg-white">
      <LandingPage />
      <section id="trending-now">
          <TrendingNow />
      </section>
      </div>
    </main>
  )
};
