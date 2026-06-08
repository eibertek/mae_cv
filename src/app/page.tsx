import dynamic from "next/dynamic";
import { CV_DATA } from "@/game/config/cv.config";
import { PageSubtitle, PageControls } from "./components/PageInfo";
import { MuteButton } from "./components/MuteButton";
import { MobileControls } from "./components/MobileControls";

const GameComponent = dynamic(() => import("./components/GameComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-center font-mono text-white">
        <div className="text-2xl mb-2">🎮</div>
        <div className="text-sm animate-pulse">Cargando Mall...</div>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0d0d1a]">
      <div className="game-wrapper w-full max-w-3xl px-4">

        <div className="mobile-hidden">
          <h1 className="text-center font-mono text-white text-lg mb-2 tracking-widest">
            🏬 {CV_DATA.name}&apos;s CV
          </h1>
          <PageSubtitle title={CV_DATA.title} />
        </div>

        <div className="game-container w-full relative bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800">
          <GameComponent />
          <MobileControls />
        </div>

        <div className="mobile-hidden mt-3 flex items-center justify-between">
          <PageControls />
          <MuteButton />
        </div>

        <div className="mobile-hidden mt-2 flex justify-center gap-6 font-mono text-xs">
          <a href={CV_DATA.github} target="_blank" rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors">GitHub</a>
          <a href={CV_DATA.linkedin} target="_blank" rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors">LinkedIn</a>
          <a href={`mailto:${CV_DATA.email}`}
            className="text-blue-400 hover:text-blue-300 transition-colors">Email</a>
        </div>

      </div>
    </main>
  );
}
