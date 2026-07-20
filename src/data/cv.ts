// Central CV data — single source of truth for /about and the resume explorer.
// Edit this file to update anything.

type WorkItem = { period: string; role: string; org: string; points: string[] };
type EduItem  = { period: string; qualification: string; school: string };
type StackGroup = { group: string; items: string[] };

export const CV: {
  headline: string;
  bio: string[];
  techStack: StackGroup[];
  work: WorkItem[];
  volunteer: WorkItem[];
  education: EduItem[];
  achievements: string[];
  certificates: string[];
} = {
  headline: "Backend engineer with a teaching heart.",

  bio: [
    "I'm a software engineer with experience building scalable applications. I work primarily with Java and Python — building backends that stay standing when parts of them fall over.",
    "I've taught and mentored over 1,300 undergraduates in computer science and IT, and I lead the KNUST IoT Hub chapter. The work I care most about tends to sit where good engineering meets people learning to do it themselves.",
    "Beyond the day job, I contribute to agricultural supply-chain work and occasionally write about what I'm learning.",
  ],

  techStack: [
    { group: "Languages",       items: ["Java", "Python", "JavaScript", "SQL", "C++"] },
    { group: "Backend & APIs",  items: ["Spring Boot", "Spring Cloud", "Spring Security", "FastAPI", "Django", "REST", "JWT", "Kafka"] },
    { group: "Frontend & UI",   items: ["HTML", "CSS", "Bootstrap", "Material UI", "React Js", "Typescript", "Angular"] },
    { group: "Data & ML",       items: ["PostgreSQL", "Redis", "TensorFlow", "OpenCV", "Pandas", "NumPy", "Power BI", "Jupyter"] },
    { group: "Cloud & DevOps",  items: ["Docker", "AWS ECS", "S3", "Lambda", "GitHub Actions", "Git", "Firebase", "PostGIS"] },
    { group: "Also",            items: ["Tailwind CSS", "React", "Figma", "Streamlit", "Matplotlib"] },
  ],

  work: [
    {
      period: "Jan 2026 — present",
      role: "Backend Engineer",
      org: "AmaliTech Ghana",
      points: ["Spring Boot backend development for financial applications."],
    },
    {
      period: "Apr 2025 — Dec 2025",
      role: "Backend Graduate Trainee",
      org: "AmaliTech Ghana",
      points: [
        "Developed backend services using Spring Boot.",
        "Built 8+ REST APIs for real-world use cases.",
        "Collaborated with frontend trainees to ship a full job application and recruitment platform.",
      ],
    },
    {
      period: "Jan 2025 — Aug 2025",
      role: "Graduate Teaching Assistant",
      org: "Department of Computer Science, KNUST",
      points: [
        "Supported and tutored 1,300+ students on programming and algorithms.",
        "Prepared coursework, ran tutorials, and assisted with research and manuscript submission.",
      ],
    },
    {
      period: "Nov 2023 — 2025",
      role: "Lead, IoTHub Network (KNUST Chapter)",
      org: "IoTHub Network",
      points: [
        "Organized monthly community sessions on emerging tech.",
        "Planned and executed tech events with the Kumasi chapter.",
        "Developed practical IoT solutions for expo presentations.",
      ],
    },
    {
      period: "Nov 2023 — Dec 2024",
      role: "Undergraduate Teaching Assistant",
      org: "Department of Computer Science, KNUST",
      points: [
        "Supported and reviewed 21+ undergraduate research projects.",
        "Prepared teaching materials and ran tutorials.",
      ],
    },
    {
      period: "Sept 2022 — present",
      role: "Research & Technical Information",
      org: "Efficient Supply of Goods (ESOG), Africa",
      points: [
        "Organizing research and engaging stakeholders.",
        "Preparing company documents and testing the platform.",
      ],
    },
    {
      period: "Nov 2020 — Nov 2023",
      role: "IT Support Lead",
      org: "FlincHub",
      points: [
        "Managed system maintenance, updates, and implemented an automated email spam sorting system.",
        "Developed a biometric attendance system using Arduino; oversaw website development.",
      ],
    },
    {
      period: "Sept 2022 — Dec 2022",
      role: "Lab Intern",
      org: "CARISCA Innovations Lab, KNUST",
      points: [
        "Managed and developed the ESOG Africa platform.",
        "Engineered an Employee Management System and Customer Relations App.",
        "Spearheaded project specs, pitch deck, and Figma UI.",
      ],
    },
  ],

  volunteer: [
    {
      period: "Sept 2022 — Aug 2023",
      role: "President",
      org: "Computer Science Society, KNUST",
      points: [
        "Founded The Prof Acquah Battle competition (algorithms, quiz, problem-solving).",
        "Organized hackathons, bootcamps, and academic outreach to high schools.",
        "Increased engagement via the School of Groups (SoG) initiative.",
      ],
    },
    {
      period: "Aug 2022 — Aug 2023",
      role: "Machine Learning Core Team",
      org: "GDSC KNUST",
      points: [
        "Led Python programming sessions and facilitated ML boot camps.",
      ],
    },
    {
      period: "Feb 2023 — Mar 2023",
      role: "Volunteering Facilitator",
      org: "Beistand Tech · All-Out Flutter Mobile Dev Boot Camp",
      points: [
        "Helped participants set up, explained programming concepts, and coordinated activities.",
      ],
    },
    {
      period: "2023",
      role: "Technical Team Lead",
      org: "Tek Invasion Hackathon",
      points: [
        "Budgeted technical materials, managed resources, and organized task assignments.",
      ],
    },
  ],

  education: [
    { period: "Jan 2024 — Nov 2025", qualification: "MPhil, Computer Science", school: "Kwame Nkrumah University of Science and Technology (KNUST)" },
    { period: "Sept 2019 — Aug 2023", qualification: "BSc, Computer Science",  school: "Kwame Nkrumah University of Science and Technology (KNUST)" },
    { period: "Mar 2024 — Aug 2024",  qualification: "Data Analysis",           school: "Blossom Academy" },
    { period: "Sept 2016 — Jul 2019", qualification: "General Science (WASSCE)", school: "St. Francis Xavier Minor Seminary, Wa" },
  ],

  achievements: [
    "Academian, Next Generation Digital Action (NGDA) — 2024",
    "3rd place, International Process Optimisation Challenge (IPOC), Tunisia — 2023",
    "Computer Science Society Excellence Award, KNUST — 2023",
    "3rd place, Swiss Re Startup Academy, JA Ghana — 2020",
    "1st place, Robotics Inspired Science Education (RISE) Program — 2018",
  ],

  certificates: [
    "Learning Spring Boot and Spring Security · LinkedIn",
    "Machine Learning with Python · Datacamp",
    "Python Programming for Developers · Datacamp",
    "Python Educator Certification · VEX.CODE VR",
    "Google Data Analytics · Coursera",
    "Learning Django · LinkedIn",
  ],
};
