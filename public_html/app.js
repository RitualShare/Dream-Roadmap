const appState = {
    currentDream: 'Create a Revolutionary VR Game that Transforms Education',
    user: null,
    tasks: [
        { text: 'Complete Unity VR course', date: '2024-06-30', completed: false },
        { text: 'Develop game prototype', date: '2024-09-30', completed: false },
        { text: 'Conduct user testing with educators', date: '2024-12-31', completed: false }
    ],
    achievements: [
        { text: 'Finished online C# programming course', description: 'Completed 30-day coding challenge', icon: '💻' },
        { text: 'Attended VR Education Conference', description: 'Networked with industry experts', icon: '🎓' },
        { text: 'Created first 3D model', description: 'Designed a virtual classroom environment', icon: '🏫' }
    ],
    resources: [
        {
            id: 1,
            title: "Dr. Jane Smith",
            type: "Expert",
            category: "People",
            description: "VR education specialist with 10 years of experience in game-based learning.",
            icon: "👩‍🏫",
            tags: ["VR", "Education", "Game Design"],
            action: "Schedule a consultation"
        },
        {
            id: 2,
            title: "VR Development Meetup",
            type: "Event",
            category: "Places",
            description: "Monthly meetup for VR developers to share knowledge and network.",
            icon: "🏢",
            tags: ["Networking", "VR", "Community"],
            action: "RSVP to event"
        },
        {
            id: 3,
            title: "Unity VR Toolkit",
            type: "Software",
            category: "Things",
            description: "Essential toolkit for developing VR applications in Unity.",
            icon: "🛠️",
            tags: ["Unity", "VR", "Development"],
            action: "Download toolkit"
        },
        {
            id: 4,
            title: "VR Innovators Community",
            type: "Online Platform",
            category: "Places",
            description: "Online forum and resource hub for VR innovators and enthusiasts.",
            icon: "🌐",
            tags: ["Community", "VR", "Innovation"],
            action: "Join community"
        },
        {
            id: 5,
            title: "VR Headset Pro X",
            type: "Hardware",
            category: "Things",
            description: "Latest VR headset with high resolution and advanced motion tracking.",
            icon: "🥽",
            tags: ["Hardware", "VR", "Technology"],
            action: "Compare prices"
        }
    ],
    savedResources: []
};

function updateState(key, value) {
    appState[key] = value;
    saveToLocalStorage();
    renderApp();
}

function renderApp() {
    updateDreamDisplay();
    updateTasks();
    updateAchievements();
    updateResources();
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('dreamAppState', JSON.stringify(appState));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const savedState = localStorage.getItem('dreamAppState');
        if (savedState) {
            Object.assign(appState, JSON.parse(savedState));
            if (appState.user) {
                showDashboard();
            } else {
                showLandingPage();
            }
        } else {
            showLandingPage();
            updateHeaderButton(); // Ensure button is "Login"
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        showLandingPage();
    }
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');
        } else {
            input.classList.remove('border-red-500');
        }
    });

    return isValid;
}

function router(route) {
    console.log("Routing to:", route);
    const routes = {
        'landing': showLandingPage,
        'dreamCreation': showDreamCreation,
        'dashboard': showDashboard,
        'resources': showResources
    };
    const page = routes[route];
    if (page) {
        page();
        window.history.pushState({}, '', `#${route}`);
    } else {
        console.error("Unknown route:", route);
        router('landing');
    }
}

function showLandingPage() {
    document.getElementById('landingPage').classList.remove('hidden');
    document.getElementById('dreamCreationPage').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    updateHeaderButton();
}

function showDreamCreation() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('dreamCreationPage').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('dreamCreationPage').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    initializeDashboard();
    switchDashboardTab('main');
    updateHeaderButton();
}

function showResources() {
    switchDashboardTab('resources');
}

function switchDashboardTab(tab) {
    console.log("Switching to tab:", tab);
    const mainDashboard = document.getElementById('mainDashboard');
    const resourcesTab = document.getElementById('resourcesTab');

    [mainDashboard, resourcesTab].forEach(el => el.classList.add('hidden'));

    if (tab === 'main') {
        console.log("Showing main dashboard");
        mainDashboard.classList.remove('hidden');
        updateDreamDisplay();
        updateTasks();
        updateAchievements();
    } else if (tab === 'resources') {
        console.log("Showing resources tab");
        resourcesTab.classList.remove('hidden');
        renderResources('all');
    }

    const tabButtons = document.querySelectorAll('#dashboardTabs .tab');
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === tab.toLowerCase());
    });

    console.log("Tab switch complete");
}

