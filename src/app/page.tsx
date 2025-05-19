import Image from "next/image";
import LandingPage from "@/pages/landing-page";
import TicketSelection from "@/pages/ticket-selection";

export default function Home() {
  return (
    <main className="w-full h-full">
      <div className="w-full h-full bg-white">
      <LandingPage />
      <section id="trending-now">
          <TicketSelection />
      </section>
      </div>
    </main>
  )
};
