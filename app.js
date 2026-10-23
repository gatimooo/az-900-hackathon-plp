function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('animate-fade-in-up');
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-sky-500', 'text-white', 'shadow-md', 'shadow-sky-500/20');
        btn.classList.add('text-slate-700', 'dark:text-zinc-400', 'hover:bg-sky-100/60', 'dark:hover:bg-zinc-800', 'hover:text-sky-900', 'dark:hover:text-zinc-200');
    });

    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) {
        activeTab.classList.remove('hidden');
        void activeTab.offsetWidth;
        activeTab.classList.add('animate-fade-in-up');
    }

    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-700', 'dark:text-zinc-400', 'hover:bg-sky-100/60', 'dark:hover:bg-zinc-800', 'hover:text-sky-900', 'dark:hover:text-zinc-200');
        activeBtn.classList.add('bg-sky-500', 'text-white', 'shadow-md', 'shadow-sky-500/20');
    }

    // Auto-close mobile drawer when switching tabs
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('mobile-backdrop');
    if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.add('-translate-x-full');
        if (backdrop) backdrop.classList.add('hidden');
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('mobile-backdrop');
    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
    }
    if (backdrop) {
        backdrop.classList.toggle('hidden');
    }
}

// Light / Dark Mode Toggle
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        if (themeIcon) themeIcon.className = "fa-solid fa-moon";
        localStorage.setItem('azurevibe_theme', 'light');
    } else {
        html.classList.remove('light');
        html.classList.add('dark');
        if (themeIcon) themeIcon.className = "fa-solid fa-sun";
        localStorage.setItem('azurevibe_theme', 'dark');
    }
}

if (localStorage.getItem('azurevibe_theme') === 'dark') {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.className = "fa-solid fa-sun";
} else {
    document.documentElement.classList.add('light');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.className = "fa-solid fa-moon";
}

// Persistent Storage
let masteredCards = JSON.parse(localStorage.getItem('azurevibe_mastered_cards')) || [];
let quizHistory = JSON.parse(localStorage.getItem('azurevibe_quiz_history')) || [];
let studyProgress = JSON.parse(localStorage.getItem('azurevibe_study_progress')) || { activeModule: 0, lessons: { 0: 0, 1: 0, 2: 0 } };
let studyPlans = JSON.parse(localStorage.getItem('azurevibe_study_plans')) || [];
let activeQuizModuleTitle = "All Modules";

function updateDashboardStats() {
    const totalCards = allFlashcards.length;
    const masteredCount = masteredCards.length;
    const statCards = document.getElementById('stat-flashcards');
    if (statCards) statCards.innerText = `${masteredCount} / ${totalCards}`;

    let avgScore = 0;
    if (quizHistory.length > 0) {
        const totalSum = quizHistory.reduce((acc, curr) => acc + curr.percentage, 0);
        avgScore = Math.round(totalSum / quizHistory.length);
    }
    const statQuiz = document.getElementById('stat-quiz-score');
    if (statQuiz) statQuiz.innerText = `${avgScore}%`;

    const statPlanner = document.getElementById('stat-planner-count');
    if (statPlanner) statPlanner.innerText = studyPlans.length;

    renderQuizHistoryLog();
}

function renderQuizHistoryLog() {
    let historyContainer = document.getElementById('quiz-history-container');
    if (!historyContainer) {
        const dashboardTab = document.getElementById('tab-dashboard');
        if (dashboardTab) {
            const historyDiv = document.createElement('div');
            historyDiv.className = "bg-sky-50/60 dark:bg-[#121215] border border-sky-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm mt-6";
            historyDiv.innerHTML = `
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-lg text-slate-950 dark:text-zinc-100">Recent Quiz Attempts</h3>
                    <button onclick="resetAllProgress()" class="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                        <i class="fa-solid fa-trash-can mr-1"></i><span>Clear History</span>
                    </button>
                </div>
                <div id="quiz-history-container" class="space-y-3 max-h-60 overflow-y-auto"></div>
            `;
            dashboardTab.appendChild(historyDiv);
            historyContainer = document.getElementById('quiz-history-container');
        }
    }

    if (historyContainer) {
        if (quizHistory.length === 0) {
            historyContainer.innerHTML = `<p class="text-xs text-slate-500 dark:text-zinc-500 italic">No quiz attempts recorded yet. Take a quiz to track your progress!</p>`;
        } else {
            historyContainer.innerHTML = quizHistory.slice(-5).reverse().map(attempt => `
                <div class="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-sky-100 dark:border-zinc-700 text-xs">
                    <div>
                        <span class="font-bold text-sky-700 dark:text-sky-400">${attempt.module}</span>
                        <p class="text-slate-500 dark:text-zinc-400 text-[10px] mt-0.5">${attempt.date}</p>
                    </div>
                    <div class="text-right">
                        <span class="font-extrabold text-sm ${attempt.percentage >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}">${attempt.score}/${attempt.total} (${attempt.percentage}%)</span>
                    </div>
                </div>
            `).join('');
        }
    }
}

function resetAllProgress() {
    if (confirm("Are you sure you want to clear all your flashcard mastery, quiz history, and study progress?")) {
        localStorage.clear();
        masteredCards = [];
        quizHistory = [];
        studyProgress = { activeModule: 0, lessons: { 0: 0, 1: 0, 2: 0 } };
        studyPlans = [];
        updateDashboardStats();
        updateFlashcardUI();
        loadStudyModuleUI();
        renderStudyPlanner();
        alert("Progress cleared successfully!");
    }
}

