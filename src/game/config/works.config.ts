export interface Work {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
  logo: string;
  color: string;
  achievements: string[];
}

export const WORKS: Work[] = [
  {
    id: "job1",
    company: "Empresa Actual",
    role: "Senior Software Developer",
    period: "2021 - Presente",
    description: "Desarrollo y mantenimiento de plataformas web de alto tráfico. Liderazgo técnico en el equipo de backend.",
    technologies: ["PHP", "Node.js", "React", "MySQL", "Docker"],
    logo: "company1_logo",
    color: "#4A90D9",
    achievements: [
      "Reduje el tiempo de carga en 40% optimizando queries.",
      "Lideré la migración a arquitectura de microservicios.",
      "Mentoré a 3 desarrolladores junior.",
    ],
  },
  {
    id: "job2",
    company: "Agencia Digital",
    role: "Full Stack Developer",
    period: "2018 - 2021",
    description: "Desarrollo de aplicaciones web para clientes de diversas industrias. Stack PHP/JavaScript.",
    technologies: ["PHP", "Laravel", "JavaScript", "Vue.js", "PostgreSQL"],
    logo: "company2_logo",
    color: "#7B52AB",
    achievements: [
      "Construí 15+ proyectos web de principio a fin.",
      "Implementé CI/CD con GitHub Actions.",
      "Reduje bugs en producción en 60% con TDD.",
    ],
  },
  {
    id: "job3",
    company: "Startup Tech",
    role: "Backend Developer",
    period: "2015 - 2018",
    description: "Backend de una plataforma SaaS B2B. API REST, integraciones de pagos y performance.",
    technologies: ["PHP", "Node.js", "MongoDB", "Redis", "AWS"],
    logo: "company3_logo",
    color: "#E8734A",
    achievements: [
      "Diseñé la arquitectura de la API REST principal.",
      "Integré Stripe y MercadoPago para pagos.",
      "Logré 99.9% de uptime del servicio.",
    ],
  },
];
