// supabase-config.js - Supabase client configuration

// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://oqayjrbtvmxsoxanjwgq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xYXlqcmJ0dm14c294YW5qd2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMDcwMjQsImV4cCI6MjA4MDY4MzAyNH0.rfqKRTBo2V6HogaaceWASdChX4rJmD78Rhy7nxN-hyA';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global data storage structure
let studentData = {
    user_id: null,
    budget: {
        monthly: 1200,
        spent: 845,
        remaining: 355
    },
    academic: {
        studyHours: 18,
        predictedGPA: 3.6,
        nextExam: "Biology in 5 days",
        courses: [],
        assignments: [],
        notes: []
    },
    financial: {
        income: 1200,
        expenses: [],
        savingsGoals: [],
        budgetCategories: {}
    },
    health: {
        exerciseDays: 4,
        waterGlasses: 6,
        sleepAverage: 6.5,
        exerciseMinutes: 98,
        workouts: [],
        nutritionLog: []
    },
    emotional: {
        moodLog: [],
        journalEntries: [],
        stressLevels: []
    },
    spiritual: {
        completions: [],
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        lastCompletedDate: null,
        bibleStudyNotes: []
    },
    career: {
        selectedCareer: null,
        learningProgress: {
            week1: { completed: false, score: 0 },
            week2: { completed: false, score: 0 },
            week3: { completed: false, score: 0 },
            monthlyExam: { completed: false, score: 0 }
        },
        skills: [],
        goals: [],
        applications: []
    },
    tasks: [],
    badges: {
        spiritual: {
            sevenDays: { earned: false, consecutive: false },
            twoWeeks: { earned: false, consecutive: false },
            oneMonth: { earned: false, consecutive: false },
            threeMonths: { earned: false, consecutive: false },
            oneYear: { earned: false, consecutive: false }
        },
        bibleQuiz: {
            dailyQuiz: { earned: false, date: null }
        },
        career: {
            week1Complete: false,
            week2Complete: false,
            week3Complete: false,
            monthlyExamPassed: false
        },
        academic: {
            studyStreak: { earned: false, days: 0 },
            assignmentComplete: { earned: false, count: 0 }
        },
        financial: {
            budgetMet: { earned: false, months: 0 },
            savingsGoal: { earned: false, amount: 0 }
        },
        health: {
            exerciseWeek: { earned: false, weeks: 0 },
            sleepGoal: { earned: false, days: 0 }
        }
    },
    settings: {
        notifications: true,
        theme: 'light',
        privacy: 'private'
    }
};

// Badge definitions
const badgeDefinitions = {
    "7 Days (Consecutive)": { 
        icon: "fas fa-star", 
        description: "7 consecutive days of Bible study",
        type: "spiritual",
        consecutive: true,
        daysRequired: 7
    },
    "7 Days": { 
        icon: "fas fa-star", 
        description: "7 days of Bible study",
        type: "spiritual",
        consecutive: false,
        daysRequired: 7
    },
    "2 Weeks (Consecutive)": { 
        icon: "fas fa-medal", 
        description: "14 consecutive days of Bible study",
        type: "spiritual",
        consecutive: true,
        daysRequired: 14
    },
    "2 Weeks": { 
        icon: "fas fa-medal", 
        description: "14 days of Bible study",
        type: "spiritual",
        consecutive: false,
        daysRequired: 14
    },
    "1 Month (Consecutive)": { 
        icon: "fas fa-crown", 
        description: "30 consecutive days of Bible study",
        type: "spiritual",
        consecutive: true,
        daysRequired: 30
    },
    "1 Month": { 
        icon: "fas fa-crown", 
        description: "30 days of Bible study",
        type: "spiritual",
        consecutive: false,
        daysRequired: 30
    },
    "3 Months (Consecutive)": { 
        icon: "fas fa-trophy", 
        description: "90 consecutive days of Bible study",
        type: "spiritual",
        consecutive: true,
        daysRequired: 90
    },
    "3 Months": { 
        icon: "fas fa-trophy", 
        description: "90 days of Bible study",
        type: "spiritual",
        consecutive: false,
        daysRequired: 90
    },
    "1 Year (Consecutive)": { 
        icon: "fas fa-award", 
        description: "365 consecutive days of Bible study",
        type: "spiritual",
        consecutive: true,
        daysRequired: 365
    },
    "1 Year": { 
        icon: "fas fa-award", 
        description: "365 days of Bible study",
        type: "spiritual",
        consecutive: false,
        daysRequired: 365
    },
    "Bible Expert": { 
        icon: "fas fa-bible", 
        description: "Perfect score on daily Bible quiz",
        type: "quiz",
        consecutive: false
    },
    "Week 1 Complete": { 
        icon: "fas fa-code", 
        description: "Completed Week 1 of career learning",
        type: "career",
        consecutive: false
    },
    "Week 2 Complete": { 
        icon: "fas fa-laptop-code", 
        description: "Completed Week 2 of career learning",
        type: "career",
        consecutive: false
    },
    "Week 3 Complete": { 
        icon: "fas fa-server", 
        description: "Completed Week 3 of career learning",
        type: "career",
        consecutive: false
    },
    "Monthly Exam Passed": { 
        icon: "fas fa-graduation-cap", 
        description: "Passed the monthly career exam",
        type: "career",
        consecutive: false
    },
    "Study Streak": { 
        icon: "fas fa-book", 
        description: "7 consecutive days of studying",
        type: "academic",
        consecutive: true,
        daysRequired: 7
    },
    "Budget Master": { 
        icon: "fas fa-chart-pie", 
        description: "Met budget for 3 consecutive months",
        type: "financial",
        consecutive: true,
        monthsRequired: 3
    },
    "Fitness Champion": { 
        icon: "fas fa-dumbbell", 
        description: "Exercised 5 days in a week",
        type: "health",
        consecutive: false,
        daysRequired: 5
    }
};