// ---------------------------------------------------------------------------
// STUDY BUDDY MODULES DATA & LOGIC
// ---------------------------------------------------------------------------
const studyModulesData = [
    {
        title: "Cloud Concepts",
        lessons: [
            {
                title: "Introduction to Cloud Computing",
                content: "Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet ('the cloud'). Instead of owning physical data centers, companies rent access to anything from applications to storage from cloud service providers like Microsoft Azure."
            },
            {
                title: "CapEx vs OpEx",
                content: "• <strong>Capital Expenditure (CapEx):</strong> Upfront spending on physical infrastructure (servers, buildings) that depreciates over time.<br>• <strong>Operational Expenditure (OpEx):</strong> Consumption-based model where you pay as you go for services used. Azure operates on OpEx, eliminating upfront capital risk."
            },
            {
                title: "Cloud Service Models (IaaS, PaaS, SaaS)",
                content: "• <strong>IaaS (Infrastructure as a Service):</strong> Rent raw virtual machines, storage, and networking (Maximum user control).<br>• <strong>PaaS (Platform as a Service):</strong> Managed platform for developers to build apps without managing underlying hardware.<br>• <strong>SaaS (Software as a Service):</strong> Fully delivered software applications like Microsoft 365."
            },
            {
                title: "Cloud Deployment Models",
                content: "• <strong>Public Cloud:</strong> Owned by a third-party provider, shared across multiple tenants over the public internet.<br>• <strong>Private Cloud:</strong> Used exclusively by a single business or organization.<br>• <strong>Hybrid Cloud:</strong> Combines public and private clouds to share data and apps."
            },
            {
                title: "High Availability & Scalability",
                content: "• <strong>High Availability (HA):</strong> Ensures continuous service operation with minimal downtime.<br>• <strong>Scalability:</strong> Adjusting resources to meet demand (Vertical scaling = adding power to existing VM; Horizontal scaling = adding more VMs)."
            }
        ]
    },
    {
        title: "Azure Architecture & Services",
        lessons: [
            {
                title: "Regions and Availability Zones",
                content: "• <strong>Azure Region:</strong> A set of data centers deployed within a latency-defined perimeter connected via a dedicated regional network.<br>• <strong>Availability Zones:</strong> Physically separate data centers within a region with independent power, cooling, and networking to protect against datacenter failures."
            },
            {
                title: "Resource Groups and ARM",
                content: "• <strong>Resource Groups:</strong> Logical containers that hold related resources for an Azure solution.<br>• <strong>Azure Resource Manager (ARM):</strong> The deployment and management service that provides a consistent management layer for templates and API calls."
            },
            {
                title: "Compute Services (VMs, App Service, Functions)",
                content: "• <strong>Virtual Machines:</strong> Fully customizable IaaS compute environments.<br>• <strong>App Service:</strong> Fully managed PaaS platform for hosting web apps and REST APIs.<br>• <strong>Azure Functions:</strong> Event-driven serverless computing where you pay strictly for execution duration."
            },
            {
                title: "Storage Accounts & Blob Storage",
                content: "Azure Storage provides massively scalable storage. <strong>Blob Storage</strong> is Microsoft's object storage solution optimized for storing massive amounts of unstructured data such as text, images, videos, and backups."
            },
            {
                title: "Virtual Networks & Connectivity",
                content: "• <strong>Virtual Network (VNet):</strong> Enables Azure resources to securely communicate with each other, the internet, and on-premises networks.<br>• <strong>ExpressRoute:</strong> Dedicated private high-speed connection bypassing the public internet."
            }
        ]
    },
    {
        title: "Management & Governance",
        lessons: [
            {
                title: "Microsoft Entra ID (Azure AD)",
                content: "Microsoft Entra ID is a cloud-based identity and access management service that provides Single Sign-On (SSO), Multi-Factor Authentication (MFA), and conditional access security."
            },
            {
                title: "Role-Based Access Control (RBAC)",
                content: "RBAC provides fine-grained access management in Azure, ensuring users are granted only the precise permissions required to perform their jobs (Principle of Least Privilege)."
            },
            {
                title: "Azure Policy & Governance",
                content: "Azure Policy creates, assigns, and manages policies that enforce rules and compliance across your Azure resources, preventing non-compliant resource deployments."
            },
            {
                title: "Cost Management & Azure Advisor",
                content: "• <strong>Cost Management:</strong> Monitor cloud spending, set budgets, and analyze cost forecasts.<br>• <strong>Azure Advisor:</strong> Personalized cloud consultant that analyzes resource configurations and recommends best practices for security, high availability, and cost optimization."
            },
            {
                title: "Monitoring & Service Health",
                content: "• <strong>Azure Monitor:</strong> Collects and analyzes telemetry data from cloud and on-premises environments.<br>• <strong>Service Health:</strong> Provides a personalized dashboard regarding Azure outages, planned maintenance, and advisories."
            }
        ]
    }
];

function selectStudyModule(modIndex) {
    studyProgress.activeModule = modIndex;
    localStorage.setItem('azurevibe_study_progress', JSON.stringify(studyProgress));
    loadStudyModuleUI();
}

function loadStudyModuleUI() {
    const modIndex = studyProgress.activeModule;
    const currentModule = studyModulesData[modIndex];
    const lessonIndex = studyProgress.lessons[modIndex] || 0;

    for (let i = 0; i < 3; i++) {
        const btn = document.getElementById(`mod-btn-${i}`);
        if (btn) {
            const completedCount = studyProgress.lessons[i] || 0;
            const progText = document.getElementById(`mod-prog-${i}`);
            if (progText) progText.innerText = `Completed: ${completedCount} / 5`;

            if (i === modIndex) {
                btn.className = "p-4 sm:p-5 rounded-3xl border text-left transition-all bg-sky-600 text-white shadow-md";
            } else {
                btn.className = "p-4 sm:p-5 rounded-3xl border text-left transition-all bg-sky-50 dark:bg-[#121215] border-sky-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 hover:bg-sky-100";
            }
        }
    }

    const lesson = currentModule.lessons[lessonIndex] || currentModule.lessons[currentModule.lessons.length - 1];
    const tagEl = document.getElementById('lesson-module-tag');
    const titleEl = document.getElementById('lesson-title');
    const contentEl = document.getElementById('lesson-content');
    const counterEl = document.getElementById('lesson-counter');

    if (tagEl) tagEl.innerText = `Module ${modIndex + 1}: ${currentModule.title}`;
    if (titleEl) titleEl.innerText = lesson.title;
    if (contentEl) contentEl.innerHTML = lesson.content;
    if (counterEl) counterEl.innerText = `Lesson ${lessonIndex + 1} of ${currentModule.lessons.length}`;

    let totalCompleted = Object.values(studyProgress.lessons).reduce((a, b) => a + b, 0);
    const overallProg = Math.round((totalCompleted / 15) * 100);
    const overallBadge = document.getElementById('module-overall-progress');
    if (overallBadge) overallBadge.innerText = `Progress: ${overallProg}%`;
}

function completeAndNextLesson() {
    const modIndex = studyProgress.activeModule;
    const currentModule = studyModulesData[modIndex];
    let lessonIndex = studyProgress.lessons[modIndex] || 0;

    if (lessonIndex < currentModule.lessons.length - 1) {
        studyProgress.lessons[modIndex] = lessonIndex + 1;
    } else {
        alert(`Congratulations! You have completed all lessons in ${currentModule.title}.`);
    }
    localStorage.setItem('azurevibe_study_progress', JSON.stringify(studyProgress));
    loadStudyModuleUI();
}

