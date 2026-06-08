import { CV_DATA } from "./cv.config";

export interface DialogEntry {
  trigger: string;
  messages: { en: string[]; es: string[] };
}

export interface NPCConfig {
  id: string;
  name: { en: string; es: string };
  sprite: string;
  position: { x: number; y: number };
  dialogs: DialogEntry[];
  color: number;
  link?: { url: string; label: { en: string; es: string } };
}

export const NPCS: NPCConfig[] = [
  {
    id: "entrance_guide",
    name: { en: "Guide", es: "Guía" },
    sprite: "npc_guide",
    position: { x: 200, y: 260 },
    color: 0x4a90d9,
    dialogs: [
      {
        trigger: "default",
        messages: {
          en: [
            `Welcome to ${CV_DATA.name}'s Interactive CV!`,
            "I'm the official guide. Explore the shops to get to know him better.",
            "In the SKILLS SHOP you can capture his skills as Skillsmon.",
            "In the EXPERIENCE SHOP you can browse his work history.",
            "Use arrows or WASD to move, and SPACE to interact!",
          ],
          es: [
            `¡Bienvenido al CV Interactivo de ${CV_DATA.name}!`,
            "Soy el guía oficial. Podés explorar las tiendas para conocerlo mejor.",
            "En la tienda de HABILIDADES podés capturar sus skills como Skillsmon.",
            "En la tienda de EXPERIENCIA podés ver su historial laboral.",
            "¡Usá las flechas o WASD para moverte, y ESPACIO para interactuar!",
          ],
        },
      },
    ],
  },
  {
    id: "info_npc",
    name: { en: "Receptionist", es: "Recepcionista" },
    sprite: "npc_receptionist",
    position: { x: 240, y: 188 },
    color: 0xe87a5d,
    dialogs: [
      {
        trigger: "default",
        messages: {
          en: [
            `${CV_DATA.name} is a ${CV_DATA.title}, based in Buenos Aires, Argentina.`,
            "With a solid background in web development, his focus is creating intuitive, high-performance UIs at HappyFunCorp. Committed to technical excellence through JavaScript, Node.js and React.",
            "Collaboration and teamwork have been key to his success — optimizing performance and functionality across the projects he leads.",
            "These experiences have reinforced his ability to manage complex UI components, ensuring client satisfaction and results beyond expectations.",
            `Contact: ${CV_DATA.email}`,
          ],
          es: [
            `${CV_DATA.name} es un ${CV_DATA.title}, con base en Buenos Aires, Argentina.`,
            "Con una sólida trayectoria en el desarrollo web, su enfoque está en la creación de interfaces de usuario intuitivas y de alto rendimiento en HappyFunCorp. Su compromiso con la excelencia técnica se refleja en JavaScript, Node.js y React.",
            "La colaboración y el trabajo en equipo han sido fundamentales en su éxito, optimizando el rendimiento y la funcionalidad de los proyectos que lidera.",
            "Estas experiencias han reforzado su habilidad para gestionar componentes UI complejos, garantizando la satisfacción de los clientes y resultados que superan las expectativas.",
            `Contacto: ${CV_DATA.email}`,
          ],
        },
      },
    ],
    link: {
      url: CV_DATA.linkedin,
      label: { en: "View Mariano's LinkedIn", es: "Ver LinkedIn de Mariano" },
    },
  },
  {
    id: "skills_npc",
    name: { en: "Prof. Cocoa", es: "Prof. Cocoa" },
    sprite: "npc_professor",
    position: { x: 125, y: 155 },
    color: 0x68a063,
    dialogs: [
      {
        trigger: "default",
        messages: {
          en: [
            "Ah, a visitor! I'm Professor Cocoa of code.",
            "In the Skills Shop you'll find Mariano's skills represented as Skillsmon.",
            "Try to capture them all and see their levels!",
            "Tip: reduce a Skillsmon's HP below 30% before attempting to capture it.",
          ],
          es: [
            "¡Ah, un visitante! Yo soy el Profesor Cocoa del código.",
            "En la Tienda de Habilidades vas a encontrar los skills de Mariano representados como Skillsmon.",
            "¡Intentá capturarlos a todos para ver sus niveles!",
            "Tip: reducí los HP del Skillsmon por debajo del 30% antes de intentar capturarlo.",
          ],
        },
      },
    ],
  },
  {
    id: "work_npc",
    name: { en: "HR Manager", es: "Gerente de RRHH" },
    sprite: "npc_hr",
    position: { x: 385, y: 155 },
    color: 0x7b52ab,
    dialogs: [
      {
        trigger: "default",
        messages: {
          en: [
            "Welcome to the work experience section!",
            "Mariano has over 13 years of experience in software development.",
            "Each showcase displays one of his previous positions.",
            "Walk up to a showcase and press SPACE to see full details.",
          ],
          es: [
            "¡Bienvenido a la sección de experiencia laboral!",
            "Mariano tiene más de 13 años de experiencia en desarrollo de software.",
            "Cada vitrina muestra uno de sus trabajos anteriores.",
            "Acercate a las vitrinas y presioná ESPACIO para ver los detalles.",
          ],
        },
      },
    ],
  },
];
