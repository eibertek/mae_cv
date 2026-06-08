export interface Work {
  id: string;
  company: string;
  role: string;
  period: string;
  description: { en: string; es: string };
  technologies: string[];
  logo: string;
  color: string;
  achievements: { en: string[]; es: string[] };
}

export const WORKS: Work[] = [
  {
    id: "happyfuncorp",
    company: "HappyFunCorp",
    role: "Senior Web Developer",
    period: "Mar 2024 – Present",
    description: {
      en: "Design and management of UI components for client pages. Bug fixing, performance optimization, and testing coverage.",
      es: "Diseño y gestión de componentes UI para páginas de clientes. Fix de errores, optimización de performance y cobertura de testing.",
    },
    technologies: ["JavaScript", "Node.js", "React", "Next.js", "TypeScript"],
    logo: "company_hfc",
    color: "#FF6B35",
    achievements: {
      en: [
        "Design and management of complex UI components.",
        "Performance optimization on client projects.",
        "Testing coverage implementation when required.",
      ],
      es: [
        "Diseño y gestión de componentes UI complejos.",
        "Optimización de performance en proyectos de clientes.",
        "Implementación de cobertura de testing cuando requerido.",
      ],
    },
  },
  {
    id: "globant2",
    company: "Globant",
    role: "Web UI Developer Sr",
    period: "Nov 2021 – Mar 2024",
    description: {
      en: "Web solution delivery based on JavaScript with Next.js, React, and Contentful as headless CMS.",
      es: "Delivery de soluciones web basadas en Javascript con Next.js, React y Contentful como headless CMS.",
    },
    technologies: ["Next.js", "React", "Contentful", "JavaScript", "TypeScript", "GraphQL"],
    logo: "company_globant",
    color: "#C7D43D",
    achievements: {
      en: [
        "Implemented solutions with Contentful as headless CMS.",
        "Obtained Contentful Certified Professional certification.",
        "Delivered Next.js and React projects for enterprise clients.",
      ],
      es: [
        "Implementé soluciones con Contentful como headless CMS.",
        "Obtuve certificación Contentful Certified Professional.",
        "Entrega de proyectos con Next.js y React para clientes enterprise.",
      ],
    },
  },
  {
    id: "healthnote",
    company: "Health Note",
    role: "Senior Software Developer",
    period: "Mar 2021 – Oct 2021",
    description: {
      en: "Software development with Node.js for a digital health platform.",
      es: "Desarrollo de software con Node.js para plataforma de salud digital.",
    },
    technologies: ["Node.js", "JavaScript", "TypeScript"],
    logo: "company_healthnote",
    color: "#4CAF50",
    achievements: {
      en: ["Backend development with Node.js for a medical platform."],
      es: ["Desarrollo backend con Node.js para plataforma médica."],
    },
  },
  {
    id: "cognizant",
    company: "Cognizant Softvision",
    role: "Software Developer",
    period: "Feb 2019 – Sep 2020",
    description: {
      en: "FullStack JavaScript developer with React, Angular and Node.js. Postgres database and Elasticsearch as search engine.",
      es: "Desarrollador FullStack Javascript con React, Angular y Node.js. Base de datos Postgres y Elasticsearch como motor de búsqueda.",
    },
    technologies: ["React", "Angular", "Node.js", "PostgreSQL", "Elasticsearch"],
    logo: "company_cognizant",
    color: "#1A4E8C",
    achievements: {
      en: [
        "FullStack development across multiple projects with React and Angular.",
        "Search implementation with Elasticsearch.",
        "Backend with Node.js and Postgres.",
      ],
      es: [
        "Desarrollo FullStack en múltiples proyectos con React y Angular.",
        "Implementación de búsqueda con Elasticsearch.",
        "Backend con Node.js y Postgres.",
      ],
    },
  },
  {
    id: "ey",
    company: "EY",
    role: "Supervising Associate FrontEnd Developer",
    period: "Apr 2017 – Jan 2019",
    description: {
      en: "Migration of a Visual Studio project (C#) to React.js as Frontend.",
      es: "Migración de proyecto Visual Studio (C#) a React.js como Frontend.",
    },
    technologies: ["React.js", "JavaScript", "Visual C#"],
    logo: "company_ey",
    color: "#FFE600",
    achievements: {
      en: [
        "Led the migration from Visual C# to React.js.",
        "Frontend maintenance in production for 2 years.",
      ],
      es: [
        "Lideré la migración de Visual C# a React.js.",
        "Mantenimiento de frontend en producción durante 2 años.",
      ],
    },
  },
  {
    id: "globant1",
    company: "Globant",
    role: "Full Stack Developer",
    period: "Apr 2017 – Aug 2017",
    description: {
      en: "Frontend developer for JP Morgan account using React and Node.js.",
      es: "Frontend developer para la cuenta JP Morgan usando React y Node.js.",
    },
    technologies: ["React", "Node.js", "JavaScript"],
    logo: "company_globant",
    color: "#C7D43D",
    achievements: {
      en: ["Frontend for JP Morgan account with React and Node.js."],
      es: ["Frontend para cuenta JP Morgan con React y Node.js."],
    },
  },
  {
    id: "livenation",
    company: "LiveNation",
    role: "Front End Developer",
    period: "Mar 2016 – Mar 2017",
    description: {
      en: "Front end maintenance and new features for the Sponsorship team at LiveNation.",
      es: "Mantenimiento y nuevos desarrollos para el equipo de Sponsorship en LiveNation.",
    },
    technologies: ["JavaScript", "HTML", "CSS"],
    logo: "company_livenation",
    color: "#E41C23",
    achievements: {
      en: ["Frontend development for the Sponsorship team at LiveNation."],
      es: ["Desarrollo frontend para el equipo de Sponsorship en LiveNation."],
    },
  },
  {
    id: "disney",
    company: "Proyecto Disney Resort",
    role: "PHP Developer",
    period: "Aug 2015 – Mar 2016",
    description: {
      en: "UI Developer with PHP (Zend Framework), JavaScript (jQuery), unit tests and automated tasks.",
      es: "UI Developer con PHP (Framework Zend), Javascript (jQuery), Unit tests y tareas automatizadas.",
    },
    technologies: ["PHP", "Zend", "JavaScript", "jQuery"],
    logo: "company_disney",
    color: "#1565C0",
    achievements: {
      en: [
        "PHP/Zend development for Disney Resort project.",
        "Unit test implementation and task automation.",
      ],
      es: [
        "Desarrollo con PHP/Zend para proyecto Disney Resort.",
        "Implementación de unit tests y automatización de tareas.",
      ],
    },
  },
];