function prevLesson() {
    const modIndex = studyProgress.activeModule;
    let lessonIndex = studyProgress.lessons[modIndex] || 0;

    if (lessonIndex > 0) {
        studyProgress.lessons[modIndex] = lessonIndex - 1;
        localStorage.setItem('azurevibe_study_progress', JSON.stringify(studyProgress));
        loadStudyModuleUI();
    }
}

// ---------------------------------------------------------------------------
// STUDY PLANNER LOGIC
// ---------------------------------------------------------------------------
function addStudyPlan() {
    const topic = document.getElementById('plan-topic').value.trim();
    const date = document.getElementById('plan-date').value;
    const time = document.getElementById('plan-time').value;

    if (!topic || !date || !time) {
        alert("Please fill in all fields to schedule a study session.");
        return;
    }

    studyPlans.push({ id: Date.now(), topic, date, time });
    localStorage.setItem('azurevibe_study_plans', JSON.stringify(studyPlans));

    document.getElementById('plan-topic').value = '';
    document.getElementById('plan-date').value = '';
    document.getElementById('plan-time').value = '';

    renderStudyPlanner();
    updateDashboardStats();
}

function deleteStudyPlan(id) {
    studyPlans = studyPlans.filter(p => p.id !== id);
    localStorage.setItem('azurevibe_study_plans', JSON.stringify(studyPlans));
    renderStudyPlanner();
    updateDashboardStats();
}

function renderStudyPlanner() {
    const container = document.getElementById('planner-list-container');
    if (!container) return;

    if (studyPlans.length === 0) {
        container.innerHTML = `<p class="text-xs text-slate-500 dark:text-zinc-500 italic">No study sessions scheduled yet. Add one on the left!</p>`;
    } else {
        container.innerHTML = studyPlans.map(plan => `
            <div class="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-zinc-800 border border-sky-100 dark:border-zinc-700 text-xs shadow-sm">
                <div>
                    <span class="font-bold text-slate-950 dark:text-zinc-100 text-sm">${plan.topic}</span>
                    <p class="text-sky-600 dark:text-sky-400 font-semibold mt-0.5"><i class="fa-regular fa-calendar mr-1"></i>${plan.date} at ${plan.time}</p>
                </div>
                <button onclick="deleteStudyPlan(${plan.id})" class="text-rose-500 hover:text-rose-700 p-2"><i class="fa-solid fa-trash"></i></button>
            </div>
        `).join('');
    }
}

// Flashcards & Quizzes logic
const allFlashcards = [
    { category: "Cloud Concepts", term: "CapEx vs OpEx", definition: "CapEx is upfront physical expenditure on data centers. OpEx is a consumption-based pricing model where you pay only for what you use." },
    { category: "Cloud Concepts", term: "High Availability", definition: "Ensures services are running continuously for a desired time with minimal downtime, often backed by SLAs." },
    { category: "Cloud Concepts", term: "Scalability", definition: "The ability to adjust resources to meet demand, scaling up/down (vertical) or out/in (horizontal)." },
    { category: "Cloud Concepts", term: "Elasticity", definition: "Automatically or dynamically increasing or decreasing resources based on workload fluctuations." },
    { category: "Cloud Concepts", term: "Fault Tolerance", definition: "The ability of a system to remain operational even if one or more components fail." },
    { category: "Cloud Concepts", term: "Disaster Recovery", definition: "The ability to restore IT infrastructure and data after a catastrophic event using paired regions or backups." },
    { category: "Cloud Concepts", term: "Public Cloud", definition: "Cloud resources owned and operated by a third-party provider, delivering services over the public internet." },
    { category: "Cloud Concepts", term: "Private Cloud", definition: "Cloud infrastructure used exclusively by a single business, hosted on-premises or privately managed." },
    { category: "Cloud Concepts", term: "Hybrid Cloud", definition: "Combines public and private clouds, allowing data and applications to be shared between them." },
    { category: "Cloud Concepts", term: "Multi-Cloud", definition: "Using cloud services from multiple public cloud providers (e.g., Azure and AWS) simultaneously." },
    { category: "Cloud Concepts", term: "Economies of Scale", definition: "The ability to lower costs by purchasing in massive volumes and sharing infrastructure across global customers." },
    { category: "Cloud Concepts", term: "Agility", definition: "The speed and ease with which businesses can develop, test, and launch new software applications." },
    { category: "Cloud Concepts", term: "Consumption-Based Model", definition: "Pricing model where you pay strictly for the resources you use rather than fixed infrastructure upkeep." },
    { category: "Cloud Concepts", term: "Reliability", definition: "The ability of a system to recover from failures and continue functioning correctly under stress." },
    { category: "Cloud Concepts", term: "Capital Expenditure (CapEx)", definition: "Upfront capital investment in physical hardware that depreciates over time on financial balance sheets." },

    { category: "Azure Architecture & Services", term: "Azure Region", definition: "A set of data centers deployed within a latency-defined perimeter connected via a dedicated regional network." },
    { category: "Azure Architecture & Services", term: "Availability Zone", definition: "Physically separate data centers within an Azure region equipped with independent power, cooling, and networking." },
    { category: "Azure Architecture & Services", term: "Region Pair", definition: "Two Azure regions paired within the same geography (at least 300 miles apart) for disaster recovery and isolated updates." },
    { category: "Azure Architecture & Services", term: "Resource Group", definition: "A logical container in Azure where related resources (VMs, databases, web apps) are managed together." },
    { category: "Azure Architecture & Services", term: "Azure Resource Manager (ARM)", definition: "The deployment and management service for Azure, providing a consistent management layer for templates and API calls." },
    { category: "Azure Architecture & Services", term: "Virtual Machines (VMs)", definition: "IaaS offering providing virtualized computing environments with customizable operating systems." },
    { category: "Azure Architecture & Services", term: "Azure App Service", definition: "Fully managed PaaS platform for building, deploying, and scaling web apps and APIs." },
    { category: "Azure Architecture & Services", term: "Azure Functions", definition: "Serverless compute service that lets you run small pieces of code without managing underlying infrastructure." },
    { category: "Azure Architecture & Services", term: "Virtual Network (VNet)", definition: "Fundamental building block for your private network in Azure, enabling secure communication between VMs and services." },
    { category: "Azure Architecture & Services", term: "ExpressRoute", definition: "Private, high-speed dedicated connection between your on-premises infrastructure and Azure data centers." },
    { category: "Azure Architecture & Services", term: "Azure Blob Storage", definition: "Massively scalable object storage solution for unstructured data like text, audio, images, and backups." },
    { category: "Azure Architecture & Services", term: "Azure Cosmos DB", definition: "Globally distributed, multi-model NoSQL database service designed for ultra-low latency apps." },
    { category: "Azure Architecture & Services", term: "Azure SQL Database", definition: "Fully managed relational database service built on Microsoft SQL Server engine." },
    { category: "Azure Architecture & Services", term: "Azure Kubernetes Service (AKS)", definition: "Managed container orchestration service simplifying deployment and scaling of containerized apps." },
    { category: "Azure Architecture & Services", term: "Content Delivery Network (CDN)", definition: "Distributed network of servers that caches static web content close to users for faster delivery." },

    { category: "Azure Management & Governance", term: "Microsoft Entra ID", definition: "Cloud-based identity and access management service (formerly Azure AD) providing SSO and MFA." },
    { category: "Azure Management & Governance", term: "Role-Based Access Control (RBAC)", definition: "Fine-grained access management control granting precise permissions based on user roles." },
    { category: "Azure Management & Governance", term: "Azure Policy", definition: "Service used to create, assign, and manage policies that enforce rules and compliance across your Azure resources." },
    { category: "Azure Management & Governance", term: "Azure Blueprints", definition: "Declarative packages that bundle role assignments, policies, templates, and resource groups into repeatable setups." },
    { category: "Azure Management & Governance", term: "Azure Advisor", definition: "Personalized cloud consultant that analyzes your configurations and gives recommendations for high availability and cost." },
    { category: "Azure Management & Governance", term: "Azure Cost Management", definition: "Tool suite to monitor cloud spending, set budgets, and optimize resource costs across subscriptions." },
    { category: "Azure Management & Governance", term: "Azure Service Health", definition: "Personalized dashboard providing information about Azure outages, planned maintenance, and service advisories." },
    { category: "Azure Management & Governance", term: "Azure Monitor", definition: "Comprehensive solution for collecting, analyzing, and acting on telemetry from cloud and on-premises environments." },
    { category: "Azure Management & Governance", term: "Log Analytics Workspace", definition: "Unique environment for storing and querying log data collected by Azure Monitor." },
    { category: "Azure Management & Governance", term: "Multi-Factor Authentication (MFA)", definition: "Security process requiring two or more verification methods to gain access to accounts or systems." },
    { category: "Azure Management & Governance", term: "Zero Trust Security Model", definition: "Security framework based on the principle of 'verify explicitly, use least privilege access, and assume breach'." },
    { category: "Azure Management & Governance", term: "Microsoft Purview", definition: "Unified data governance service to map, secure, and manage your organization's data estate." },
    { category: "Azure Management & Governance", term: "Cloud Adoption Framework", definition: "Guidance, best practices, and tools from Microsoft to help organizations plan cloud adoption strategies." },
    { category: "Azure Management & Governance", term: "Well-Architected Framework", definition: "Set of core tenets (Cost, Security, Reliability, Performance, Operations) for building robust cloud architectures." },
    { category: "Azure Management & Governance", term: "Management Groups", definition: "Hierarchical containers above subscriptions that allow centralized governance and policy enforcement." }
];