// Add this function to handle resource actions
function performAction(action) {
    console.log(`Performing action: ${action}`);
    // Implement the action logic here
    showToast(`Action performed: ${action}`);
}

function initializeDashboard() {
    console.log("Initializing dashboard");
    console.log("Current app state:", appState);
    updateDreamDisplay();
    updateTasks();
    updateAchievements();

    // Only update resources if the resources tab is active
    if (document.getElementById('resourcesTab').classList.contains('active')) {
        renderResources('all');
    }

    console.log("Dashboard initialization complete");
}

function updateDreamDisplay() {
    document.getElementById('userDreamGoal').textContent = `${appState.user ? appState.user.fullName + "'s" : "Your"} Dream Goal`;
    document.getElementById('dreamGoal').textContent = appState.currentDream;
    updateZodiacInsight();
}

function updateResources() {
    renderResources('all');
}

function updateZodiacInsight() {
    const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const randomZodiac = zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];
    document.getElementById('zodiacInsight').textContent = `Zodiac Insight: ${randomZodiac} - Your innovative spirit aligns perfectly with your dream. Keep pushing boundaries!`;
}

function updateTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    appState.tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'flex items-center';
        li.innerHTML = `
            <input type="checkbox" class="mr-3 h-5 w-5 text-blue-600" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})" />
            <div>
                <span class="font-semibold">${task.text}</span>
                <span class="text-sm text-gray-600 ml-2">${task.date} (${getDaysLeft(task.date)} days left)</span>
            </div>
        `;
        taskList.appendChild(li);
    });
    updateProgress();
}

function toggleTask(index) {
    appState.tasks[index].completed = !appState.tasks[index].completed;
    updateState('tasks', appState.tasks);
}

function updateProgress() {
    const completedTasks = appState.tasks.filter(t => t.completed).length;
    const totalTasks = appState.tasks.length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;
    document.getElementById('progressBar').style.width = `${progressPercentage}%`;
}

function getDaysLeft(dateString) {
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    const timeDiff = targetDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function addTask() {
    const newTaskInput = document.getElementById('newTask');
    const task = newTaskInput.value.trim();
    if (task) {
        const newTask = {
            text: task,
            date: new Date().toISOString().split('T')[0],
            completed: false
        };
        appState.tasks.push(newTask);
        updateState('tasks', appState.tasks);
        newTaskInput.value = '';
        showToast('New task added!');
    }
}

function updateAchievements() {
    const achievementsList = document.getElementById('recentAchievementsList');
    achievementsList.innerHTML = '';
    appState.achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.className = 'flex items-center clickable';
        li.innerHTML = `
            <span class="text-3xl mr-4">${achievement.icon}</span>
            <div>
                <h3 class="font-semibold">${achievement.text}</h3>
                <p class="text-sm text-gray-600">${achievement.description}</p>
            </div>
        `;
        achievementsList.appendChild(li);
    });
}

function addAchievement() {
    const newAchievementInput = document.getElementById('newAchievement');
    const achievement = newAchievementInput.value.trim();
    if (achievement) {
        const newAchievement = {
            text: achievement,
            description: 'New achievement unlocked!',
            icon: '🏆'
        };
        appState.achievements.unshift(newAchievement);
        updateState('achievements', appState.achievements);
        newAchievementInput.value = '';
        showToast('New achievement added!');
    }
}

