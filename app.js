function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-cyan-500/10', 'text-cyan-400', 'border', 'border-cyan-500/20');
        btn.classList.add('text-slate-400', 'hover:bg-slate-800', 'hover:text-slate-200');
    });

    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-400', 'hover:bg-slate-800', 'hover:text-slate-200');
        activeBtn.classList.add('bg-cyan-500/10', 'text-cyan-400', 'border', 'border-cyan-500/20');
    }
}

const flashcards = [
    { category: "Cloud Concepts", term: "CapEx vs OpEx", definition: "CapEx is upfront physical expenditure on data centers. OpEx is a consumption-based pricing model where you pay only for what you use." },
    { category: "Cloud Models", term: "Public Cloud", definition: "Owned by a third-party cloud service provider (e.g. Microsoft Azure), delivering computing resources over the public internet." },
    { category: "Cloud Models", term: "Private Cloud", definition: "Cloud computing resources used exclusively by a single business or organization, hosted on-premises or managed privately." },
    { category: "Cloud Models", term: "Hybrid Cloud", definition: "Combines public and private clouds, allowing data and apps to be shared between them for greater flexibility." },
    { category: "Azure Architecture", term: "Region", definition: "A set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network." },
    { category: "Azure Architecture", term: "Availability Zone", definition: "Physically separate datacenters within an Azure region equipped with independent power, cooling, and networking." },
    { category: "Azure Architecture", term: "Region Pair", definition: "Each Azure region is paired with another region within the same geography (at least 300 miles away) for disaster recovery." },
    { category: "Identity & Access", term: "Microsoft Entra ID", definition: "Microsoft's cloud-based identity and access management service (formerly Azure AD) providing SSO and MFA." },
    { category: "Security & Governance", term: "Role-Based Access Control (RBAC)", definition: "Provides fine-grained access management control based on specific user roles and permissions in Azure." },
    { category: "Management Tools", term: "Azure Arc", definition: "A bridge that extends the Azure platform to help you build apps and services with your choice of infrastructure." },
    { category: "Pricing & Support", term: "Total Cost of Ownership (TCO)", definition: "A financial estimate designed to help calculate direct and indirect costs of building and operating an IT infrastructure." },
    { category: "Cloud Characteristics", term: "High Availability", definition: "Ensures services are running continuously for a desired time with minimal downtime." }
];

let currentCardIndex = 0;
let isFlipped = false;
let masteredCount = parseInt(localStorage.getItem('azurevibe_mastered')) || 8;

function updateFlashcardUI() {
    const card = flashcards[currentCardIndex];
    document.getElementById('fc-category').innerText = card.category;
    document.getElementById('fc-term').innerText = card.term;
    document.getElementById('fc-definition').innerText = card.definition;
    document.getElementById('card-counter').innerText = `Card ${currentCardIndex + 1} of ${flashcards.length}`;
    
    if (isFlipped) {
        document.getElementById('flashcard-inner').classList.remove('flipped');
        isFlipped = false;
    }
}

function flipCard() {
    const inner = document.getElementById('flashcard-inner');
    inner.classList.toggle('flipped');
    isFlipped = !isFlipped;
}

function nextCard() {
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    updateFlashcardUI();
}

function prevCard() {
    currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    updateFlashcardUI();
}

function markMastered() {
    masteredCount++;
    localStorage.setItem('azurevibe_mastered', masteredCount);
    document.getElementById('stat-flashcards').innerText = `${masteredCount} / ${flashcards.length}`;
    nextCard();
}

function resetFlashcards() {
    currentCardIndex = 0;
    updateFlashcardUI();
}

const quizQuestions = [
    {
        category: "Cloud Concepts",
        question: "Which cloud model gives the highest level of control and security over physical hardware?",
        options: ["Public Cloud", "Private Cloud", "Hybrid Cloud", "Multi-Cloud"],
        answer: 1,
        explanation: "Private cloud is dedicated to a single organization, giving complete physical and logical isolation and control."
    },
    {
        category: "Pricing & Economics",
        question: "Which of the following describes Capital Expenditure (CapEx)?",
        options: ["Paying monthly for cloud subscriptions", "Upfront spending on physical infrastructure", "Consuming compute resources on demand", "Paying only for active storage"],
        answer: 1,
        explanation: "CapEx is an upfront investment in physical assets like servers and data centers, whereas OpEx is recurring consumption billing."
    },
    {
        category: "Azure Architecture",
        question: "What is the primary benefit of deploying resources across multiple Availability Zones?",
        options: ["Lower latency to global users", "High availability and fault tolerance against datacenter failures", "Unlimited free storage", "Automatic code generation"],
        answer: 1,
        explanation: "Availability Zones are physically separate datacenters within a region that protect applications if one datacenter experiences a power or hardware failure."
    },
    {
        category: "Identity & Access",
        question: "What is Microsoft Entra ID used for?",
        options: ["Hosting virtual machines", "Identity and access management (IAM)", "Relational database management", "Managing container Kubernetes clusters"],
        answer: 1,
        explanation: "Microsoft Entra ID (formerly Azure AD) provides cloud-based identity and access management, SSO, and multi-factor authentication."
    },
    {
        category: "Security",
        question: "In the Shared Responsibility Model, what is the customer ALWAYS responsible for?",
        options: ["Physical datacenter security", "Physical host hardware", "Information and data security", "HVAC cooling systems in datacenters"],
        answer: 2,
        explanation: "Data and user access management are always the customer's responsibility regardless of whether it's IaaS, PaaS, or SaaS."
    }
];