let activeFlashcards = [...allFlashcards];
let currentCardIndex = 0;
let isFlipped = false;

function filterFlashcards(moduleName) {
    document.querySelectorAll('[id^="fc-filter-"]').forEach(btn => {
        btn.className = "px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-sky-50 dark:bg-[#121215] text-slate-800 dark:text-zinc-400 border border-sky-200 dark:border-zinc-800 hover:bg-sky-100 transform hover:scale-105 duration-200";
    });
    
    if (moduleName === 'all') {
        const btn = document.getElementById('fc-filter-all');
        if (btn) btn.className = "px-4 py-2 rounded-xl text-xs font-bold transition-all bg-sky-600 text-white shadow-md shadow-sky-500/20 transform hover:scale-105 duration-200";
        activeFlashcards = [...allFlashcards];
    } else if (moduleName === 'Cloud Concepts') {
        const btn = document.getElementById('fc-filter-cc');
        if (btn) btn.className = "px-4 py-2 rounded-xl text-xs font-bold transition-all bg-sky-600 text-white shadow-md shadow-sky-500/20 transform hover:scale-105 duration-200";
        activeFlashcards = allFlashcards.filter(f => f.category === 'Cloud Concepts');
    } else if (moduleName === 'Azure Architecture & Services') {
        const btn = document.getElementById('fc-filter-aas');
        if (btn) btn.className = "px-4 py-2 rounded-xl text-xs font-bold transition-all bg-sky-600 text-white shadow-md shadow-sky-500/20 transform hover:scale-105 duration-200";
        activeFlashcards = allFlashcards.filter(f => f.category === 'Azure Architecture & Services');
    } else if (moduleName === 'Azure Management & Governance') {
        const btn = document.getElementById('fc-filter-amg');
        if (btn) btn.className = "px-4 py-2 rounded-xl text-xs font-bold transition-all bg-sky-600 text-white shadow-md shadow-sky-500/20 transform hover:scale-105 duration-200";
        activeFlashcards = allFlashcards.filter(f => f.category === 'Azure Management & Governance');
    }
    
    currentCardIndex = 0;
    updateFlashcardUI();
}

function updateFlashcardUI() {
    if (activeFlashcards.length === 0) return;
    const card = activeFlashcards[currentCardIndex];
    const catEl = document.getElementById('fc-category');
    const termEl = document.getElementById('fc-term');
    const defEl = document.getElementById('fc-definition');
    const counterEl = document.getElementById('card-counter');

    if (catEl) catEl.innerText = card.category;
    if (termEl) termEl.innerText = card.term;
    if (defEl) defEl.innerText = card.definition;
    if (counterEl) counterEl.innerText = `Card ${currentCardIndex + 1} of ${activeFlashcards.length}`;
    
    if (isFlipped) {
        const inner = document.getElementById('flashcard-inner');
        if (inner) inner.classList.remove('flipped');
        isFlipped = false;
    }
}

function flipCard() {
    const inner = document.getElementById('flashcard-inner');
    if (inner) {
        inner.classList.toggle('flipped');
        isFlipped = !isFlipped;
    }
}

