// auth.js - Authentication functions

let currentUser = null;
let userProfile = null;

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', async function() {
    await initializeAuth();
    
    // Setup navigation
    setupNavigation();
});

// Initialize authentication
async function initializeAuth() {
    // Check for existing session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session && session.user) {
        await handleUserSession(session.user);
    } else {
        showLoginUI();
    }
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            await handleUserSession(session.user);
        } else if (event === 'SIGNED_OUT') {
            handleUserSignOut();
        }
    });
}

// Handle user session
async function handleUserSession(user) {
    currentUser = user;
    
    // Get or create user profile
    await getUserProfile();
    
    // Load user-specific data
    await loadUserData();
    
    // Update UI for logged-in user
    updateUserUI();
}

// Get or create user profile
async function getUserProfile() {
    if (!currentUser) return;
    
    try {
        // Try to get existing profile
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
        
        if (error && error.code === 'PGRST116') {
            // Profile doesn't exist, create one
            const newProfile = {
                id: currentUser.id,
                email: currentUser.email,
                full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
                avatar_url: currentUser.user_metadata?.avatar_url || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            const { data: insertData, error: insertError } = await supabase
                .from('profiles')
                .insert([newProfile]);
            
            if (!insertError) {
                userProfile = newProfile;
            }
        } else if (data) {
            userProfile = data;
        }
    } catch (error) {
        console.error('Error getting user profile:', error);
    }
}

// Update user UI
function updateUserUI() {
    if (!currentUser || !userProfile) {
        showLoginUI();
        return;
    }
    
    // Update header if elements exist
    const headerAvatar = document.getElementById('header-avatar');
    const headerUsername = document.getElementById('header-username');
    const headerUseremail = document.getElementById('header-useremail');
    const userProfileDiv = document.getElementById('user-profile');
    const loginButton = document.getElementById('login-button');
    
    if (headerUsername && headerUseremail) {
        headerUsername.textContent = userProfile.full_name || currentUser.email?.split('@')[0] || 'User';
        headerUseremail.textContent = currentUser.email || '';
        
        if (headerAvatar) {
            if (userProfile.avatar_url) {
                headerAvatar.innerHTML = `<img src="${userProfile.avatar_url}" alt="${userProfile.full_name}">`;
            } else {
                const initials = (userProfile.full_name || 'U').charAt(0).toUpperCase();
                headerAvatar.innerHTML = `<span>${initials}</span>`;
            }
        }
    }
    
    if (userProfileDiv) userProfileDiv.classList.remove('hidden');
    if (loginButton) loginButton.style.display = 'none';
}

// Show login UI
function showLoginUI() {
    const userProfileDiv = document.getElementById('user-profile');
    const loginButton = document.getElementById('login-button');
    
    if (userProfileDiv) userProfileDiv.classList.add('hidden');
    if (loginButton) loginButton.style.display = 'block';
}

// Sign in with email
async function signInWithEmail(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign up with email
async function signUpWithEmail(email, password, name) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name
                }
            }
        });
        
        if (error) throw error;
        
        if (data.user?.identities?.length === 0) {
            return { success: false, error: 'An account with this email already exists' };
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign in with Google
async function signInWithGoogle() {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) throw error;
    } catch (error) {
        console.error('Google sign in error:', error);
    }
}

// Sign in with GitHub
async function signInWithGitHub() {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) throw error;
    } catch (error) {
        console.error('GitHub sign in error:', error);
    }
}

// Reset password
async function resetPassword(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password.html`,
        });
        
        if (error) throw error;
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign out
async function signOut() {
    try {
        await supabase.auth.signOut();
        handleUserSignOut();
        
        // Redirect to home page
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

// Handle user sign out
function handleUserSignOut() {
    currentUser = null;
    userProfile = null;
    
    // Reset to default data
    studentData = {
        user_id: null,
        budget: { monthly: 1200, spent: 845, remaining: 355 },
        academic: { studyHours: 18, predictedGPA: 3.6, nextExam: "Biology in 5 days" },
        health: { exerciseDays: 4, waterGlasses: 6, sleepAverage: 6.5, exerciseMinutes: 98 },
        tasks: [],
        spiritual: { completions: [], currentStreak: 0, longestStreak: 0, totalDays: 0, lastCompletedDate: null },
        badges: {},
        career: {}
    };
    
    showLoginUI();
}

// Setup navigation
function setupNavigation() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks) navLinks.classList.remove('active');
        });
    });
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Get user profile
function getUserProfileData() {
    return userProfile;
}

// Export functions
window.auth = {
    initializeAuth,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithGitHub,
    resetPassword,
    signOut,
    isAuthenticated,
    getCurrentUser,
    getUserProfileData
};