// ---------------------------------------------------------------------------
// ICONS (inline SVG, no external icon font needed)
// ---------------------------------------------------------------------------
const ICONS = {
    cloud: '<path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 0 0 4.5 12 3.5 3.5 0 0 0 6 19Z"/>',
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
    cards: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M4 16V5a2 2 0 0 1 2-2h11"/>',
    quiz: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8M13 12h8M13 18h8"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    'arrow-left': '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z"/>',
    play: '<path d="m6 3 14 9-14 9Z"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    rotate: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'
};

function icon(name, extra) {
    return `<svg class="ico ${extra || ''}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

// Replace <span data-icon="name" class="..."> placeholders with SVGs
function hydrateIcons() {
    document.querySelectorAll('[data-icon]').forEach(el => {
        if (el.dataset.hydrated) return;
        el.outerHTML = icon(el.dataset.icon, el.className);
    });
}

function setThemeIcon(isDark) {
    const el = document.getElementById('theme-icon');
    if (el) el.innerHTML = icon(isDark ? 'sun' : 'moon');
}

// ---------------------------------------------------------------------------
// MOTION HELPERS
// ---------------------------------------------------------------------------
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

function restartAnim(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;   // force reflow so the animation can replay
    el.classList.add(cls);
}

// Staggered entrance for the direct children of a tab (and of its grids)
function staggerIn(container) {
    if (!container) return;
    const items = container.querySelectorAll(':scope > *, :scope > .grid > *');
    items.forEach((el, i) => {
        el.classList.remove('reveal');
        el.style.setProperty('--i', i);
    });
    void container.offsetWidth;
    items.forEach(el => el.classList.add('reveal'));
}

// Count a number up from zero, keeping the surrounding text ("3 / 45", "93%")
function countUp(el) {
    if (!el || reduceMotion) return;
    const text = el.textContent;
    const m = text.match(/\d+/);
    if (!m) return;
    const target = parseInt(m[0], 10);
    if (target === 0) return;
    const start = performance.now(), dur = 900;
    function frame(now) {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = text.replace(m[0], Math.round(target * eased));
        if (t < 1) requestAnimationFrame(frame); else el.textContent = text;
    }
    requestAnimationFrame(frame);
}

function animateStats() {
    ['stat-flashcards', 'stat-quiz-score', 'stat-planner-count'].forEach(id => countUp(document.getElementById(id)));
}

// ---------------------------------------------------------------------------
// NAVIGATION & THEME
// ---------------------------------------------------------------------------
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('animate-fade-in-up');
    });
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) {
        activeTab.classList.remove('hidden');
        void activeTab.offsetWidth;
        activeTab.classList.add('animate-fade-in-up');
        staggerIn(activeTab);
        if (tabId === 'dashboard') { updateDashboardStats(); animateStats(); }
    }
    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) activeBtn.classList.add('active');

    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('mobile-backdrop');
    if (sidebar && !sidebar.classList.contains('-translate-x-[110%]')) {
        sidebar.classList.add('-translate-x-[110%]');
        if (backdrop) backdrop.classList.add('hidden');
    }
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('mobile-backdrop');
    if (sidebar) sidebar.classList.toggle('-translate-x-[110%]');
    if (backdrop) backdrop.classList.toggle('hidden');
}

function toggleTheme() {
    const html = document.documentElement;
    const goingDark = !html.classList.contains('dark');
    html.classList.toggle('dark', goingDark);
    html.classList.toggle('light', !goingDark);
    setThemeIcon(goingDark);
    restartAnim(document.getElementById('theme-icon'), 'spin-once');
    localStorage.setItem('azurevibe_theme', goingDark ? 'dark' : 'light');
}

(function initTheme() {
    const dark = localStorage.getItem('azurevibe_theme') === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
})();

// Persistent Storage & State
let masteredCards = JSON.parse(localStorage.getItem('azurevibe_mastered_cards')) || [];
let quizHistory = JSON.parse(localStorage.getItem('azurevibe_quiz_history')) || [];
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
    loadStudyModuleUI();
}

function renderQuizHistoryLog() {
    const box = document.getElementById('quiz-history-container');
    if (!box) return;
    if (quizHistory.length === 0) {
        box.innerHTML = `<p class="text-xs t-faint italic">No quiz attempts yet. Take a quiz to start tracking your progress.</p>`;
        return;
    }
    box.innerHTML = quizHistory.slice(-5).reverse().map((a, n) => `
        <div style="--i:${n}" class="reveal glass-inset flex items-center justify-between px-4 py-3 text-xs">
            <div>
                <span class="font-bold t-ink">${a.module}</span>
                <p class="t-faint text-[11px] mt-0.5">${a.date}</p>
            </div>
            <span class="font-extrabold text-sm ${a.percentage >= 70 ? 'text-ok' : 'text-warn'}">${a.score}/${a.total} · ${a.percentage}%</span>
        </div>`).join('');
}

function resetAllProgress() {
    if (confirm("Are you sure you want to clear all your flashcard mastery, quiz history, and study progress?")) {
        localStorage.clear();
        masteredCards = [];
        quizHistory = [];
        studyProgress = sbDefault();
        studyPlans = [];
        updateDashboardStats();
        updateFlashcardUI();
        loadStudyModuleUI();
        renderStudyPlanner();
        alert("Progress cleared successfully!");
    }
}

// ---------------------------------------------------------------------------
// STUDY BUDDY LOGIC  (Learning path > Module > Sections + Quick check)
// Content comes from study-data.js (studyModulesData, studyChecks).
// ---------------------------------------------------------------------------
const SB_KEY = 'azurevibe_study_buddy_v3';

function sbDefault() { return { path: 0, mod: 0, done: {}, checks: {} }; }

function sbLoad() {
    try {
        const saved = JSON.parse(localStorage.getItem(SB_KEY));
        if (saved && saved.done && saved.checks && studyModulesData[saved.path] && studyModulesData[saved.path].lessons[saved.mod]) return saved;
    } catch (e) { /* use default */ }
    return sbDefault();
}

let studyProgress = sbLoad();
let sbAnswers = {};   // transient quick-check answers per module id
let sbLastKey = null; // used to animate only when the module changes
let sbLastPick = null;

function sbSave() { localStorage.setItem(SB_KEY, JSON.stringify(studyProgress)); }
function sbId(p, m) { return `${p}-${m}`; }
function sbClean(title) { return title.replace(/^Module \d+\s*[—-]\s*/, '').replace(/^Describe\s+/, ''); }

function sbCounts() {
    let done = 0, total = 0;
    studyModulesData.forEach((p, pi) => p.lessons.forEach((_, mi) => { total++; if (studyProgress.done[sbId(pi, mi)]) done++; }));
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

function selectStudyPath(i) {
    studyProgress.path = i; studyProgress.mod = 0; sbSave(); loadStudyModuleUI();
}

function selectStudyModule(i) {
    studyProgress.mod = i; sbSave(); loadStudyModuleUI(); sbScrollTop();
}

function sbScrollTop() {
    const el = document.getElementById('sb-lesson');
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function prevLesson() {
    let { path, mod } = studyProgress;
    if (mod > 0) mod--;
    else if (path > 0) { path--; mod = studyModulesData[path].lessons.length - 1; }
    else return;
    studyProgress.path = path; studyProgress.mod = mod; sbSave(); loadStudyModuleUI(); sbScrollTop();
}

function completeAndNextLesson() {
    const { path, mod } = studyProgress;
    studyProgress.done[sbId(path, mod)] = true;
    if (mod < studyModulesData[path].lessons.length - 1) studyProgress.mod = mod + 1;
    else if (path < studyModulesData.length - 1) { studyProgress.path = path + 1; studyProgress.mod = 0; }
    else {
        sbSave(); loadStudyModuleUI();
        alert('You have completed every Study Buddy module. Test yourself in the Smart Quiz Builder next!');
        return;
    }
    sbSave(); loadStudyModuleUI(); sbScrollTop();
}

function answerCheck(qi, oi) {
    const { path, mod } = studyProgress;
    const id = sbId(path, mod);
    const qs = (studyChecks[path] && studyChecks[path][mod]) || [];
    const ans = sbAnswers[id] || (sbAnswers[id] = {});
    if (ans[qi] !== undefined) return;
    ans[qi] = oi;
    sbLastPick = `${id}:${qi}`;
    if (Object.keys(ans).length === qs.length) {
        const score = qs.filter((q, i) => ans[i] === q.answer).length;
        studyProgress.checks[id] = { score, total: qs.length };
        sbSave();
    }
    loadStudyModuleUI();
}

function retryCheck() {
    delete sbAnswers[sbId(studyProgress.path, studyProgress.mod)];
    loadStudyModuleUI();
}

function loadStudyModuleUI() {
    const pathsEl = document.getElementById('sb-paths');
    const modsEl = document.getElementById('sb-modules');
    const lessonEl = document.getElementById('sb-lesson');
    if (!pathsEl || !modsEl || !lessonEl) return;

    const { path, mod } = studyProgress;
    const P = studyModulesData[path];
    const M = P.lessons[mod];
    const id = sbId(path, mod);
    const fresh = sbLastKey !== id;
    sbLastKey = id;

    // overall progress
    const c = sbCounts();
    const badge = document.getElementById('module-overall-progress');
    if (badge) badge.innerText = `${c.done} / ${c.total} modules (${c.pct}%)`;
    const bar = document.getElementById('sb-overall-bar');
    if (bar) bar.style.width = `${c.pct}%`;

    // learning path switcher
    pathsEl.innerHTML = studyModulesData.map((p, i) =>
        `<button onclick="selectStudyPath(${i})" class="${i === path ? 'on' : ''}">${i + 1} · ${sbClean(p.title)}</button>`).join('');

    // module list
    modsEl.innerHTML = `
        <div class="px-2 pt-1 pb-3">
            <p class="eyebrow">Learning path ${path + 1}</p>
            <h3 class="mt-1 font-bold t-ink leading-snug">${P.title}</h3>
        </div>
        <div class="space-y-1">
        ${P.lessons.map((m, i) => {
            const done = studyProgress.done[sbId(path, i)];
            const chk = studyProgress.checks[sbId(path, i)];
            return `<button onclick="selectStudyModule(${i})" class="mod-item ${i === mod ? 'on' : ''} ${done ? 'done' : ''}">
                <span class="mod-num">${done ? icon('check', 'ico-sm') : i + 1}</span>
                <span>
                    <span class="block text-sm font-semibold t-ink leading-snug">${sbClean(m.title)}</span>
                    <span class="block text-[11px] t-faint mt-0.5">${m.sections ? m.sections.length : 0} topics${chk ? ` · quick check ${chk.score}/${chk.total}` : ''}</span>
                </span>
            </button>`;
        }).join('')}
        </div>`;

    // module content
    const sections = (M.sections || []).map((s, i) => `
        <div class="sec-block ${fresh ? 'reveal' : ''}" style="--i:${i + 1}">
            <h4 class="font-bold t-ink flex items-center gap-2.5"><span class="t-faint text-xs font-mono">${String(i + 1).padStart(2, '0')}</span>${s.heading}</h4>
            <p class="sec-body mt-2">${s.body}</p>
        </div>`).join('');

    const tip = M.examTip ? `
        <div class="callout callout-tip mt-5">
            <p class="callout-title font-bold flex items-center gap-2">${icon('bulb', 'ico-sm')}Exam tip</p>
            <p class="mt-1.5 t-soft">${M.examTip}</p>
        </div>` : '';

    // quick check
    const qs = (studyChecks[path] && studyChecks[path][mod]) || [];
    const ans = sbAnswers[id] || {};
    const finished = qs.length > 0 && Object.keys(ans).length === qs.length;
    const quick = qs.length ? `
        <div class="mt-8">
            <p class="eyebrow mb-3">Quick check</p>
            <div class="space-y-4">
            ${qs.map((q, qi) => {
                const picked = ans[qi];
                return `<div class="glass-inset p-4 sm:p-5 space-y-3">
                    <p class="text-sm font-bold t-ink">${qi + 1}. ${q.q}</p>
                    <div class="space-y-2">
                    ${q.options.map((o, oi) => {
                        let cls = 'opt';
                        if (picked !== undefined) { cls += oi === q.answer ? ' opt-correct' : oi === picked ? ' opt-wrong' : ' opt-dim'; if (sbLastPick === `${id}:${qi}`) cls += ' anim'; }
                        return `<button class="${cls}" ${picked !== undefined ? 'disabled' : ''} onclick="answerCheck(${qi}, ${oi})"><span>${o}</span></button>`;
                    }).join('')}
                    </div>
                    ${picked !== undefined ? `<p class="text-xs t-soft leading-relaxed"><strong class="t-ink">${picked === q.answer ? 'Correct.' : 'Not quite.'}</strong> ${q.explanation}</p>` : ''}
                </div>`;
            }).join('')}
            </div>
            ${finished ? `<div class="mt-4 flex items-center justify-between callout">
                <span class="font-bold t-ink">You scored ${qs.filter((q, i) => ans[i] === q.answer).length} / ${qs.length}</span>
                <button class="btn !py-1.5 !px-3 !text-xs" onclick="retryCheck()">Retry</button>
            </div>` : ''}
        </div>` : '';

    const first = path === 0 && mod === 0;
    const last = path === studyModulesData.length - 1 && mod === P.lessons.length - 1;
    lessonEl.innerHTML = `
        <div class="flex items-start justify-between gap-3">
            <div>
                <p class="eyebrow">Module ${mod + 1} of ${P.lessons.length}</p>
                <h3 class="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight t-ink leading-snug">${sbClean(M.title)}</h3>
            </div>
            ${studyProgress.done[id] ? `<span class="chip inline-flex items-center gap-1.5 shrink-0">${icon('check', 'ico-sm')}Completed</span>` : ''}
        </div>
        ${M.intro ? `<p class="mt-3 text-sm sm:text-base t-soft leading-relaxed">${M.intro}</p>` : ''}
        <div class="mt-6">${sections}</div>
        ${tip}
        ${quick}
        <div class="mt-8 pt-5 flex flex-col sm:flex-row gap-3 justify-between" style="border-top:1px solid var(--hairline)">
            <button class="btn" onclick="prevLesson()" ${first ? 'disabled' : ''}>${icon('arrow-left', 'ico-sm')}Previous</button>
            <button class="btn btn-primary" onclick="completeAndNextLesson()">${last ? 'Finish' : 'Mark complete &amp; next'}${icon('arrow-right', 'ico-sm')}</button>
        </div>`;
    if (fresh) restartAnim(lessonEl, 'swap');
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
        container.innerHTML = `<p class="text-xs t-faint italic">No study sessions scheduled yet.</p>`;
    } else {
        container.innerHTML = studyPlans.map((plan, n) => `
            <div style="--i:${n}" class="reveal glass-inset flex items-center justify-between px-4 py-3 text-xs">
                <div>
                    <span class="font-bold t-ink text-sm">${plan.topic}</span>
                    <p class="t-accent font-semibold mt-0.5 inline-flex items-center gap-1.5">${icon('calendar', 'ico-sm')}${plan.date} at ${plan.time}</p>
                </div>
                <button onclick="deleteStudyPlan(${plan.id})" class="t-faint hover:text-rose-500 p-2" aria-label="Delete session">${icon('trash', 'ico-sm')}</button>
            </div>
        `).join('');
    }
}

// Flashcards & Quizzes logic (with unique prompts for each card)
const allFlashcards = [
    { category: "Cloud Concepts", term: "CapEx vs OpEx", definition: "CapEx is upfront physical expenditure on data centers. OpEx is a consumption-based pricing model where you pay only for what you use.", prompt: "What is the core difference and why does Azure favor OpEx?" },
    { category: "Cloud Concepts", term: "High Availability", definition: "Ensures services are running continuously for a desired time with minimal downtime, often backed by SLAs.", prompt: "How do cloud providers guarantee continuous uptime?" },
    { category: "Cloud Concepts", term: "Scalability", definition: "The ability to adjust resources to meet demand, scaling up/down (vertical) or out/in (horizontal).", prompt: "What is the difference between vertical and horizontal scaling?" },
    { category: "Cloud Concepts", term: "Elasticity", definition: "Automatically or dynamically increasing or decreasing resources based on workload fluctuations.", prompt: "How does elasticity differ from manual scaling?" },
    { category: "Cloud Concepts", term: "Fault Tolerance", definition: "The ability of a system to remain operational even if one or more components fail.", prompt: "How do systems handle unexpected hardware or software failures?" },
    { category: "Cloud Concepts", term: "Disaster Recovery", definition: "The ability to restore IT infrastructure and data after a catastrophic event using paired regions or backups.", prompt: "What strategy ensures business continuity after a regional outage?" },
    { category: "Cloud Concepts", term: "Public Cloud", definition: "Cloud resources owned and operated by a third-party provider, delivering services over the public internet.", prompt: "Who owns and operates public cloud infrastructure?" },
    { category: "Cloud Concepts", term: "Private Cloud", definition: "Cloud infrastructure used exclusively by a single business, hosted on-premises or privately managed.", prompt: "When would an organization choose a private cloud?" },
    { category: "Cloud Concepts", term: "Hybrid Cloud", definition: "Combines public and private clouds, allowing data and applications to be shared between them.", prompt: "How do public and private environments connect in a hybrid model?" },
    { category: "Cloud Concepts", term: "Multi-Cloud", definition: "Using cloud services from multiple public cloud providers (e.g., Azure and AWS) simultaneously.", prompt: "Why might a company adopt a multi-cloud strategy?" },
    { category: "Cloud Concepts", term: "Economies of Scale", definition: "The ability to lower costs by purchasing in massive volumes and sharing infrastructure across global customers.", prompt: "How do cloud providers achieve lower unit costs for customers?" },
    { category: "Cloud Concepts", term: "Agility", definition: "The speed and ease with which businesses can develop, test, and launch new software applications.", prompt: "How does cloud computing accelerate software delivery?" },
    { category: "Cloud Concepts", term: "Consumption-Based Model", definition: "Pricing model where you pay strictly for the resources you use rather than fixed infrastructure upkeep.", prompt: "How is cloud utility pricing billed?" },
    { category: "Cloud Concepts", term: "Reliability", definition: "The ability of a system to recover from failures and continue functioning correctly under stress.", prompt: "What makes a cloud architecture resilient under pressure?" },
    { category: "Cloud Concepts", term: "Capital Expenditure (CapEx)", definition: "Upfront capital investment in physical hardware that depreciates over time on financial balance sheets.", prompt: "How are physical datacenters accounted for under CapEx?" },

    { category: "Azure Architecture & Services", term: "Azure Region", definition: "A set of data centers deployed within a latency-defined perimeter connected via a dedicated regional network.", prompt: "What defines the boundaries of an Azure region?" },
    { category: "Azure Architecture & Services", term: "Availability Zone", definition: "Physically separate data centers within an Azure region equipped with independent power, cooling, and networking.", prompt: "How do availability zones protect against datacenter failures?" },
    { category: "Azure Architecture & Services", term: "Region Pair", definition: "Two Azure regions paired within the same geography (at least 300 miles apart) for disaster recovery and isolated updates.", prompt: "What is the minimum distance between paired Azure regions?" },
    { category: "Azure Architecture & Services", term: "Resource Group", definition: "A logical container in Azure where related resources (VMs, databases, web apps) are managed together.", prompt: "What is the primary purpose of an Azure resource group?" },
    { category: "Azure Architecture & Services", term: "Azure Resource Manager (ARM)", definition: "The deployment and management service for Azure, providing a consistent management layer for templates and API calls.", prompt: "What underlying service handles all Azure portal and CLI requests?" },
    { category: "Azure Architecture & Services", term: "Virtual Machines (VMs)", definition: "IaaS offering providing virtualized computing environments with customizable operating systems.", prompt: "When should you choose IaaS virtual machines?" },
    { category: "Azure Architecture & Services", term: "Azure App Service", definition: "Fully managed PaaS platform for building, deploying, and scaling web apps and APIs.", prompt: "How does App Service simplify web hosting?" },
    { category: "Azure Architecture & Services", term: "Azure Functions", definition: "Serverless compute service that lets you run small pieces of code without managing underlying infrastructure.", prompt: "What triggers serverless execution in Azure Functions?" },
    { category: "Azure Architecture & Services", term: "Virtual Network (VNet)", definition: "Fundamental building block for your private network in Azure, enabling secure communication between VMs and services.", prompt: "How do Azure resources communicate securely in isolation?" },
    { category: "Azure Architecture & Services", term: "ExpressRoute", definition: "Private, high-speed dedicated connection between your on-premises infrastructure and Azure data centers.", prompt: "How does ExpressRoute differ from a VPN connection?" },
    { category: "Azure Architecture & Services", term: "Azure Blob Storage", definition: "Massively scalable object storage solution for unstructured data like text, audio, images, and backups.", prompt: "What is blob storage optimized for storing?" },
    { category: "Azure Architecture & Services", term: "Azure Cosmos DB", definition: "Globally distributed, multi-model NoSQL database service designed for ultra-low latency apps.", prompt: "What is the primary benefit of Cosmos DB?" },
    { category: "Azure Architecture & Services", term: "Azure SQL Database", definition: "Fully managed relational database service built on Microsoft SQL Server engine.", prompt: "How is Azure SQL Database managed?" },
    { category: "Azure Architecture & Services", term: "Azure Kubernetes Service (AKS)", definition: "Managed container orchestration service simplifying deployment and scaling of containerized apps.", prompt: "What problem does AKS solve for developers?" },
    { category: "Azure Architecture & Services", term: "Content Delivery Network (CDN)", definition: "Distributed network of servers that caches static web content close to users for faster delivery.", prompt: "How does CDN reduce web latency for global users?" },

    { category: "Azure Management & Governance", term: "Microsoft Entra ID", definition: "Cloud-based identity and access management service (formerly Azure AD) providing SSO and MFA.", prompt: "What role does Entra ID play in cloud security?" },
    { category: "Azure Management & Governance", term: "Role-Based Access Control (RBAC)", definition: "Fine-grained access management control granting precise permissions based on user roles.", prompt: "How does RBAC enforce the principle of least privilege?" },
    { category: "Azure Management & Governance", term: "Azure Policy", definition: "Service used to create, assign, and manage policies that enforce rules and compliance across your Azure resources.", prompt: "How do policies maintain organizational governance?" },
    { category: "Azure Management & Governance", term: "Azure Blueprints", definition: "Declarative packages that bundle role assignments, policies, templates, and resource groups into repeatable setups.", prompt: "What is included in an Azure blueprint package?" },
    { category: "Azure Management & Governance", term: "Azure Advisor", definition: "Personalized cloud consultant that analyzes your configurations and gives recommendations for high availability and cost.", prompt: "What five categories does Advisor evaluate?" },
    { category: "Azure Management & Governance", term: "Azure Cost Management", definition: "Tool suite to monitor cloud spending, set budgets, and optimize resource costs across subscriptions.", prompt: "How do teams track and control cloud expenditures?" },
    { category: "Azure Management & Governance", term: "Azure Service Health", definition: "Personalized dashboard providing information about Azure outages, planned maintenance, and service advisories.", prompt: "How does Service Health differ from public status pages?" },
    { category: "Azure Management & Governance", term: "Azure Monitor", definition: "Comprehensive solution for collecting, analyzing, and acting on telemetry from cloud and on-premises environments.", prompt: "What types of telemetry does Azure Monitor collect?" },
    { category: "Azure Management & Governance", term: "Log Analytics Workspace", definition: "Unique environment for storing and querying log data collected by Azure Monitor.", prompt: "What query language is used in Log Analytics?" },
    { category: "Azure Management & Governance", term: "Multi-Factor Authentication (MFA)", definition: "Security process requiring two or more verification methods to gain access to accounts or systems.", prompt: "Why is MFA critical for modern identity security?" },
    { category: "Azure Management & Governance", term: "Zero Trust Security Model", definition: "Security framework based on the principle of 'verify explicitly, use least privilege access, and assume breach'.", prompt: "What are the three pillars of Zero Trust?" },
    { category: "Azure Management & Governance", term: "Microsoft Purview", definition: "Unified data governance service to map, secure, and manage your organization's data estate.", prompt: "How does Purview assist with data compliance?" },
    { category: "Azure Management & Governance", term: "Cloud Adoption Framework", definition: "Guidance, best practices, and tools from Microsoft to help organizations plan cloud adoption strategies.", prompt: "What is the purpose of the Cloud Adoption Framework?" },
    { category: "Azure Management & Governance", term: "Well-Architected Framework", definition: "Set of core tenets (Cost, Security, Reliability, Performance, Operations) for building robust cloud architectures.", prompt: "What are the five pillars of the Well-Architected Framework?" },
    { category: "Azure Management & Governance", term: "Management Groups", definition: "Hierarchical containers above subscriptions that allow centralized governance and policy enforcement.", prompt: "Where do management groups sit in the resource hierarchy?" }
];

let activeFlashcards = [...allFlashcards];
let currentCardIndex = 0;
let isFlipped = false;

function filterFlashcards(moduleName) {
    document.querySelectorAll('[id^="fc-filter-"]').forEach(btn => {
        btn.className = "chip";
    });
    
    if (moduleName === 'all') {
        const btn = document.getElementById('fc-filter-all');
        if (btn) btn.className = "chip chip-active";
        activeFlashcards = [...allFlashcards];
    } else if (moduleName === 'Cloud Concepts') {
        const btn = document.getElementById('fc-filter-cc');
        if (btn) btn.className = "chip chip-active";
        activeFlashcards = allFlashcards.filter(f => f.category === 'Cloud Concepts');
    } else if (moduleName === 'Azure Architecture & Services') {
        const btn = document.getElementById('fc-filter-aas');
        if (btn) btn.className = "chip chip-active";
        activeFlashcards = allFlashcards.filter(f => f.category === 'Azure Architecture & Services');
    } else if (moduleName === 'Azure Management & Governance') {
        const btn = document.getElementById('fc-filter-amg');
        if (btn) btn.className = "chip chip-active";
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
    const promptEl = document.getElementById('fc-prompt');

    if (catEl) catEl.innerText = card.category;
    if (termEl) termEl.innerText = card.term;
    if (defEl) defEl.innerText = card.definition;
    if (counterEl) counterEl.innerText = `Card ${currentCardIndex + 1} of ${activeFlashcards.length}`;
    if (promptEl) promptEl.innerText = card.prompt || "What is the core definition and significance of this concept?";
    
    restartAnim(document.getElementById('fc-wrap'), 'swap');

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
        btn.className = "chip";
    });
    const allBtn = document.getElementById('fc-filter-all');
    if (allBtn) {
        allBtn.className = "chip chip-active";
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
    const timerBox = document.getElementById('quiz-timer');
    if (timerBox) timerBox.classList.toggle('timer-low', timeLeftSeconds > 0 && timeLeftSeconds <= 60);
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
        btn.className = "chip";
    });

    if (moduleName === 'all') {
        const btn = document.getElementById('quiz-filter-all');
        if (btn) btn.className = "chip chip-active";
        activeQuizQuestions = [...allQuizQuestions];
    } else if (moduleName === 'Cloud Concepts') {
        const btn = document.getElementById('quiz-filter-cc');
        if (btn) btn.className = "chip chip-active";
        activeQuizQuestions = allQuizQuestions.filter(q => q.category === 'Cloud Concepts');
    } else if (moduleName === 'Azure Architecture & Services') {
        const btn = document.getElementById('quiz-filter-aas');
        if (btn) btn.className = "chip chip-active";
        activeQuizQuestions = allQuizQuestions.filter(q => q.category === 'Azure Architecture & Services');
    } else if (moduleName === 'Azure Management & Governance') {
        const btn = document.getElementById('quiz-filter-amg');
        if (btn) btn.className = "chip chip-active";
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
    restartAnim(document.getElementById('quiz-active-view'), 'swap');
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
            btn.className = 'opt reveal';
            btn.style.setProperty('--i', idx + 1);
            btn.innerHTML = `<span>${opt}</span><span class="w-4 h-4 shrink-0 rounded-full border" style="border-color:var(--ink-faint)"></span>`;
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
            buttons[i].className = 'opt opt-dim';
            buttons[i].style.pointerEvents = 'none';
        }
    }

    if (idx === q.answer) {
        btn.className = 'opt opt-correct anim';
        score++;
    } else {
        btn.className = 'opt opt-wrong anim';
        const optionsContainer = document.getElementById('quiz-options');
        if (optionsContainer && optionsContainer.children[q.answer]) {
            optionsContainer.children[q.answer].className = 'opt opt-correct anim';
        }
    }

    const expBox = document.getElementById('quiz-explanation-box');
    if (expBox) {
        expBox.className = `mt-6 callout animate-fade-in-up ${idx === q.answer ? 'callout-ok' : ''}`;
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
    hydrateIcons();
    setThemeIcon(document.documentElement.classList.contains('dark'));
    updateDashboardStats();
    updateFlashcardUI();
    resetQuizToWelcome();
    loadStudyModuleUI();
    renderStudyPlanner();
    staggerIn(document.getElementById('tab-dashboard'));
    animateStats();
};