// Career database
const careerDatabase = {
    tech: [
        "Software Developer", "Web Developer", "Mobile App Developer", "Frontend Developer", 
        "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Cloud Architect",
        "Data Scientist", "Machine Learning Engineer", "AI Specialist", "Data Analyst",
        "Cybersecurity Analyst", "Information Security Manager", "Network Administrator",
        "Database Administrator", "UX/UI Designer", "Product Manager", "Technical Writer",
        "QA Engineer", "Systems Analyst", "IT Consultant", "Game Developer", "Blockchain Developer"
    ],
    health: [
        "Doctor", "Nurse", "Surgeon", "Dentist", "Pharmacist", "Physical Therapist",
        "Medical Researcher", "Biomedical Engineer", "Psychologist", "Psychiatrist",
        "Nutritionist", "Healthcare Administrator", "Medical Technologist", "Radiologist"
    ],
    business: [
        "Financial Analyst", "Investment Banker", "Accountant", "Marketing Manager",
        "Business Consultant", "Human Resources Manager", "Operations Manager",
        "Project Manager", "Entrepreneur", "Sales Manager", "Supply Chain Manager"
    ],
    arts: [
        "Graphic Designer", "Illustrator", "Animator", "Photographer", "Video Editor",
        "Content Creator", "Art Director", "Creative Director", "Writer", "Musician"
    ],
    science: [
        "Research Scientist", "Chemist", "Biologist", "Physicist", "Environmental Scientist",
        "Geologist", "Astronomer", "Laboratory Technician", "Science Writer"
    ],
    social: [
        "Social Worker", "Counselor", "Teacher", "Professor", "Non-profit Director",
        "Community Manager", "Humanitarian Worker", "Policy Analyst"
    ]
};

// Career learning materials
const careerLearningMaterials = {
    "Software Developer": {
        week1: "This week focuses on programming fundamentals. Learn basic algorithms, data structures (arrays, linked lists, stacks, queues), and problem-solving techniques. Practice writing clean, efficient code in a language like Python or JavaScript. Understand version control with Git and GitHub.",
        week2: "Now dive into web development basics. Learn HTML for structure, CSS for styling, and JavaScript for interactivity. Understand how browsers work, DOM manipulation, and responsive design principles. Build a simple portfolio website.",
        week3: "Explore backend development and databases. Learn about servers, APIs, RESTful services, and databases (SQL and NoSQL). Understand authentication, authorization, and security basics. Build a simple full-stack application.",
        month1: "This comprehensive exam tests your understanding of software development fundamentals, problem-solving skills, and ability to build a complete application. You'll need to demonstrate proficiency in frontend and backend development, database design, and deployment."
    },
    "Data Scientist": {
        week1: "Start with statistics and probability fundamentals. Learn descriptive statistics, probability distributions, hypothesis testing, and statistical inference. Practice with tools like Python's NumPy and Pandas libraries.",
        week2: "Dive into data visualization and exploration. Learn to clean and preprocess data, handle missing values, and create meaningful visualizations using Matplotlib, Seaborn, or Tableau. Understand exploratory data analysis techniques.",
        week3: "Introduction to machine learning. Learn about supervised learning (regression, classification), unsupervised learning (clustering, dimensionality reduction), and model evaluation. Practice with Scikit-learn.",
        month1: "The monthly exam tests your ability to analyze a dataset from start to finish: data cleaning, exploration, visualization, feature engineering, model building, and interpretation of results."
    },
    "Web Developer": {
        week1: "Master HTML5 semantic elements, forms, and accessibility. Learn CSS fundamentals including Flexbox, Grid, and responsive design principles. Practice building accessible, mobile-friendly layouts.",
        week2: "Deep dive into JavaScript: ES6+ features, DOM manipulation, events, asynchronous programming (callbacks, promises, async/await). Learn about APIs and how to fetch data from servers.",
        week3: "Explore frontend frameworks (React, Vue, or Angular). Learn component-based architecture, state management, and routing. Build a dynamic single-page application.",
        month1: "The comprehensive exam requires building a complete web application with responsive design, interactive features, API integration, and proper code organization."
    }
};