function nextCard() {
    currentCardIndex = (currentCardIndex + 1) % activeFlashcards.length;
    updateFlashcardUI();
}

function prevCard() {
    currentCardIndex = (currentCardIndex - 1 + activeFlashcards.length) % activeFlashcards.length;
    updateFlashcardUI();
}

function markMastered() {
    const currentTerm = activeFlashcards[currentCardIndex].term;
    if (!masteredCards.includes(currentTerm)) {
        masteredCards.push(currentTerm);
        localStorage.setItem('azurevibe_mastered_cards', JSON.stringify(masteredCards));
        updateDashboardStats();
    }
    nextCard();
}

function resetFlashcards() {
    activeFlashcards = [...allFlashcards];
    document.querySelectorAll('[id^="fc-filter-"]').forEach(btn => {
        btn.className = "px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-sky-50 dark:bg-[#121215] text-slate-800 dark:text-zinc-400 border border-sky-200 dark:border-zinc-800 hover:bg-sky-100 transform hover:scale-105 duration-200";
    });
    const allBtn = document.getElementById('fc-filter-all');
    if (allBtn) {
        allBtn.className = "px-4 py-2 rounded-xl text-xs font-bold transition-all bg-sky-600 text-white shadow-md shadow-sky-500/20 transform hover:scale-105 duration-200";
    }

    currentCardIndex = 0;
    isFlipped = false;
    const inner = document.getElementById('flashcard-inner');
    if (inner) inner.classList.remove('flipped');
    
    updateFlashcardUI();
}