function renderResources(category = 'all') {
    const resourceList = document.getElementById('resourceList');
    resourceList.innerHTML = '';

    // Update active tab
    const tabs = document.querySelectorAll('#resourceTabs .tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase() === category) {
            tab.classList.add('active');
        }
    });

    let filteredResources = appState.resources;

    if (category !== 'all') {
        filteredResources = filteredResources.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }

    filteredResources.forEach(resource => {
        const resourceCard = document.createElement('div');
        resourceCard.className = 'card mb-4';
        resourceCard.innerHTML = `
            <div class="flex items-start mb-2">
                <div class="resource-icon">${resource.icon}</div>
                <div>
                    <h3 class="font-semibold text-lg">${resource.title}</h3>
                    <p class="text-sm text-gray-600">${resource.type}</p>
                </div>
            </div>
            <p class="mb-2">${resource.description}</p>
            <div class="mb-2">
                ${resource.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
        resourceList.appendChild(resourceCard);
    });
}

function toggleCollapsible(element) {
    const content = element.nextElementSibling;
    const arrow = element.querySelector('span');
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        arrow.textContent = '▼';
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        arrow.textContent = '▲';
    }
}

function handleDreamInput() {
    const dreamInput = document.getElementById('dreamInput').value.trim();
    if (dreamInput) {
        appState.currentDream = dreamInput;
        router('dreamCreation');
    } else {
        showToast('Please enter your dream goal', 'error');
    }
}

function handleDreamCreation(event) {
    event.preventDefault();
    if (validateForm('dreamCreationForm')) {
        appState.user = {
            fullName: document.getElementById('fullName').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            recentAchievements: document.getElementById('recentAchievements').value,
            email: document.getElementById('email').value
        };
        updateState('user', appState.user);
        router('dashboard');
    }
}

function editDream() {
    const newDream = prompt("Edit your dream:", appState.currentDream);
    if (newDream) {
        updateState('currentDream', newDream);
        showToast('Dream updated successfully!');
    }
}

function shareDreamWithQRCode() {
    const qrCodeModal = document.getElementById('qrCodeModal');
    const qrCodeContainer = document.getElementById('qrCodeContainer');

    // Clear previous QR code if any
    qrCodeContainer.innerHTML = '';

    // Add a close button to the QR code modal
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.className = 'close self-end'; // 'self-end' for flex alignment
    closeButton.onclick = function() {
        qrCodeModal.style.display = 'none';
    };
    qrCodeContainer.appendChild(closeButton);

    // Add a title
    const title = document.createElement('h3');
    title.textContent = "Share Your Dream!";
    title.className = "text-xl font-semibold mb-4";
    qrCodeContainer.appendChild(title);

    // Generate QR Code
    new QRCode(qrCodeContainer, {
        text: `My Dream: ${appState.currentDream}`,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    qrCodeModal.style.display = 'block';
    showToast('QR Code generated for your dream!');
}

function printBooklet() {
    showToast('Redirecting you to the RitualShare Lab ZINE page...');
    window.open('https://www.ritualshare.com/zine', '_blank');
}

function playMyStory() {
    showToast('Starting your dream story playback...');
    window.speechPlayer.setText(appState.currentDream);
    showToast(appState.currentDream);
    // Implement more story pre-playback logic here
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `fixed bottom-4 right-4 p-2 rounded ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Here you would typically validate the credentials
    // For this example, we'll just set a user and close the modal
    appState.user = { fullName: username };
    updateState('user', appState.user);
    closeLoginModal();
    router('dashboard');
    updateHeaderButton(); // Update button to "Logout"
}

function handleLogout() {
    appState.user = null;
    updateState('user', null); // Persist the null user state
    router('landing');
    updateHeaderButton(); // Update button to "Login"
    showToast('You have been logged out.');
}

function updateHeaderButton() {
    const authButton = document.getElementById('headerAuthButton');
    if (appState.user) {
        authButton.textContent = 'Logout';
        authButton.onclick = handleLogout;
    } else {
        authButton.textContent = 'Login';
        authButton.onclick = showLoginModal;
    }
}

// Close the modal when clicking on <span> (x)
// Assuming the first .close is for the loginModal
document.querySelector('#loginModal .close').onclick = closeLoginModal;

document.querySelector('#resourceModal .close').onclick = function() {
    document.getElementById('resourceModal').style.display = 'none';
};

// Close the modal when clicking outside of it
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const qrCodeModal = document.getElementById('qrCodeModal');
    const resourceModal = document.getElementById('resourceModal');

    if (event.target == loginModal) {
        closeLoginModal();
    }
    if (event.target == qrCodeModal) {
        qrCodeModal.style.display = 'none';
    }
    if (event.target == resourceModal) {
        resourceModal.style.display = 'none';
    }
}

// Initialize the app
loadFromLocalStorage();
updateZodiacInsight();
updateHeaderButton(); // Initial call to set the button state correctly
