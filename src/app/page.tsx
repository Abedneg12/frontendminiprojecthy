import Image from "next/image";
import LandingPage from "@/pages/landing-page";
import Tickets from "@/pages/tickets";
import TrendingNow from "@/pages/trending";

export default function Home() {
  return (
    <main className="w-full h-full">
      <div className="w-full h-full bg-white">
      <LandingPage />
      <section id="trending-now">
          <TrendingNow />
      </section>
      <Tickets />
      </div>
    </main>
  )
};