// Quiz Questions & Timer
const allQuizQuestions = [
    {
        category: "Cloud Concepts",
        question: "Which cloud model provides complete physical and logical isolation, ideal for organizations with strict security requirements?",
        options: ["Public Cloud", "Private Cloud", "Hybrid Cloud", "Multi-Cloud"],
        answer: 1,
        explanation: "A private cloud is used exclusively by a single business, offering maximum hardware security and isolation."
    },
    {
        category: "Cloud Concepts",
        question: "Which of the following best defines Capital Expenditure (CapEx)?",
        options: ["Monthly recurring cloud subscriptions", "Upfront investment in physical hardware and data centers", "Pay-as-you-go software licensing", "Consuming compute power on demand"],
        answer: 1,
        explanation: "CapEx refers to upfront spending on physical infrastructure that depreciates over time."
    },
    {
        category: "Cloud Concepts",
        question: "What is the primary benefit of the cloud's consumption-based pricing model?",
        options: ["Eliminating all internet connection fees", "Paying only for the resources you use with no upfront infrastructure costs", "Guaranteed 100% zero downtime", "Free hardware replacements"],
        answer: 1,
        explanation: "Consumption-based pricing means no upfront costs and paying strictly for active utilization."
    },
    {
        category: "Cloud Concepts",
        question: "Which cloud characteristic allows applications to automatically handle sudden surges in user traffic?",
        options: ["High Latency", "Elasticity & Scalability", "Static Provisioning", "Manual Scaling"],
        answer: 1,
        explanation: "Elasticity and scalability allow cloud systems to dynamically allocate resources to handle varying workloads."
    },
    {
        category: "Cloud Concepts",
        question: "What does 'High Availability' ensure in cloud computing?",
        options: ["Lowest possible storage cost", "Continuous service operation with minimal downtime", "Free developer support", "Unlimited virtual machine RAM"],
        answer: 1,
        explanation: "High availability ensures services run consistently and reliably for required periods."
    },
    {
        category: "Cloud Concepts",
        question: "What is the main advantage of Economies of Scale in Azure?",
        options: ["Lower costs achieved by massive infrastructure purchasing power", "Free cloud engineers provided to your company", "Unlimited free network bandwidth", "Elimination of cyber threats"],
        answer: 0,
        explanation: "Economies of scale allow providers like Microsoft to buy hardware cheaper and pass savings to customers."
    },
    {
        category: "Cloud Concepts",
        question: "Which scenario describes a Hybrid Cloud deployment?",
        options: ["Running apps solely on personal laptops", "Connecting on-premises data centers with public cloud resources", "Using AWS and Google Cloud simultaneously", "Storing data on offline hard drives"],
        answer: 1,
        explanation: "Hybrid cloud combines and bridges on-premises environments with public cloud services."
    },
    {
        category: "Cloud Concepts",
        question: "What is Fault Tolerance in cloud architecture?",
        options: ["The speed at which files download", "The ability of a system to remain operational despite component failures", "The process of deleting temporary logs", "Manual server reboots"],
        answer: 1,
        explanation: "Fault tolerance ensures zero disruption if a hardware or software component fails."
    },
    {
        category: "Cloud Concepts",
        question: "Which cloud model involves using multiple public cloud vendors at the same time?",
        options: ["Private Cloud", "Multi-Cloud", "Standalone Cloud", "Local Cloud"],
        answer: 1,
        explanation: "Multi-cloud strategy involves leveraging multiple distinct public cloud providers."
    },
    {
        category: "Cloud Concepts",
        question: "What is Disaster Recovery in the context of cloud computing?",
        options: ["Restoring system functionality and data after a major disaster or outage", "Daily antivirus scans", "Password resetting for employees", "Upgrading web browsers"],
        answer: 0,
        explanation: "Disaster recovery covers automated backups and failovers to restore business continuity."
    },
    {
        category: "Cloud Concepts",
        question: "How does Cloud Agility benefit software development teams?",
        options: ["By slowing down deployments for safety", "By allowing rapid provisioning and testing of resources in minutes", "By eliminating the need for code writing", "By forcing physical server purchases"],
        answer: 1,
        explanation: "Agility gives teams the speed to provision new computing resources instantly."
    },
    {
        category: "Cloud Concepts",
        question: "Which cloud service model places the highest management responsibility on the cloud provider?",
        options: ["IaaS", "PaaS", "SaaS", "On-Premises"],
        answer: 2,
        explanation: "In SaaS (Software as a Service), the provider manages everything including software updates, runtime, and infrastructure."
    },
    {
        category: "Cloud Concepts",
        question: "Which of these is a key characteristic of Public Cloud?",
        options: ["Shared hardware infrastructure across multiple tenants", "Exclusive ownership of physical data center rooms", "Manual hardware maintenance by the customer", "Zero internet connectivity required"],
        answer: 0,
        explanation: "Public cloud resources are shared securely across multiple tenants over the public internet."
    },
    {
        category: "Cloud Concepts",
        question: "Why is Operational Expenditure (OpEx) preferred by startups?",
        options: ["It requires massive multi-million dollar loans", "It avoids heavy upfront capital expenses and aligns costs directly with usage", "It locks you into 10-year hardware contracts", "It eliminates all software bugs"],
        answer: 1,
        explanation: "OpEx allows businesses to pay as they grow rather than sinking capital upfront."
    },
    {
        category: "Cloud Concepts",
        question: "What does Reliability mean in cloud computing?",
        options: ["That systems perform consistently and recover gracefully from failures", "That servers never require maintenance", "That storage is completely free", "That data is never encrypted"],
        answer: 0,
        explanation: "Reliability guarantees dependable execution and robust recovery mechanisms."
    },

    {
        category: "Azure Architecture & Services",
        question: "What is an Azure Region?",
        options: ["A single physical computer", "A set of data centers deployed within a latency-defined perimeter", "A billing account", "A security firewall rule"],
        answer: 1,
        explanation: "An Azure region is a collection of data centers linked by a dedicated low-latency network."
    },
    {
        category: "Azure Architecture & Services",
        question: "What makes an Availability Zone unique within an Azure Region?",
        options: ["They are located in different countries", "They are physically separate data centers with independent power, cooling, and networking", "They are only accessible at night", "They provide free unlimited storage"],
        answer: 1,
        explanation: "Availability Zones protect applications against data center failure through physical separation."
    },
    {
        category: "Azure Architecture & Services",
        question: "What is the purpose of an Azure Region Pair?",
        options: ["To double your hourly billing rate", "To provide disaster recovery protection with data replication across a distance", "To connect two printers together", "To share passwords"],
        answer: 1,
        explanation: "Region pairs are spaced at least 300 miles apart to ensure regional disaster recovery resilience."
    },
    {
        category: "Azure Architecture & Services",
        question: "What is an Azure Resource Group?",
        options: ["A team of Microsoft support engineers", "A logical container for grouping and managing related Azure resources", "A physical server rack", "A user permission group"],
        answer: 1,
        explanation: "Resource groups organize related resources (databases, VMs, apps) into unified management units."
    },
    {
        category: "Azure Architecture & Services",
        question: "What is the role of Azure Resource Manager (ARM)?",
        options: ["Managing employee salaries", "Providing a consistent deployment and management layer for Azure resources", "Monitoring local weather", "Designing user logos"],
        answer: 1,
        explanation: "ARM processes templates and API requests to deploy and manage resources consistently."
    },
    {
        category: "Azure Architecture & Services",
        question: "Which Azure service provides fully managed Virtual Machines (IaaS)?",
        options: ["Azure Functions", "Azure Virtual Machines", "Azure App Service", "Azure SQL Database"],
        answer: 1,
        explanation: "Azure Virtual Machines provide complete IaaS virtualization control over guest operating systems."
    },
    {
        category: "Azure Architecture & Services",
        question: "What is Azure App Service used for?",
        options: ["Building and hosting web apps, mobile backends, and RESTful APIs (PaaS)", "Renting bare-metal routers", "Managing physical hard drives", "Writing desktop games"],
        answer: 0,
        explanation: "App Service is a fully managed PaaS offering designed for web applications and APIs."
    },
    {
        category: "Azure Architecture & Services",
        question: "What is the primary characteristic of Azure Functions?",
        options: ["Serverless code execution triggered by events without managing servers", "Running virtual machines 24/7", "Managing SQL database backups", "Configuring physical network switches"],
        answer: 0,
        explanation: "Azure Functions enable event-driven serverless computing where you pay only for execution time."
    },
    {
        category: "Azure Architecture & Services",
        question: "What is an Azure Virtual Network (VNet) used for?",
        options: ["Enabling secure communication between Azure resources, the internet, and on-premises networks", "Creating 3D virtual reality environments", "Hosting blog comments", "Printing documents"],
        answer: 0,
        explanation: "VNets provide foundational private network isolation and routing in Azure."
    },
    {
        category: "Azure Architecture & Services",
        question: "What is the difference between VPN Gateway and Azure ExpressRoute?",
        options: ["ExpressRoute uses encrypted public internet connections; VPN Gateway uses private fiber", "ExpressRoute provides dedicated private high-speed connections; VPN Gateway connects via encrypted internet tunnels", "They are identical services", "VPN Gateway is only for storage accounts"],
        answer: 1,
        explanation: "ExpressRoute bypasses the public internet entirely for high-speed, secure enterprise connectivity."
    },
    {
        category: "Azure Architecture & Services",
        question: "What is Azure Blob Storage optimized for?",
        options: ["Relational table queries", "Storing massive amounts of unstructured data like images, documents, and logs", "Running Windows desktop apps", "Sending enterprise emails"],
        answer: 1,
        explanation: "Blob storage is Microsoft's object storage solution designed for unstructured data workloads."
    },
    {
        category: "Azure Architecture & Services",
        question: "What is Azure Cosmos DB?",
        options: ["A global distributed multi-model NoSQL database service", "A local spreadsheet editor", "A security firewall", "A virtual machine backup tool"],
        answer: 0,
        explanation: "Cosmos DB provides high-availability globally distributed NoSQL database capabilities."
    },
    {
        category: "Azure Architecture & Services",
        question: "What is Azure SQL Database?",
        options: ["A fully managed relational database service based on Microsoft SQL Server", "An open-source Linux database", "A file compression tool", "A DNS manager"],
        answer: 0,
        explanation: "Azure SQL Database is a fully managed PaaS relational database engine."
    },
    {
        category: "Azure Architecture & Services",
        question: "What is Azure Kubernetes Service (AKS) used for?",
        options: ["Managing containerized applications using Kubernetes orchestration", "Hosting static HTML web pages", "Creating virtual desktop images", "Blocking malware"],
        answer: 0,
        explanation: "AKS simplifies deploying, scaling, and managing container clusters in Azure."
    },
    {
        category: "Azure Architecture & Services",
        question: "What is the purpose of an Azure Content Delivery Network (CDN)?",
        options: ["To cache static web assets globally close to users for reduced latency", "To encrypt credit card transactions", "To store confidential passwords", "To scan code for syntax errors"],
        answer: 0,
        explanation: "CDNs cache content on edge servers worldwide to speed up website load times."
    },

    {
        category: "Azure Management & Governance",
        question: "What is Microsoft Entra ID?",
        options: ["A cloud-based identity and access management service providing SSO and MFA", "An antivirus scanner", "A server cooling system", "A billing calculator"],
        answer: 0,
        explanation: "Microsoft Entra ID (formerly Azure AD) handles user identities, sign-ins, and multi-factor authentication."
    },
    {
        category: "Azure Management & Governance",
        question: "What does Role-Based Access Control (RBAC) allow you to do?",
        options: ["Manage fine-grained access permissions based on user roles", "Change server hardware components", "Automatically generate website graphics", "Reset Wi-Fi passwords"],
        answer: 0,
        explanation: "RBAC ensures users only have the exact permissions necessary to perform their jobs."
    },
    {
        category: "Azure Management & Governance",
        question: "What is the main purpose of Azure Policy?",
        options: ["To enforce organizational standards and assess resource compliance", "To write company blog posts", "To purchase software licenses", "To test website loading speed"],
        answer: 0,
        explanation: "Azure Policy evaluates resources and enforces rules to maintain corporate compliance."
    },
    {
        category: "Azure Management & Governance",
        question: "What are Azure Blueprints used for?",
        options: ["Creating repeatable sets of resources, templates, policies, and role assignments", "Drafting architectural floor plans", "Editing vector graphics", "Designing marketing flyers"],
        answer: 0,
        explanation: "Blueprints orchestrate the rapid deployment of compliant environment setups."
    },
    {
        category: "Azure Management & Governance",
        question: "What is Azure Advisor?",
        options: ["A personalized consultant that recommends best practices for security, cost, and performance", "A live customer support chat", "An automated code compiler", "A database migration script"],
        answer: 0,
        explanation: "Azure Advisor analyzes configurations and provides actionable recommendations."
    },
    {
        category: "Azure Management & Governance",
        question: "What can you accomplish with Azure Cost Management + Billing?",
        options: ["Monitor cloud spending, set budgets, and analyze cost forecasts", "Design custom invoices for clients", "Process employee payroll", "Calculate bank loan interest"],
        answer: 0,
        explanation: "Cost Management helps organizations track, allocate, and control cloud expenditures."
    },
    {
        category: "Azure Management & Governance",
        question: "What information does Azure Service Health provide?",
        options: ["Details on Azure outages, planned maintenance, and service advisories affecting your resources", "Your personal computer battery percentage", "Local hospital schedules", "Internet speed test results"],
        answer: 0,
        explanation: "Service Health gives tailored insights into service incidents and maintenance events."
    },
    {
        category: "Azure Management & Governance",
        question: "What is the primary function of Azure Monitor?",
        options: ["Collecting, analyzing, and acting on telemetry from cloud and on-premises environments", "Monitoring office employee attendance", "Tracking physical hardware shipments", "Checking email inbox delivery"],
        answer: 0,
        explanation: "Azure Monitor provides comprehensive performance and log data collection."
    },
    {
        category: "Azure Management & Governance",
        question: "What is a Log Analytics Workspace?",
        options: ["A dedicated environment for storing and querying log data using Kusto Query Language", "A physical desk in a data center", "A code editor for Python", "A graphic design workspace"],
        answer: 0,
        explanation: "Log Analytics workspaces store log data for deep diagnostic queries."
    },
    {
        category: "Azure Management & Governance",
        question: "Why is Multi-Factor Authentication (MFA) critical for cloud security?",
        options: ["It requires multiple verification methods, protecting accounts even if a password is stolen", "It makes login twice as fast", "It removes the need for passwords entirely", "It reduces cloud storage costs"],
        answer: 0,
        explanation: "MFA adds a crucial secondary verification layer against credential compromise."
    },
    {
        category: "Azure Management & Governance",
        question: "What is the core philosophy of the Zero Trust security model?",
        options: ["Verify explicitly, use least privilege access, and assume breach", "Trust all connected office devices automatically", "Never require passwords", "Disable all firewalls for speed"],
        answer: 0,
        explanation: "Zero Trust assumes no implicit trust and requires verification for every access request."
    },
    {
        category: "Azure Management & Governance",
        question: "What is Microsoft Purview used for?",
        options: ["Data governance, mapping, and security across your organization's data estate", "Video conferencing", "Managing virtual machine disks", "Writing unit tests"],
        answer: 0,
        explanation: "Purview helps discover, classify, and govern data assets across hybrid environments."
    },
    {
        category: "Azure Management & Governance",
        question: "What is the Cloud Adoption Framework for Azure?",
        options: ["A comprehensive set of guidance, documentation, and tools for cloud migration success", "A hardware warranty agreement", "A software licensing fee schedule", "A developer coding style guide"],
        answer: 0,
        explanation: "The Cloud Adoption Framework provides structured strategies for cloud migration and governance."
    },
    {
        category: "Azure Management & Governance",
        question: "What are the core pillars of the Microsoft Azure Well-Architected Framework?",
        options: ["Reliability, Security, Cost Optimization, Operational Excellence, and Performance Efficiency", "Speed, Color, Sound, Animation, Storage", "Hardware, Software, Firmware, Network, User", "Database, Frontend, Backend, API, Cache"],
        answer: 0,
        explanation: "These 5 pillars guide architects in building high-quality cloud workloads."
    },
    {
        category: "Azure Management & Governance",
        question: "What are Azure Management Groups used for?",
        options: ["Hierarchical containers above subscriptions to efficiently manage policies, access, and compliance", "Grouping software developers into teams", "Managing customer support tickets", " Organizing marketing campaigns"],
        answer: 0,
        explanation: "Management groups enable scope-based governance across multiple subscriptions."
    }
];

