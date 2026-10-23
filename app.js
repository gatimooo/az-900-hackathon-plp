function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('animate-fade-in-up');
    });
    
    // Reset all nav buttons to inactive state
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-sky-500', 'text-white', 'shadow-md', 'shadow-sky-500/25');
        btn.classList.add('text-zinc-400', 'hover:bg-slate-800', 'dark:hover:bg-zinc-800/60', 'hover:text-zinc-200');
    });

    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) {
        activeTab.classList.remove('hidden');
        void activeTab.offsetWidth;
        activeTab.classList.add('animate-fade-in-up');
    }

    // Set active nav button with explicit text-white
    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-zinc-400', 'hover:bg-slate-800', 'dark:hover:bg-zinc-800/60', 'hover:text-zinc-200');
        activeBtn.classList.add('bg-sky-500', 'text-white', 'shadow-md', 'shadow-sky-500/25');
    }

    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('mobile-backdrop');
    if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.add('-translate-x-full');
        if (backdrop) backdrop.classList.add('hidden');
    }
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('mobile-backdrop');
    if (sidebar) sidebar.classList.toggle('-translate-x-full');
    if (backdrop) backdrop.classList.toggle('hidden');
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

// Persistent Storage & State
let masteredCards = JSON.parse(localStorage.getItem('azurevibe_mastered_cards')) || [];
let quizHistory = JSON.parse(localStorage.getItem('azurevibe_quiz_history')) || [];
const STUDY_BUDDY_VERSION = "2";
let studyProgress = JSON.parse(localStorage.getItem('azurevibe_study_progress')) || { activeModule: 0, lessons: { 0: 0, 1: 0, 2: 0 } };
if (localStorage.getItem('azurevibe_study_buddy_version') !== STUDY_BUDDY_VERSION) {
    studyProgress = { activeModule: 0, lessons: { 0: 0, 1: 0, 2: 0 } };
    localStorage.setItem('azurevibe_study_progress', JSON.stringify(studyProgress));
    localStorage.setItem('azurevibe_study_buddy_version', STUDY_BUDDY_VERSION);
}
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
// STUDY BUDDY MODULES DATA — OFFICIAL MICROSOFT LEARN AZ-900 STRUCTURE (11 MODULES)
// ---------------------------------------------------------------------------
const studyModulesData = [
    {
        title: "Describe Cloud Concepts",
        lessons: [
            {
                title: "Module 1 — Describe Cloud Computing",
                intro: "This module covers what cloud computing actually is, how responsibility is shared between you and the provider, the different cloud models, and how consumption-based pricing works.",
                sections: [
                    { heading: "Define cloud computing", body: "Cloud computing is the delivery of computing services — servers, storage, databases, networking, software, and analytics — over the internet on a pay-as-you-go basis. Instead of buying and maintaining your own hardware, you rent compute power and storage from a cloud provider's datacenters and provision exactly what you need, when you need it." },
                    { heading: "The shared responsibility model", body: "Responsibility is divided between you and the provider. <strong>On-premises:</strong> you manage everything from the physical building up to your data. <strong>IaaS:</strong> the provider manages the physical infrastructure; you manage the OS, middleware, and applications. <strong>PaaS:</strong> the provider also manages the operating system. <strong>SaaS:</strong> the provider manages almost everything — you are typically responsible only for your data, devices, and user accounts." },
                    { heading: "Define cloud models", body: "<strong>Public cloud:</strong> services owned and operated by a third-party provider and delivered over the public internet to multiple customers. <strong>Private cloud:</strong> cloud infrastructure used exclusively by a single organization, on-premises or hosted by a third party. <strong>Hybrid cloud:</strong> combines public and private clouds so data and applications can move between them. Related concepts: <em>multicloud</em> (using more than one cloud provider) and <em>Azure Arc</em>, which extends Azure management to on-premises, edge, and other clouds." },
                    { heading: "The consumption-based model", body: "Cloud pricing is OpEx (operational expenditure), not CapEx (capital expenditure). There are no upfront hardware costs — you pay only for what you use, and when you stop using a resource you stop paying for it. Computing power becomes a metered utility, like electricity." }
                ],
                examTip: "Know the shared responsibility table cold: the further right you go (on-prem → IaaS → PaaS → SaaS), the more responsibility shifts to the provider. On-premises means YOU manage everything."
            },
            {
                title: "Module 2 — Describe the Benefits of Using Cloud Services",
                intro: "This module explains why organizations move to the cloud: availability, scalability, reliability, predictability, security, governance, and manageability.",
                sections: [
                    { heading: "High availability and scalability", body: "<strong>High availability:</strong> the system keeps running for a desired period with minimal downtime — if one component fails, a substitute takes over automatically. Availability is often backed by a Service Level Agreement (SLA). <strong>Scalability:</strong> the ability to adjust resources to meet demand — <em>vertical</em> (scaling up/down = adding power to an existing machine) and <em>horizontal</em> (scaling out/in = adding or removing machines)." },
                    { heading: "Reliability and predictability", body: "<strong>Reliability:</strong> the ability of a system to recover from failures and continue functioning — the cloud's decentralized design inherently supports this. <strong>Predictability</strong> comes in two flavors: <em>performance predictability</em> (autoscaling, load balancing, high availability) and <em>cost predictability</em> (TCO analysis, the Pricing Calculator, and real-time cost tracking with budgets)." },
                    { heading: "Security and governance", body: "The cloud provider is responsible for the physical security of the datacenters — you get enterprise-grade physical protection without buying it. You control who can access your resources, and the cloud provides built-in governance tooling: policies that enforce compliant environments, templates that standardize deployments, and compliance dashboards mapping to regulations." },
                    { heading: "Manageability", body: "Two meanings: <strong>Management of the cloud</strong> — the cloud platform manages itself for you (automatic scaling, deployments from templates, health monitoring). <strong>Management in the cloud</strong> — how YOU manage your environment: the Azure portal, Azure CLI, Azure PowerShell, Cloud Shell, REST APIs, and the Azure mobile app." }
                ],
                examTip: "Expect a question distinguishing 'management of the cloud' (what the provider automates for you) vs. 'management in the cloud' (the tools you use: portal, CLI, PowerShell)."
            },
            {
                title: "Module 3 — Describe Cloud Service Types",
                intro: "This module compares IaaS, PaaS, and SaaS — the three cloud service types — and shows how responsibility is divided in each.",
                sections: [
                    { heading: "Infrastructure as a Service (IaaS)", body: "You rent the fundamental building blocks — physical or virtual servers, storage, and networking — and get maximum flexibility and control. You manage the operating system (patching, licensing), middleware, and applications. The most 'do-it-yourself' cloud option. <em>Example: Azure Virtual Machines.</em>" },
                    { heading: "Platform as a Service (PaaS)", body: "A complete managed environment for building, testing, deploying, and managing applications. The provider manages the underlying infrastructure AND the operating system, so you focus purely on writing code. Ideal for developers who don't want to manage servers. <em>Examples: Azure App Service, Azure SQL Database.</em>" },
                    { heading: "Software as a Service (SaaS)", body: "Complete, fully functional software applications delivered over the web on a subscription basis. The provider manages everything — infrastructure, OS, and software updates. Users only configure application settings and manage their accounts. <em>Examples: Microsoft 365, Outlook.com, Microsoft Teams.</em>" },
                    { heading: "Comparing the service models", body: "Use the restaurant analogy: <strong>on-premises</strong> = cooking everything at home; <strong>IaaS</strong> = renting a commercial kitchen; <strong>PaaS</strong> = buying a ready-made meal to heat; <strong>SaaS</strong> = dining out. Choose based on how much control you need vs. how much you want the provider to manage." }
                ],
                examTip: "The shared responsibility matrix is a guaranteed exam topic. Also remember: SaaS = user manages NOTHING except data/devices/accounts; IaaS = user manages the most."
            }
        ]
    },
    {
        title: "Azure Architecture & Services",
        lessons: [
            {
                title: "Module 4 — Describe Core Architectural Components of Azure",
                intro: "This module covers the building blocks of Azure: regions, region pairs, availability zones, datacenters, resources, resource groups, subscriptions, and management groups.",
                sections: [
                    { heading: "Regions and region pairs", body: "An Azure <strong>region</strong> is a set of datacenters deployed within a latency-defined perimeter and connected by a dedicated low-latency network (there are 60+ regions worldwide). Each region is paired with another region in the same geography at least 300 miles away — a <strong>region pair</strong>. Benefits: data replication for disaster recovery, prioritized regional recovery during outages, sequential platform updates (never both regions at once), and data residency compliance." },
                    { heading: "Availability zones", body: "Physically separate datacenters within a single Azure region, each with independent power, cooling, and networking. An enabled region contains a minimum of three availability zones. Use them to protect applications and data from a localized datacenter failure. <em>Zonal services</em> pin a resource to one zone; <em>zone-redundant services</em> replicate automatically across zones." },
                    { heading: "Azure datacenters", body: "Unique physical buildings — worldwide — housing networked computer servers, with dedicated power, cooling, and security infrastructure. Datacenters are grouped into regions, and connected through a low-latency network." },
                    { heading: "Resources and resource groups", body: "Everything you create in Azure is a <strong>resource</strong> (VMs, virtual networks, databases, web apps). A <strong>resource group</strong> is a logical container that groups related resources for an Azure solution — you can deploy, manage, monitor, apply access controls to, and delete them together. A resource can belong to exactly ONE resource group, but resources in different groups can still communicate." },
                    { heading: "Subscriptions and management groups", body: "A <strong>subscription</strong> is a billing boundary that also provides limits/quotas and an access management boundary; organizations often use multiple subscriptions to separate environments or cost centers. <strong>Management groups</strong> organize subscriptions hierarchically above them. The hierarchy: <em>Root management group → management groups → subscriptions → resource groups → resources</em>. Governance (policies, RBAC) applied at a higher level is inherited by everything below it." }
                ],
                examTip: "The hierarchy question is a classic: Management group sits ABOVE Subscription. Also remember the numbers: region pairs are at least 300 miles apart, and a region with availability zones has a minimum of 3."
            },
            {
                title: "Module 5 — Describe Azure Compute and Networking Services",
                intro: "This module compares Azure compute options (VMs, containers, functions), virtual machine scale sets and availability sets, hosting options, and virtual networking including VPN Gateway and ExpressRoute.",
                sections: [
                    { heading: "Compare compute types", body: "<strong>Virtual machines</strong> (IaaS) give you full control over the OS — build and test like a physical server. <strong>Containers</strong> provide a lightweight, consistent environment that runs exactly the same way anywhere — use <em>Azure Container Instances (ACI)</em> for simple container apps or <em>Azure Kubernetes Service (AKS)</em> for orchestrated clusters. <strong>Azure Functions</strong> are event-driven, serverless — code runs in response to triggers with no infrastructure management at all, and you pay only per execution." },
                    { heading: "Virtual machine options", body: "<strong>Virtual machines:</strong> single, customizable IaaS servers. <strong>VM scale sets:</strong> groups of identical VMs behind a load balancer that scale automatically as demand changes. <strong>Availability sets:</strong> a logical grouping of VMs that spreads them across <em>fault domains</em> (hardware isolation) and <em>update domains</em> (planned maintenance isolation). <strong>Azure Virtual Desktop:</strong> a cloud-hosted VDI that streams a full Windows desktop and apps to users on any device — Microsoft manages the infrastructure." },
                    { heading: "Application hosting options", body: "Common PaaS hosting: <strong>Azure App Service</strong> (fully managed web apps, mobile back ends, and RESTful APIs with autoscaling and CI/CD built in), <strong>Azure Static Web Apps</strong> for static content, <strong>container hosting</strong> via AKS or ACI when you need portability, and <strong>Azure Functions</strong> for event-driven pieces. Often, solutions combine several of these." },
                    { heading: "Virtual networking", body: "A <strong>virtual network (VNet)</strong> lets Azure resources securely communicate with each other, the internet, and on-premises networks. VNets are segmented into <strong>subnets</strong>. <strong>VNet peering</strong> connects two VNets so they communicate as one. <strong>VPN Gateway</strong> sends <em>encrypted</em> traffic between an Azure VNet and your on-premises network across the <em>public internet</em> (site-to-site or point-to-site). <strong>ExpressRoute</strong> is a <em>dedicated private</em> high-speed connection that bypasses the public internet entirely — more predictable, faster, and more secure." },
                    { heading: "Public and private endpoints", body: "A <strong>public endpoint</strong> has a public IP address and is reachable from anywhere on the internet. A <strong>private endpoint</strong> assigns a private IP address from your VNet to an Azure service (via <em>Azure Private Link</em>), exposing that service only inside your private network — eliminating public internet exposure." }
                ],
                examTip: "VPN Gateway vs ExpressRoute is a guaranteed question: both connect on-premises to Azure — VPN Gateway = encrypted tunnel over the public internet, ExpressRoute = dedicated private fiber that never touches the internet."
            },
            {
                title: "Module 6 — Describe Azure Storage Services",
                intro: "This module covers the storage service types (blob, disk, file, archive), storage tiers, redundancy options, storage accounts, and options for moving files into Azure.",
                sections: [
                    { heading: "Compare Azure storage services", body: "<strong>Blob storage:</strong> optimized for massive amounts of unstructured data — documents, images, videos, backups, log files, and big data. <strong>Disk storage:</strong> persistent block storage for Azure VMs (page blobs). <strong>Azure Files:</strong> fully managed file shares accessible via SMB and NFS — a common use is replacing or syncing with on-premises file servers using <em>Azure File Sync</em>. <strong>Archive storage:</strong> for rarely accessed data with flexible latency requirements — the cheapest storage, but retrieval takes hours." },
                    { heading: "Storage tiers", body: "Blob access tiers balance storage cost against access cost: <strong>Hot</strong> (frequently accessed — highest storage cost, lowest access cost), <strong>Cool</strong> (infrequently accessed, stored 30+ days), <strong>Cold</strong> (rarely accessed, stored 90+ days), and <strong>Archive</strong> (offline tier, hours of retrieval latency, lowest storage cost of all)." },
                    { heading: "Redundancy options", body: "<strong>LRS (Locally redundant storage):</strong> 3 copies in a single datacenter. <strong>ZRS (Zone-redundant):</strong> 3 copies across three availability zones in the primary region. <strong>GRS (Geo-redundant):</strong> LRS in the primary region PLUS async copy to a single location in the secondary region — 6 copies total. <strong>RA-GRS / RA-GZRS:</strong> the read-access variants let you read from the secondary region if the primary becomes unavailable." },
                    { heading: "Storage accounts", body: "A <strong>storage account</strong> provides a unique namespace in Azure for your storage data, accessible over HTTP/HTTPS from anywhere. Every account exposes endpoints for each service (blob, file, queue, table). Choose <em>standard</em> performance (magnetic/HDD-backed, supports tiers) or <em>premium</em> performance (SSD-backed, for low-latency workloads)." },
                    { heading: "Options for moving files and migration", body: "<strong>AzCopy:</strong> a command-line utility to copy blobs/files to or from storage accounts (sync local → Azure, Azure → Azure, or Azure → local). <strong>Azure Storage Migration Service:</strong> moves on-premises file servers to Azure Files while preserving structure. <strong>Azure Data Box:</strong> a rugged physical storage appliance Microsoft ships to you — load terabytes/petabytes of data offline and ship it back; ideal for poor-network or huge-volume scenarios." }
                ],
                examTip: "Know the four access tiers (Hot/Cool/Cold/Archive) and be able to rank LRS < ZRS < GRS < GZRS for protection. If a question mentions 'offline, hours of retrieval latency' — the answer is Archive."
            },
            {
                title: "Module 7 — Describe Azure Identity, Access, and Security",
                intro: "This module covers Microsoft Entra ID, authentication methods, external identities, Conditional Access, role-based access control, Zero Trust, defense in depth, and Microsoft Defender for Cloud.",
                sections: [
                    { heading: "Directory services in Azure", body: "<strong>Microsoft Entra ID</strong> (formerly Azure Active Directory) is the cloud-based identity and access management service: authentication, single sign-on, MFA, device management, and Conditional Access, using modern protocols (OAuth, OpenID Connect, SAML). It is NOT the same as on-premises AD DS (which uses Kerberos/NTLM). <strong>Microsoft Entra Domain Services</strong> provides managed domain services (domain join, group policy, LDAP) in Azure — commonly used for legacy lift-and-shift apps that can't use modern auth." },
                    { heading: "Authentication methods", body: "<strong>Single sign-on (SSO):</strong> sign in once, access many apps and resources. <strong>Multi-factor authentication (MFA):</strong> requires two or more factors — something you <em>know</em> (password), something you <em>have</em> (phone, FIDO2 key), or something you <em>are</em> (biometrics). <strong>Passwordless authentication:</strong> Windows Hello for Business, FIDO2 security keys, or the Microsoft Authenticator app." },
                    { heading: "External identities", body: "<strong>Microsoft Entra B2B (Business-to-Business):</strong> collaborate with users from partner organizations by inviting them as guest users into YOUR tenant — they use their own credentials. <strong>Microsoft Entra B2C (Business-to-Consumer):</strong> lets customers of your applications sign in with their own social, enterprise, or local identities — the identity experience lives in a separate B2C tenant for your customer-facing apps." },
                    { heading: "Microsoft Entra Conditional Access", body: "An 'if-then' policy engine that brings signals together to make enforcement decisions: <em>IF</em> a user signs in from an unknown location, an unmanaged device, or a risky app, <em>THEN</em> require MFA, require a compliant device, limit session access, or block entirely. Signals include user/group, location/IP, device, application, and real-time risk detection." },
                    { heading: "Role-based access control (RBAC)", body: "Fine-grained access management for Azure resources. You assign <strong>roles</strong> (built-in: Owner, Contributor, Reader, User Access Administrator) to users/groups at a <strong>scope</strong> (management group → subscription → resource group → resource). Permissions inherit downward, and deny assignments take precedence. Follow least privilege: grant only what is needed." },
                    { heading: "Zero Trust and defense in depth", body: "<strong>Zero Trust:</strong> a security model based on three principles — <em>verify explicitly</em> (authenticate and authorize every request using all available signals), <em>use least privilege access</em> (JIT/JEA access), and <em>assume breach</em> (minimize blast radius, segment access, encrypt everything). <strong>Defense in depth:</strong> layered protection so a failure of one layer doesn't expose everything — layers: physical → identity → perimeter → network → compute → application → data." },
                    { heading: "Microsoft Defender for Cloud", body: "A unified security posture and workload protection platform: it assesses your environment, gives a <strong>Secure Score</strong>, provides actionable security recommendations, and delivers threat protection for data centers, cloud workloads (VMs, SQL, storage, containers), and hybrid environments. (Formerly Azure Security Center + Azure Defender.)" }
                ],
                examTip: "Two favorite exam topics: (1) B2B = collaborate with partner organizations; B2C = your app's customers. (2) The three Zero Trust principles — verify explicitly, least privilege, assume breach."
            }
        ]
    },
    {
        title: "Management & Governance",
        lessons: [
            {
                title: "Module 8 — Describe Cost Management in Azure",
                intro: "This module covers the factors that affect cost in Azure, the Pricing and TCO calculators, the Cost Management and Billing tool, and the purpose of tags.",
                sections: [
                    { heading: "Factors that affect costs", body: "Key cost drivers: <strong>resource type</strong> (different services and SKUs price differently), <strong>consumption</strong> (pay-as-you-go usage), <strong>maintenance</strong> (your own operational overhead), <strong>geography</strong> (the same resource can cost different amounts in different regions), <strong>subscription type</strong> (pay-as-you-go, EA, CSP), <strong>Azure Marketplace</strong> (third-party solutions billed separately), and <strong>network traffic</strong> (data egress — moving data OUT of Azure — is billed)." },
                    { heading: "Pricing calculator vs TCO calculator", body: "The <strong>Pricing calculator</strong> estimates Azure costs BEFORE you deploy: pick products, regions, and usage patterns to model a monthly bill you can share or export. The <strong>Total Cost of Ownership (TCO) calculator</strong> helps you decide WHETHER to migrate: enter your on-premises infrastructure (servers, databases, storage, networking, electricity) and it projects the cost savings of moving to Azure over time." },
                    { heading: "Cost Management and Billing", body: "<strong>Azure Cost Management + Billing</strong> is the tool to use AFTER you're running: cost analysis (break down spending by resource, service, tag), <strong>budgets</strong> with email/alert thresholds, spending forecasts, and cost allocation. The billing side covers invoices, payment methods, and billing scopes — useful when multiple subscriptions roll up to one organization." },
                    { heading: "The purpose of tags", body: "Tags are name/value metadata you attach to resources (e.g., <em>Environment: Production</em>, <em>CostCenter: 12345</em>, <em>Owner: gatimooo</em>). They let you organize, categorize, and — critically — <strong>allocate and report on costs</strong> across teams and projects. Azure Policy can enforce required tags so nothing gets deployed untagged." }
                ],
                examTip: "Know the calculator split: Pricing Calculator = estimate costs before deployment; TCO Calculator = compare on-premises vs Azure total cost. Cost Management + Billing = control costs after deployment. Also: data ingress is free, egress costs money."
            },
            {
                title: "Module 9 — Describe Features and Tools for Governance and Compliance",
                intro: "This module covers Azure Policy, initiatives, resource locks, the Service Trust Portal, and Microsoft Purview.",
                sections: [
                    { heading: "Azure Policy", body: "Azure Policy helps you <strong>create, assign, and manage policies that enforce rules and effects over your resources</strong>, so those resources stay compliant with corporate standards and SLAs. Examples: restrict which regions resources can be deployed to, allow only specific VM sizes, require specific tags. Policies can audit existing resources (reporting non-compliance) or actively prevent/deny non-compliant deployments, and effects include audit, deny, append, modify, and deployIfNotExists." },
                    { heading: "Initiatives", body: "An <strong>initiative</strong> is a group of related policies bundled and tracked together as a single unit — you get one combined compliance view instead of many separate policy results. Example: an initiative called 'Monitor your Azure environments' groups several policies that all support the same governance goal." },
                    { heading: "Resource locks", body: "Locks prevent accidental deletion or modification of critical resources — at any scope, and inherited by child resources. Two types: <strong>CanNotDelete</strong> (authorized users can read and modify, but not delete) and <strong>ReadOnly</strong> (authorized users can read, but not update or delete). Important: locks apply regardless of RBAC permissions — even an Owner must remove the lock before making the change." },
                    { heading: "Service Trust Portal", body: "The <strong>Microsoft Service Trust Portal</strong> is the hub for compliance guides, audit reports, and trust resources — evidence about how Microsoft protects your data, covering standards like ISO, SOC, GDPR, and regional regulations. Use it when you must demonstrate regulatory compliance for data hosted in Azure." },
                    { heading: "Microsoft Purview", body: "A unified family of data governance and compliance solutions. The <strong>data governance</strong> side discovers, maps, classifies, and catalogs data across on-premises, multi-cloud, and SaaS environments (data map, lineage, insights). The <strong>compliance</strong> side covers data loss prevention, eDiscovery, records management, and insider risk — managed through the Purview compliance portal." }
                ],
                examTip: "Policy vs RBAC: RBAC controls WHO can do WHAT on resources; Policy controls resource PROPERTIES and compliance. Locks vs Policy deny: a ReadOnly lock blocks ALL changes regardless of permissions — even owners."
            },
            {
                title: "Module 10 — Describe Features and Tools for Managing and Deploying Azure Resources",
                intro: "This module covers the Azure portal, Cloud Shell, PowerShell, and CLI; infrastructure as code with ARM templates, Bicep, and Terraform; Azure Arc; and Azure Resource Manager.",
                sections: [
                    { heading: "Azure portal, Cloud Shell, PowerShell, and CLI", body: "<strong>Azure portal:</strong> the web-based GUI for building, managing, and monitoring everything — customizable dashboards. <strong>Azure Cloud Shell:</strong> a browser-based, authenticated shell with Bash or PowerShell — no local installation, and your files persist. <strong>Azure PowerShell:</strong> cmdlets like <em>New-AzVm</em> for scripting on Windows, Linux, or macOS. <strong>Azure CLI:</strong> cross-platform commands like <em>az vm create</em>. All of these tools ultimately interact with Azure through Azure Resource Manager." },
                    { heading: "Infrastructure as code (IaC)", body: "<strong>ARM templates:</strong> JSON files that declaratively define the infrastructure you want — repeatable, consistent, idempotent deployments (deploying the same template twice produces the same result, no partial states). <strong>Bicep:</strong> a cleaner domain-specific language that transpiles into ARM templates — simpler syntax, same deployment pipeline. <strong>Terraform:</strong> third-party HashiCorp tooling, popular for multi-cloud deployments since it manages Azure AND other providers with one workflow." },
                    { heading: "Azure Arc", body: "Azure Arc bridges Azure management to resources <em>outside</em> Azure — on-premises datacenters, other clouds, and edge devices. You get a single pane of glass: Azure governance, monitoring, security, and policy applied to servers, Kubernetes clusters, and data services anywhere. You can even run Azure data services (like SQL Managed Instance) on your own infrastructure through Arc." },
                    { heading: "Azure Resource Manager and management groups", body: "<strong>ARM</strong> is the deployment and management service at the heart of Azure — every request (portal, CLI, PowerShell, SDK, template) goes through it, giving you a consistent management layer with RBAC, locks, tags, and policies enforced uniformly. <strong>Management groups</strong> organize multiple subscriptions hierarchically: up to 10,000 management groups, up to six levels of depth, and a root management group at the top. Anything applied at a management group (policy, RBAC) inherits down through all subscriptions below it." }
                ],
                examTip: "ARM templates and Bicep are DECLARATIVE and IDEMPOTENT — a classic exam phrase. If a question asks how to manage on-premises or multi-cloud resources with Azure tools, the answer is Azure Arc."
            },
            {
                title: "Module 11 — Describe Monitoring Tools in Azure",
                intro: "This module covers Azure Advisor, Azure Service Health, and Azure Monitor (including Log Analytics, Application Insights, and Azure Monitor alerts).",
                sections: [
                    { heading: "Azure Advisor", body: "Your <strong>personalized cloud consultant</strong>. Advisor evaluates your deployed resources and configuration, then recommends best practices across five categories: <strong>Reliability, Security, Performance, Cost, and Operational Excellence</strong>. Recommendations are actionable and prioritized — e.g., right-size underutilized VMs (cost), add missing security settings (security)." },
                    { heading: "Azure Service Health", body: "A <strong>personalized</strong> view of the health of the Azure services and regions YOU use — unlike the public Azure Status page, which shows global health for everyone. Four types of information: <strong>service issues</strong> (outages impacting you now), <strong>planned maintenance</strong> (upcoming changes that may affect you), <strong>health advisories</strong> (upcoming changes requiring attention), and <strong>security advisories</strong> (security-related notices, e.g., vulnerabilities like Spectre/Meltdown)." },
                    { heading: "Azure Monitor", body: "The core monitoring platform, collecting and analyzing <strong>metrics</strong> (numerical values, near real-time — CPU, disk IOPS, request counts) and <strong>logs</strong> (detailed event records). It covers Azure, on-premises, and multi-cloud resources. Data flows into dashboards, alerts, and automation." },
                    { heading: "Log Analytics, Application Insights, and alerts", body: "<strong>Log Analytics workspaces</strong> store log data where you query it with the Kusto Query Language (KQL). <strong>Application Insights</strong> is application performance management (APM) for your live web apps: request rates, failures, dependency tracking, and user behavior. <strong>Azure Monitor alerts</strong> notify you proactively — metric alerts, log alerts, and activity log alerts — and <strong>action groups</strong> define what happens (email, SMS, Logic App, Function, ITSM webhook)." }
                ],
                examTip: "The classic triad: Advisor RECOMMENDS best practices; Monitor OBSERVES your own resources; Service Health tells you about MICROSOFT-side issues affecting your services. Match each tool to its sentence on the exam."
            }
        ]
    }
];

