// data-manager.js - Data management functions

// Load user data from Supabase
async function loadUserData() {
    if (!currentUser) {
        // Load from localStorage for guest users
        loadFromLocalStorage();
        return;
    }
    
    try {
        // Try to load from Supabase
        const { data, error } = await supabase
            .from('user_data')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();
        
        if (data && data.data) {
            // Merge Supabase data with current data structure
            const mergedData = { ...studentData, ...data.data };
            
            // Ensure all required properties exist
            ensureDataStructure(mergedData);
            
            // Update global studentData
            Object.assign(studentData, mergedData);
            studentData.user_id = currentUser.id;
            
            // Update streaks based on loaded completions
            updateStreakInfo();
            
            // Notify that data is loaded
            if (typeof window.onDataLoaded === 'function') {
                window.onDataLoaded();
            }
        } else {
            // First time user or no data in Supabase, check localStorage
            loadFromLocalStorage();
            
            // Save to Supabase for future use
            if (currentUser) {
                studentData.user_id = currentUser.id;
                await saveUserData();
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to localStorage
        loadFromLocalStorage();
    }
}

// Save user data to Supabase
async function saveUserData() {
    if (!currentUser) {
        saveToLocalStorage();
        return;
    }
    
    try {
        const dataToSave = {
            user_id: currentUser.id,
            data: studentData,
            updated_at: new Date().toISOString()
        };
        
        // Check if data exists
        const { data: existing } = await supabase
            .from('user_data')
            .select('id')
            .eq('user_id', currentUser.id)
            .single();
        
        if (existing) {
            // Update existing
            await supabase
                .from('user_data')
                .update(dataToSave)
                .eq('user_id', currentUser.id);
        } else {
            // Insert new
            await supabase
                .from('user_data')
                .insert([dataToSave]);
        }
        
        // Also save to localStorage as backup
        saveToLocalStorage();
    } catch (error) {
        console.error('Error saving user data:', error);
        saveToLocalStorage();
    }
}

// Load from localStorage
function loadFromLocalStorage() {
    try {
        const key = currentUser ? `studentData_${currentUser.id}` : 'studentData_guest';
        const savedData = localStorage.getItem(key);
        
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            
            // Merge saved data with default data
            Object.keys(parsedData).forEach(key => {
                if (studentData[key] && typeof studentData[key] === 'object') {
                    Object.assign(studentData[key], parsedData[key]);
                }
            });
            
            // Update streaks
            updateStreakInfo();
            
            // Notify that data is loaded
            if (typeof window.onDataLoaded === 'function') {
                window.onDataLoaded();
            }
        }
    } catch (e) {
        console.log("Could not load data from localStorage:", e);
    }
}

// Save to localStorage
function saveToLocalStorage() {
    try {
        const key = currentUser ? `studentData_${currentUser.id}` : 'studentData_guest';
        localStorage.setItem(key, JSON.stringify(studentData));
    } catch (e) {
        console.log("Could not save data to localStorage:", e);
    }
}

// Ensure data structure integrity
function ensureDataStructure(data) {
    const defaultStructure = {
        user_id: null,
        budget: { monthly: 1200, spent: 845, remaining: 355 },
        academic: { studyHours: 18, predictedGPA: 3.6, nextExam: "Biology in 5 days", courses: [], assignments: [], notes: [] },
        financial: { income: 1200, expenses: [], savingsGoals: [], budgetCategories: {} },
        health: { exerciseDays: 4, waterGlasses: 6, sleepAverage: 6.5, exerciseMinutes: 98, workouts: [], nutritionLog: [] },
        emotional: { moodLog: [], journalEntries: [], stressLevels: [] },
        spiritual: { completions: [], currentStreak: 0, longestStreak: 0, totalDays: 0, lastCompletedDate: null, bibleStudyNotes: [] },
        career: { selectedCareer: null, learningProgress: { week1: { completed: false, score: 0 }, week2: { completed: false, score: 0 }, week3: { completed: false, score: 0 }, monthlyExam: { completed: false, score: 0 } }, skills: [], goals: [], applications: [] },
        tasks: [],
        badges: {},
        settings: { notifications: true, theme: 'light', privacy: 'private' }
    };
    
    // Merge with default structure
    Object.keys(defaultStructure).forEach(key => {
        if (!data[key]) {
            data[key] = defaultStructure[key];
        } else if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
            data[key] = { ...defaultStructure[key], ...data[key] };
        }
    });
    
    return data;
}

