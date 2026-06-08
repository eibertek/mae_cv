import dynamic from "next/dynamic";
import { CV_DATA } from "@/game/config/cv.config";

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
      <div className="w-full max-w-3xl px-4">
        <h1 className="text-center font-mono text-white text-lg mb-2 tracking-widest">
          🏬 {CV_DATA.name}&apos;s CV
        </h1>
        <p className="text-center font-mono text-gray-400 text-xs mb-4">
          {CV_DATA.title} &middot; Curriculum Vitae Interactivo
        </p>

        <div
          className="w-full relative bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800"
          style={{ aspectRatio: "480/320" }}
        >
          <GameComponent />
        </div>

        <div className="mt-4 font-mono text-gray-500 text-xs text-center space-x-4">
          <span>⬆⬇⬅➡ / WASD: mover</span>
          <span>&nbsp;·&nbsp; ESPACIO: interactuar</span>
          <span>&nbsp;·&nbsp; ESC: salir de tienda</span>
        </div>

        <div className="mt-4 flex justify-center gap-6 font-mono text-xs">
          <a
            href={CV_DATA.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            GitHub
          </a>
          <a
            href={CV_DATA.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${CV_DATA.email}`}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </main>
  );
}