// Daily Bible verses
const dailyVerses = [
    {
        reference: "Philippians 4:13",
        text: "\"I can do all things through Christ who strengthens me.\"",
        study: "This powerful verse reminds us that our strength doesn't come from ourselves but from Christ. As students facing academic challenges, personal struggles, and the pressures of life, we can find comfort knowing that we're not relying on our own limited abilities. When you feel overwhelmed by exams, relationships, or future uncertainties, remember that Christ provides the strength you need to persevere. Take a moment today to reflect on areas where you need His strength and surrender them in prayer."
    },
    {
        reference: "Jeremiah 29:11",
        text: "\"For I know the plans I have for you,\" declares the LORD, \"plans to prosper you and not to harm you, plans to give you hope and a future.\"",
        study: "God has a specific plan for your life that includes your education, career, relationships, and personal growth. This verse assures us that God's plans are always for our good, even when we can't see the bigger picture. As a student, you might be anxious about your future - what major to choose, what career path to follow, or where life will take you. Trust that God is guiding your steps and has prepared opportunities specifically designed for you. Your current studies and challenges are part of His preparation process."
    },
    {
        reference: "Proverbs 3:5-6",
        text: "\"Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.\"",
        study: "This passage emphasizes complete reliance on God rather than our own wisdom. As students, we're constantly learning and accumulating knowledge, but this verse reminds us that true wisdom begins with trusting God. When facing difficult decisions about relationships, academic choices, or life direction, resist the temptation to rely solely on your own reasoning. Instead, seek God's guidance through prayer and scripture. As you acknowledge Him in all your ways, He promises to direct your path clearly."
    },
    {
        reference: "Isaiah 40:31",
        text: "\"But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.\"",
        study: "Student life can be exhausting - late-night study sessions, part-time jobs, social commitments, and personal responsibilities. This verse promises supernatural renewal for those who place their hope in God. Like eagles that soar above storms, God can lift you above your circumstances. When you feel like you can't continue, when burnout threatens, turn to God in hope. He will renew your physical, emotional, and spiritual energy, enabling you to continue your journey without collapsing under the pressure."
    },
    {
        reference: "Psalm 119:105",
        text: "\"Your word is a lamp for my feet, a light on my path.\"",
        study: "Scripture provides guidance for our daily decisions and long-term direction. Just as a lamp illuminates only the next step in a dark path, God's word often reveals just enough light for our immediate next steps rather than the entire journey. This is especially relevant for students making decisions about their future. You might not see your entire career path, but God's word will guide your next right step - which classes to take, which opportunities to pursue, which relationships to invest in. Regular Bible study keeps this light shining brightly."
    }
];

// Bible quiz questions
const bibleQuizQuestions = [
    {
        question: "Who wrote most of the New Testament letters?",
        options: ["Peter", "Paul", "John", "James"],
        correct: 1
    },
    {
        question: "What is the first book of the Bible?",
        options: ["Exodus", "Genesis", "Matthew", "Psalms"],
        correct: 1
    },
    {
        question: "How many disciples did Jesus have?",
        options: ["10", "12", "14", "7"],
        correct: 1
    },
    {
        question: "What city was Jesus born in?",
        options: ["Jerusalem", "Bethlehem", "Nazareth", "Capernaum"],
        correct: 1
    },
    {
        question: "Who was the first king of Israel?",
        options: ["David", "Solomon", "Saul", "Samuel"],
        correct: 2
    }
];

// Health tips
const healthTips = [
    "Stay Hydrated: Drinking enough water improves concentration and prevents fatigue. Aim for 8 glasses a day, especially during study sessions.",
    "Take regular breaks during study sessions. Try the 50/10 rule: 50 minutes of study, 10 minutes of movement.",
    "Eat brain-boosting foods like nuts, berries, and fatty fish to improve concentration.",
    "Practice deep breathing for 5 minutes when stressed. It lowers cortisol and improves focus.",
    "Maintain good posture while studying to prevent back and neck pain.",
    "Get sunlight exposure daily to regulate your circadian rhythm and improve mood.",
    "Limit caffeine intake after 2 PM to ensure better sleep quality.",
    "Incorporate strength training 2-3 times per week to boost energy and reduce stress.",
    "Practice mindful eating by paying attention to your food without distractions.",
    "Aim for 7-9 hours of sleep each night for optimal cognitive function."
];

// Export the Supabase client and data
window.supabase = supabase;
window.studentData = studentData;
window.badgeDefinitions = badgeDefinitions;
window.careerDatabase = careerDatabase;
window.careerLearningMaterials = careerLearningMaterials;
window.dailyVerses = dailyVerses;
window.bibleQuizQuestions = bibleQuizQuestions;
window.healthTips = healthTips;