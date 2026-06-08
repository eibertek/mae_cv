export interface Skill {
  id: string;
  name: string;
  type: "backend" | "frontend" | "devops" | "database" | "mobile" | "other";
  level: number;
  years: number;
  sprite: string;
  description: string;
  moves: string[];
  hp: number;
  catchRate: number;
  color: string;
}

export const SKILLS: Skill[] = [
  {
    id: "php",
    name: "PHP",
    type: "backend",
    level: 85,
    years: 10,
    sprite: "pokemon_php",
    description: "Backend web development con PHP y frameworks modernos.",
    moves: ["Laravel Slash", "Composer Strike", "OOP Beam"],
    hp: 120,
    catchRate: 0.8,
    color: "#7B7FB5",
  },
  {
    id: "nodejs",
    name: "Node.js",
    type: "backend",
    level: 80,
    years: 7,
    sprite: "pokemon_node",
    description: "Runtime de JavaScript del lado del servidor.",
    moves: ["Express Dash", "Async Tackle", "NPM Burst"],
    hp: 110,
    catchRate: 0.75,
    color: "#68A063",
  },
  {
    id: "javascript",
    name: "JavaScript",
    type: "frontend",
    level: 90,
    years: 12,
    sprite: "pokemon_js",
    description: "Frontend y fullstack JS con ES6+.",
    moves: ["Promise Pulse", "DOM Crush", "Event Loop"],
    hp: 130,
    catchRate: 0.85,
    color: "#F7DF1E",
  },
  {
    id: "typescript",
    name: "TypeScript",
    type: "frontend",
    level: 85,
    years: 5,
    sprite: "pokemon_ts",
    description: "JavaScript con tipado estático para apps robustas.",
    moves: ["Type Guard", "Interface Slash", "Compile Beam"],
    hp: 125,
    catchRate: 0.8,
    color: "#3178C6",
  },
  {
    id: "react",
    name: "React",
    type: "frontend",
    level: 88,
    years: 6,
    sprite: "pokemon_react",
    description: "Librería para construir interfaces de usuario.",
    moves: ["Hook Strike", "Virtual DOM", "State Burst"],
    hp: 128,
    catchRate: 0.82,
    color: "#61DAFB",
  },
  {
    id: "python",
    name: "Python",
    type: "backend",
    level: 70,
    years: 4,
    sprite: "pokemon_python",
    description: "Scripting, automatización y data science.",
    moves: ["Pip Install", "Dict Slam", "Lambda Strike"],
    hp: 100,
    catchRate: 0.7,
    color: "#FFD43B",
  },
  {
    id: "mysql",
    name: "MySQL",
    type: "database",
    level: 80,
    years: 10,
    sprite: "pokemon_mysql",
    description: "Base de datos relacional de alto rendimiento.",
    moves: ["JOIN Attack", "Index Boost", "Query Blast"],
    hp: 115,
    catchRate: 0.75,
    color: "#4479A1",
  },
  {
    id: "docker",
    name: "Docker",
    type: "devops",
    level: 75,
    years: 5,
    sprite: "pokemon_docker",
    description: "Contenedores para deployments reproducibles.",
    moves: ["Container Cage", "Image Build", "Compose Strike"],
    hp: 105,
    catchRate: 0.72,
    color: "#2496ED",
  },
];