const STUDY_TOTAL_LESSONS = studyModulesData.reduce((sum, mod) => sum + mod.lessons.length, 0);

function selectStudyModule(modIndex) {
    studyProgress.activeModule = modIndex;
    localStorage.setItem('azurevibe_study_progress', JSON.stringify(studyProgress));
    loadStudyModuleUI();
}

function loadStudyModuleUI() {
    const modIndex = studyProgress.activeModule;
    const currentModule = studyModulesData[modIndex];
    if (!currentModule) return;

    studyModulesData.forEach((mod, i) => {
        const btn = document.getElementById(`mod-btn-${i}`);
        if (!btn) return;
        const completedCount = Math.min(studyProgress.lessons[i] || 0, mod.lessons.length);
        const progText = document.getElementById(`mod-prog-${i}`);
        if (progText) progText.innerText = `Completed: ${completedCount} / ${mod.lessons.length} modules`;

        if (i === modIndex) {
            btn.className = "p-4 sm:p-5 rounded-3xl border text-left transition-all bg-sky-600 text-white shadow-md";
        } else {
            btn.className = "p-4 sm:p-5 rounded-3xl border text-left transition-all bg-sky-50 dark:bg-[#121215] border-sky-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 hover:bg-sky-100";
        }
    });

    let lessonIndex = studyProgress.lessons[modIndex] || 0;
    if (lessonIndex >= currentModule.lessons.length) lessonIndex = currentModule.lessons.length - 1;

    const lesson = currentModule.lessons[lessonIndex];
    const tagEl = document.getElementById('lesson-module-tag');
    const titleEl = document.getElementById('lesson-title');
    const contentEl = document.getElementById('lesson-content');
    const counterEl = document.getElementById('lesson-counter');

    if (tagEl) tagEl.innerText = `Learning Path ${modIndex + 1}: ${currentModule.title}`;
    if (titleEl) titleEl.innerText = lesson.title;
    if (counterEl) counterEl.innerText = `Module ${lessonIndex + 1} of ${currentModule.lessons.length}`;

    if (contentEl) {
        let html = '';
        if (lesson.intro) {
            html += `<p class="text-sm sm:text-base font-medium text-slate-800 dark:text-zinc-200 leading-relaxed">${lesson.intro}</p>`;
        }
        if (lesson.sections && lesson.sections.length) {
            html += `<div class="space-y-4 pt-2">`;
            lesson.sections.forEach((sec, i) => {
                html += `
                    <div class="rounded-2xl border border-sky-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 sm:p-5">
                        <h4 class="font-bold text-sky-800 dark:text-sky-300 text-sm sm:text-base flex items-center gap-2.5">
                            <span class="w-6 h-6 shrink-0 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[11px] font-extrabold">${i + 1}</span>
                            ${sec.heading}
                        </h4>
                        <p class="mt-2.5 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">${sec.body}</p>
                    </div>`;
            });
            html += `</div>`;
        }
        if (lesson.examTip) {
            html += `
                <div class="rounded-2xl border border-amber-300/50 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 p-4 sm:p-5">
                    <h4 class="font-bold text-amber-700 dark:text-amber-400 text-sm sm:text-base"><i class="fa-solid fa-lightbulb mr-2"></i>Exam Tip</h4>
                    <p class="mt-1.5 text-xs sm:text-sm text-amber-800 dark:text-amber-200/80 leading-relaxed">${lesson.examTip}</p>
                </div>`;
        }
        contentEl.innerHTML = html;
    }

    const totalCompleted = Object.values(studyProgress.lessons).reduce((a, b) => a + b, 0);
    const overallProg = Math.round((Math.min(totalCompleted, STUDY_TOTAL_LESSONS) / STUDY_TOTAL_LESSONS) * 100);
    const overallBadge = document.getElementById('module-overall-progress');
    if (overallBadge) overallBadge.innerText = `Progress: ${overallProg}% · ${Math.min(totalCompleted, STUDY_TOTAL_LESSONS)}/${STUDY_TOTAL_LESSONS}`;
}

function completeAndNextLesson() {
    const modIndex = studyProgress.activeModule;
    const currentModule = studyModulesData[modIndex];
    let lessonIndex = studyProgress.lessons[modIndex] || 0;

    if (lessonIndex < currentModule.lessons.length - 1) {
        studyProgress.lessons[modIndex] = lessonIndex + 1;
    } else {
        alert(`Congratulations! You have completed all modules in Learning Path ${modIndex + 1}: ${currentModule.title}.`);
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