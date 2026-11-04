/** Initial portfolio copy transcribed from the owner's supplied resume. */
export const cvContent = {
  name: 'Yograj Rijal',
  role: 'Full-Stack Engineer',
  focus: 'React · TypeScript · Node.js',
  location: 'Banasthali, Kathmandu, Nepal',
  phone: '+977 9860256338',
  email: 'yograjrijal926@gmail.com',
  github: 'https://github.com/yograj47',
  linkedin: 'https://www.linkedin.com/in/yograj-rijal-b84893374/',
  summary:
    'Full-stack developer experienced in building type-safe, component-driven web applications with React, TypeScript, and Node.js. Skilled in Zod validation, Zustand state management, REST APIs, and SQL/NoSQL data workflows. Academic experience with .NET and relational database modelling. Pursuing a BSc (Hons) Computing at Islington College (London Metropolitan University).',
  skillGroups: [
    {
      label: 'Frontend',
      skills:
        'React.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, ShadCN UI, MUI',
    },
    {
      label: 'State & validation',
      skills: 'Zustand, React Context, TanStack Query, Zod, Auth0, OAuth',
    },
    {
      label: 'Backend & databases',
      skills:
        'Node.js, Express.js, Next.js, .NET, MongoDB, MySQL, Oracle, Entity Framework',
    },
    {
      label: 'Tools & languages',
      skills: 'Git, GitHub, VS Code, Linux, Windows; Java, Python, C#',
    },
  ],
  experience: [
    {
      title: 'Junior Frontend Developer',
      organization: 'Juno Technology',
      location: 'Kathmandu, Nepal',
      dates: 'Aug 2025 - Dec 2025',
      technologies: 'React · TypeScript · Zustand · Zod · Express · MongoDB',
      bullets: [
        'Built reusable, accessible React and Tailwind CSS components aligned with established design-system guidelines.',
        'Managed global and local state with Zustand and React Hooks to reduce unnecessary re-renders and improve UI responsiveness.',
        'Applied TypeScript and Zod for runtime validation and safer client-side form and API payload handling.',
        'Integrated Express.js REST APIs with MongoDB; contributed across the request-to-render lifecycle, code reviews, and Git-based team workflows.',
      ],
    },
  ],
  projects: [
    {
      title: 'GIMS - Inventory Management System',
      role: 'Full Stack',
      technologies:
        'React, TypeScript, Node.js, Express, MongoDB, Zod, Zustand',
      bullets: [
        'Built an inventory system for grocery stores with typed API contracts, schema validation, REST endpoints, and MongoDB data modelling.',
        'Used useMemo and useCallback to reduce unnecessary re-renders in data-heavy inventory lists.',
      ],
    },
    {
      title: 'Weather App',
      role: 'Frontend',
      technologies:
        'React, TypeScript, Tailwind CSS, OpenWeatherMap, TanStack Query',
      bullets: [
        'Created a responsive weather app with typed API models, asynchronous fetching, loading states, and error handling.',
      ],
    },
    {
      title: 'Vehicle Rental System',
      role: 'Full Stack',
      technologies: 'Java, JSP, JEE, MySQL',
      bullets: [
        'Developed MVC-based Java services and CRUD booking workflows; modelled relational data and implemented session-based authentication.',
      ],
    },
    {
      title: 'Journal App',
      role: 'Desktop',
      technologies: '.NET MAUI, C#, Entity Framework, SQLite',
      bullets: [
        'Built a cross-platform journal app using Entity Framework ORM and database migrations with SQLite.',
      ],
    },
  ],
  credentialProfile: 'https://www.credly.com/users/yograj-rijal/badges/credly',
  trainingIssuer: 'Amazon Web Services Training and Certification',
  training: [
    {
      title:
        'AWS Academy Graduate - Machine Learning for Natural Language Processing - Training Badge',
      issuedOn: '2024-10-27',
      issuedLabel: 'Oct 27, 2024',
    },
    {
      title:
        'AWS Academy Graduate - Machine Learning Foundations - Training Badge',
      issuedOn: '2024-10-21',
      issuedLabel: 'Oct 21, 2024',
    },
    {
      title: 'AWS Academy Graduate - Data Engineering - Training Badge',
      issuedOn: '2024-10-19',
      issuedLabel: 'Oct 19, 2024',
    },
    {
      title: 'AWS Academy Graduate - Cloud Foundations - Training Badge',
      issuedOn: '2024-10-17',
      issuedLabel: 'Oct 17, 2024',
    },
  ],
  education: [
    {
      title: 'BSc (Hons) Computing',
      organization: 'Islington College',
      awardingBody: 'London Metropolitan University',
      location: 'Kathmandu, Nepal',
      dates: '2023 - Expected 2026',
    },
    {
      title: 'SLC - Management',
      organization: 'Ganesh Himal Campus',
      awardingBody: 'National Examinations Board',
      location: 'Dhading, Nepal',
      dates: '2021 - 2023',
    },
    {
      title: 'SEE',
      organization: 'Dhading Boarding Secondary School',
      awardingBody: 'National Examinations Board',
      location: 'Dhading, Nepal',
      dates: '2021',
    },
  ],
} as const;