// Update streak information
function updateStreakInfo() {
    if (!studentData.spiritual || !Array.isArray(studentData.spiritual.completions)) {
        if (!studentData.spiritual) studentData.spiritual = {};
        studentData.spiritual.completions = [];
        studentData.spiritual.currentStreak = 0;
        studentData.spiritual.longestStreak = 0;
        studentData.spiritual.totalDays = 0;
        return;
    }
    
    // Sort completions chronologically
    const sortedCompletions = [...studentData.spiritual.completions].sort();
    
    if (sortedCompletions.length === 0) {
        studentData.spiritual.currentStreak = 0;
        studentData.spiritual.longestStreak = 0;
        studentData.spiritual.totalDays = 0;
        return;
    }
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedCompletions.length; i++) {
        const completionDate = new Date(sortedCompletions[sortedCompletions.length - 1 - i]);
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        
        if (completionDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
            currentStreak++;
        } else {
            break;
        }
    }
    
    studentData.spiritual.currentStreak = currentStreak;
    studentData.spiritual.totalDays = sortedCompletions.length;
    
    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    
    for (let i = 1; i < sortedCompletions.length; i++) {
        const prevDate = new Date(sortedCompletions[i - 1]);
        const currDate = new Date(sortedCompletions[i]);
        const diffTime = Math.abs(currDate - prevDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            tempStreak++;
        } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
        }
    }
    
    studentData.spiritual.longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
}

// Check and award badges
function checkBadges() {
    // Spiritual badges
    const totalDays = studentData.spiritual.totalDays || 0;
    const currentStreak = studentData.spiritual.currentStreak || 0;
    
    // Check non-consecutive badges
    if (totalDays >= 7) studentData.badges.spiritual.sevenDays.earned = true;
    if (totalDays >= 14) studentData.badges.spiritual.twoWeeks.earned = true;
    if (totalDays >= 30) studentData.badges.spiritual.oneMonth.earned = true;
    if (totalDays >= 90) studentData.badges.spiritual.threeMonths.earned = true;
    if (totalDays >= 365) studentData.badges.spiritual.oneYear.earned = true;
    
    // Check consecutive badges
    if (currentStreak >= 7) studentData.badges.spiritual.sevenDays.consecutive = true;
    if (currentStreak >= 14) studentData.badges.spiritual.twoWeeks.consecutive = true;
    if (currentStreak >= 30) studentData.badges.spiritual.oneMonth.consecutive = true;
    if (currentStreak >= 90) studentData.badges.spiritual.threeMonths.consecutive = true;
    if (currentStreak >= 365) studentData.badges.spiritual.oneYear.consecutive = true;
    
    // Career badges
    if (studentData.career.learningProgress?.week1?.completed) {
        studentData.badges.career.week1Complete = true;
    }
    if (studentData.career.learningProgress?.week2?.completed) {
        studentData.badges.career.week2Complete = true;
    }
    if (studentData.career.learningProgress?.week3?.completed) {
        studentData.badges.career.week3Complete = true;
    }
    if (studentData.career.learningProgress?.monthlyExam?.completed && 
        studentData.career.learningProgress.monthlyExam.score >= 70) {
        studentData.badges.career.monthlyExamPassed = true;
    }
}

// Export functions
window.dataManager = {
    loadUserData,
    saveUserData,
    loadFromLocalStorage,
    saveToLocalStorage,
    ensureDataStructure,
    updateStreakInfo,
    checkBadges
};

// Initialize data manager when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for auth to initialize
    if (typeof auth !== 'undefined' && auth.getCurrentUser()) {
        await loadUserData();
        checkBadges();
    }
});