let currentQuizIndex = 0;
let score = 0;
let selectedOption = null;

function loadQuizQuestion() {
    if (currentQuizIndex >= quizQuestions.length) {
        document.getElementById('quiz-active-view').classList.add('hidden');
        document.getElementById('quiz-results-view').classList.remove('hidden');
        document.getElementById('final-score').innerText = `${score}/${quizQuestions.length}`;
        document.getElementById('stat-quiz-score').innerText = `${Math.round((score/quizQuestions.length)*100)}%`;
        return;
    }

    const q = quizQuestions[currentQuizIndex];
    document.getElementById('quiz-progress-text').innerText = `Question ${currentQuizIndex + 1} of ${quizQuestions.length}`;
    document.getElementById('quiz-category-tag').innerText = q.category;
    document.getElementById('quiz-question').innerText = q.question;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-medium transition-all flex items-center justify-between';
        btn.innerHTML = `<span>${opt}</span><span class="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-xs"></span>`;
        btn.onclick = () => selectQuizOption(idx, btn);
        optionsContainer.appendChild(btn);
    });

    document.getElementById('quiz-explanation-box').classList.add('hidden');
    document.getElementById('quiz-next-btn').classList.add('hidden');
    selectedOption = null;
}

function selectQuizOption(idx, btn) {
    const q = quizQuestions[currentQuizIndex];
    selectedOption = idx;

    const buttons = document.getElementById('quiz-options').children;
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].className = 'w-full text-left p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium opacity-60';
    }

    if (idx === q.answer) {
        btn.className = 'w-full text-left p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium';
        score++;
    } else {
        btn.className = 'w-full text-left p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium';
        buttons[q.answer].className = 'w-full text-left p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium';
    }

    const expBox = document.getElementById('quiz-explanation-box');
    expBox.className = `mt-6 p-4 rounded-xl border text-sm ${idx === q.answer ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-300'}`;
    expBox.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
    expBox.classList.remove('hidden');

    document.getElementById('quiz-next-btn').classList.remove('hidden');
}

function submitQuizAnswer() {
    currentQuizIndex++;
    loadQuizQuestion();
}

function restartQuiz() {
    currentQuizIndex = 0;
    score = 0;
    document.getElementById('quiz-active-view').classList.remove('hidden');
    document.getElementById('quiz-results-view').classList.add('hidden');
    loadQuizQuestion();
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const chatMessages = document.getElementById('chat-messages');

    chatMessages.innerHTML += `
        <div class="flex items-start justify-end space-x-3">
            <div class="bg-cyan-600 text-white rounded-2xl p-4 max-w-[80%] leading-relaxed">${escapeHtml(message)}</div>
        </div>
    `;
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const typingId = 'typing-' + Date.now();
    chatMessages.innerHTML += `
        <div id="${typingId}" class="flex items-start space-x-3">
            <div class="w-7 h-7 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-500/20"><i class="fa-solid fa-robot text-xs"></i></div>
            <div class="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 text-slate-400 text-xs italic">Thinking with Gemini AI...</div>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
        document.getElementById(typingId).remove();
        let reply = getSmartAzureReply(message);
        chatMessages.innerHTML += `
            <div class="flex items-start space-x-3">
                <div class="w-7 h-7 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-500/20"><i class="fa-solid fa-robot text-xs"></i></div>
                <div class="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 text-slate-200 max-w-[80%] leading-relaxed">${reply}</div>
            </div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

function getSmartAzureReply(query) {
    const q = query.toLowerCase();
    if (q.includes('region') || q.includes('availability zone')) {
        return "Think of an <strong>Azure Region</strong> as a whole city with multiple datacenters. An <strong>Availability Zone</strong> is an individual data center building within that city with its own independent power and cooling so if one building loses power, your apps keep running!";
    } else if (q.includes('capex') || q.includes('opex')) {
        return "<strong>CapEx</strong> is like buying a house upfront with your savings (big capital investment). <strong>OpEx</strong> is like renting an apartment month-to-month—you pay only for what you use, with zero maintenance overhead!";
    } else if (q.includes('iaas') || q.includes('paas') || q.includes('saas')) {
        return "• <strong>IaaS (Infrastructure as a Service):</strong> You rent the raw virtual machine and manage OS/apps.<br>• <strong>PaaS (Platform as a Service):</strong> Microsoft manages the OS/runtime; you just deploy your code.<br>• <strong>SaaS (Software as a Service):</strong> Ready-to-use software like Microsoft 365.";
    } else {
        return `That's a great AZ-900 question! For "${query}", remember that Microsoft Azure organizes resources hierarchically from Management Groups down to Subscriptions, Resource Groups, and Resources. Focus on high availability, scalability, and predictable pricing for your exam!`;
    }
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

window.onload = function() {
    updateFlashcardUI();
    loadQuizQuestion();
};