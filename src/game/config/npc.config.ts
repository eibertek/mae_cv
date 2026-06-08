import { CV_DATA } from "./cv.config";

export interface DialogEntry {
  trigger: string;
  messages: string[];
}

export interface NPCConfig {
  id: string;
  name: string;
  sprite: string;
  position: { x: number; y: number };
  dialogs: DialogEntry[];
  color: number;
  link?: { url: string; label: string };
}

export const NPCS: NPCConfig[] = [
  {
    id: "entrance_guide",
    name: "Guía",
    sprite: "npc_guide",
    position: { x: 200, y: 260 },
    color: 0x4a90d9,
    dialogs: [
      {
        trigger: "default",
        messages: [
          `¡Bienvenido al CV Interactivo de ${CV_DATA.name}!`,
          "Soy el guía oficial. Podés explorar las tiendas para conocerlo mejor.",
          "En la tienda de HABILIDADES podés capturar sus skills como Skillsmon.",
          "En la tienda de EXPERIENCIA podés ver su historial laboral.",
          "¡Usá las flechas o WASD para moverte, y ESPACIO para interactuar!",
        ],
      },
    ],
  },
  {
    id: "info_npc",
    name: "Recepcionista",
    sprite: "npc_receptionist",    
    position: { x: 240, y: 188 },
    color: 0xe87a5d,
    dialogs: [
      {
        trigger: "default",
        messages: [
          `${CV_DATA.name} es un ${CV_DATA.title}.`,
          `Nació en ${CV_DATA.birthPlace}.`,
          `Actualmente vive en ${CV_DATA.currentLocation} con ${CV_DATA.livesWidth}.`,
          CV_DATA.bio,
          `Podés contactarlo en: ${CV_DATA.email}`,
          `GitHub: ${CV_DATA.github}`,
          `LinkedIn: ${CV_DATA.linkedin}`,
        ],
      },
    ],
    link: { url: CV_DATA.linkedin, label: "Ver LinkedIn de Mariano" },
  },
  {
    id: "skills_npc",
    name: "Lead Engineer",
    sprite: "npc_professor",
    position: { x: 125, y: 155 },
    color: 0x68a063,
    dialogs: [
      {
        trigger: "default",
        messages: [
          "¡Ah, un visitante! Yo soy el Profesor Cocoa del código.",
          "En la Tienda de Habilidades vas a encontrar los skills de Mariano representados como Skillsmon.",
          "¡Intentá capturarlos a todos para ver sus niveles!",
          "Tip: reducí los HP del Skillsmon antes de intentar capturarlo.",
        ],
      },
    ],
  },
  {
    id: "work_npc",
    name: "Gerente de RRHH",
    sprite: "npc_hr",
    position: { x: 385, y: 155 },
    color: 0x7b52ab,
    dialogs: [
      {
        trigger: "default",
        messages: [
          "¡Bienvenido a la sección de experiencia laboral!",
          "Mariano tiene más de 10 años de experiencia en desarrollo de software.",
          "Cada vitrina muestra uno de sus trabajos anteriores.",
          "Acercate a las vitrinas y presioná ESPACIO para ver los detalles.",
        ],
      },
    ],
  },
];