let activeQuizQuestions = [...allQuizQuestions];
let currentQuizIndex = 0;
let score = 0;
let selectedOption = null;

let quizTimerInterval = null;
let timeLeftSeconds = 25 * 60;

function startQuizTimer() {
    clearInterval(quizTimerInterval);
    timeLeftSeconds = 25 * 60;
    updateTimerDisplay();

    quizTimerInterval = setInterval(() => {
        timeLeftSeconds--;
        updateTimerDisplay();

        if (timeLeftSeconds <= 0) {
            clearInterval(quizTimerInterval);
            alert("Time's up! Submitting your AZ-900 practice exam.");
            currentQuizIndex = activeQuizQuestions.length;
            loadQuizQuestion();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeftSeconds / 60);
    const seconds = timeLeftSeconds % 60;
    const timerDisplay = document.getElementById('quiz-timer-display');
    if (timerDisplay) {
        timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function beginQuizSession() {
    currentQuizIndex = 0;
    score = 0;
    
    const welcomeView = document.getElementById('quiz-welcome-view');
    const activeView = document.getElementById('quiz-active-view');
    const resultsView = document.getElementById('quiz-results-view');
    
    if (welcomeView) welcomeView.classList.add('hidden');
    if (activeView) activeView.classList.remove('hidden');
    if (resultsView) resultsView.classList.add('hidden');

    loadQuizQuestion();
    startQuizTimer();
}

function resetQuizToWelcome() {
    clearInterval(quizTimerInterval);
    const welcomeView = document.getElementById('quiz-welcome-view');
    const activeView = document.getElementById('quiz-active-view');
    const resultsView = document.getElementById('quiz-results-view');
    
    if (welcomeView) welcomeView.classList.remove('hidden');
    if (activeView) activeView.classList.add('hidden');
    if (resultsView) resultsView.classList.add('hidden');
}

function filterQuizModule(moduleName) {
    activeQuizModuleTitle = moduleName === 'all' ? 'All Modules' : moduleName;
    document.querySelectorAll('[id^="quiz-filter-"]').forEach(btn => {
        btn.className = "px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-sky-50 dark:bg-[#121215] text-slate-800 dark:text-zinc-400 border border-sky-200 dark:border-zinc-800 hover:bg-sky-100";
    });

    if (moduleName === 'all') {
        const btn = document.getElementById('quiz-filter-all');
        if (btn) btn.className = "px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all bg-sky-600 text-white shadow-md shadow-sky-500/20";
        activeQuizQuestions = [...allQuizQuestions];
    } else if (moduleName === 'Cloud Concepts') {
        const btn = document.getElementById('quiz-filter-cc');
        if (btn) btn.className = "px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all bg-sky-600 text-white shadow-md shadow-sky-500/20";
        activeQuizQuestions = allQuizQuestions.filter(q => q.category === 'Cloud Concepts');
    } else if (moduleName === 'Azure Architecture & Services') {
        const btn = document.getElementById('quiz-filter-aas');
        if (btn) btn.className = "px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all bg-sky-600 text-white shadow-md shadow-sky-500/20";
        activeQuizQuestions = allQuizQuestions.filter(q => q.category === 'Azure Architecture & Services');
    } else if (moduleName === 'Azure Management & Governance') {
        const btn = document.getElementById('quiz-filter-amg');
        if (btn) btn.className = "px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all bg-sky-600 text-white shadow-md shadow-sky-500/20";
        activeQuizQuestions = allQuizQuestions.filter(q => q.category === 'Azure Management & Governance');
    }

    resetQuizToWelcome();
}

function loadQuizQuestion() {
    if (currentQuizIndex >= activeQuizQuestions.length) {
        clearInterval(quizTimerInterval);
        const activeView = document.getElementById('quiz-active-view');
        const resultsView = document.getElementById('quiz-results-view');
        const finalScore = document.getElementById('final-score');
        
        if (activeView) activeView.classList.add('hidden');
        if (resultsView) resultsView.classList.remove('hidden');
        if (finalScore) finalScore.innerText = `${score} / ${activeQuizQuestions.length}`;
        
        let percentage = Math.round((score / activeQuizQuestions.length) * 100);
        
        quizHistory.push({
            module: activeQuizModuleTitle,
            score: score,
            total: activeQuizQuestions.length,
            percentage: percentage,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        localStorage.setItem('azurevibe_quiz_history', JSON.stringify(quizHistory));
        updateDashboardStats();
        return;
    }

    const q = activeQuizQuestions[currentQuizIndex];
    const progressText = document.getElementById('quiz-progress-text');
    const catTag = document.getElementById('quiz-category-tag');
    const qText = document.getElementById('quiz-question');

    if (progressText) progressText.innerText = `Question ${currentQuizIndex + 1} of ${activeQuizQuestions.length}`;
    if (catTag) catTag.innerText = q.category;
    if (qText) qText.innerText = q.question;
    
    const optionsContainer = document.getElementById('quiz-options');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left p-4 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-sky-50 border border-sky-200 dark:border-zinc-700 text-slate-950 dark:text-zinc-100 text-sm font-medium transition-all flex items-center justify-between shadow-sm transform hover:translate-x-1 duration-200';
            btn.innerHTML = `<span>${opt}</span><span class="w-5 h-5 rounded-full border border-sky-300 dark:border-zinc-600 flex items-center justify-center text-xs"></span>`;
            btn.onclick = () => selectQuizOption(idx, btn);
            optionsContainer.appendChild(btn);
        });
    }

    const expBox = document.getElementById('quiz-explanation-box');
    const nextBtn = document.getElementById('quiz-next-btn');
    if (expBox) expBox.classList.add('hidden');
    if (nextBtn) nextBtn.classList.add('hidden');
    selectedOption = null;
}

function selectQuizOption(idx, btn) {
    const q = activeQuizQuestions[currentQuizIndex];
    selectedOption = idx;

    const optionsContainer = document.getElementById('quiz-options');
    if (optionsContainer) {
        const buttons = optionsContainer.children;
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].className = 'w-full text-left p-4 rounded-2xl bg-sky-50 dark:bg-zinc-800/40 border border-sky-200 dark:border-zinc-700/40 text-slate-500 text-sm font-medium opacity-60';
            buttons[i].style.pointerEvents = 'none';
        }
    }

    if (idx === q.answer) {
        btn.className = 'w-full text-left p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-sm font-semibold shadow-sm';
        score++;
    } else {
        btn.className = 'w-full text-left p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-sm font-semibold shadow-sm';
        const optionsContainer = document.getElementById('quiz-options');
        if (optionsContainer && optionsContainer.children[q.answer]) {
            optionsContainer.children[q.answer].className = 'w-full text-left p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-sm font-semibold shadow-sm';
        }
    }

    const expBox = document.getElementById('quiz-explanation-box');
    if (expBox) {
        expBox.className = `mt-6 p-5 rounded-2xl border text-sm leading-relaxed animate-fade-in-up ${idx === q.answer ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-sky-50 dark:bg-zinc-800 border-sky-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-300'}`;
        expBox.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
        expBox.classList.remove('hidden');
    }

    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) nextBtn.classList.remove('hidden');
}

function submitQuizAnswer() {
    currentQuizIndex++;
    loadQuizQuestion();
}

function restartQuiz() {
    resetQuizToWelcome();
}

window.onload = function() {
    updateDashboardStats();
    updateFlashcardUI();
    resetQuizToWelcome();
    loadStudyModuleUI();
    renderStudyPlanner();
};