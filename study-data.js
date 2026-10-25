// ---------------------------------------------------------------------------
// STUDY BUDDY CONTENT
// studyModulesData  -> Learning paths (the 3 AZ-900 domains) > modules > sections
// studyChecks       -> quick-check questions, same [path][module] order
// All content is original and unofficial. Skills outline: Microsoft Learn AZ-900 study guide.
// ---------------------------------------------------------------------------
const STUDY_GUIDE_URL = "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900";
const STUDY_WEIGHTS = ["25–30%", "35–40%", "30–35%"];

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

const studyChecks = [
  [
    [
      {
        "q": "A company pays for cloud resources only while they are running and has no upfront hardware cost. Which model is this?",
        "options": [
          "Consumption-based",
          "Private cloud",
          "Capital expenditure",
          "Sovereign cloud"
        ],
        "answer": 0,
        "explanation": "Consumption-based pricing means you pay for what you use, which is OpEx rather than CapEx."
      },
      {
        "q": "Which responsibility stays with the customer in every cloud service type?",
        "options": [
          "Physical network cabling",
          "Their data and identities",
          "Hypervisor patching",
          "Datacenter power"
        ],
        "answer": 1,
        "explanation": "Data and identities are always the customer's job; physical infrastructure is the provider's."
      },
      {
        "q": "A firm keeps regulated data on-premises but uses Azure for extra capacity during busy periods. This is:",
        "options": [
          "Public cloud only",
          "Private cloud only",
          "Hybrid cloud",
          "Serverless"
        ],
        "answer": 2,
        "explanation": "Combining on-premises infrastructure with public cloud is the definition of hybrid."
      }
    ],
    [
      {
        "q": "An application adds more virtual machine instances when traffic rises. This is:",
        "options": [
          "Vertical scaling",
          "Horizontal scaling",
          "Disaster recovery",
          "Serverless billing"
        ],
        "answer": 1,
        "explanation": "Adding instances is scaling out, also called horizontal scaling."
      },
      {
        "q": "Using the Azure portal and command-line tools to administer resources is an example of:",
        "options": [
          "Management of the cloud",
          "Management in the cloud",
          "Reliability",
          "Predictability"
        ],
        "answer": 1,
        "explanation": "The tools you use to administer resources are management in the cloud."
      }
    ],
    [
      {
        "q": "A team wants to deploy a web app without patching servers. Which service type fits best?",
        "options": [
          "IaaS",
          "PaaS",
          "SaaS",
          "On-premises"
        ],
        "answer": 1,
        "explanation": "PaaS manages servers and the OS so the team only manages the app."
      },
      {
        "q": "Microsoft 365 is an example of which service type?",
        "options": [
          "IaaS",
          "PaaS",
          "SaaS",
          "FaaS only"
        ],
        "answer": 2,
        "explanation": "Microsoft 365 is complete software delivered as a service, so it is SaaS."
      }
    ]
  ],
  [
    [
      {
        "q": "Which Azure construct protects against the failure of a single datacenter within a region?",
        "options": [
          "Region pair",
          "Availability zone",
          "Management group",
          "Resource group"
        ],
        "answer": 1,
        "explanation": "Availability zones are separate datacenters inside one region."
      },
      {
        "q": "Which is the correct hierarchy, from highest to lowest?",
        "options": [
          "Subscription, management group, resource group, resource",
          "Management group, subscription, resource group, resource",
          "Resource group, subscription, management group, resource",
          "Management group, resource group, subscription, resource"
        ],
        "answer": 1,
        "explanation": "Management groups contain subscriptions, which contain resource groups, which contain resources."
      },
      {
        "q": "What happens when you delete a resource group?",
        "options": [
          "Only empty groups can be deleted",
          "The resources inside are moved to another group",
          "All resources inside it are deleted",
          "Only the group's tags are removed"
        ],
        "answer": 2,
        "explanation": "Deleting a resource group deletes every resource it contains."
      }
    ],
    [
      {
        "q": "Which service creates a private, dedicated connection between on-premises and Azure that does not use the public internet?",
        "options": [
          "VPN Gateway",
          "ExpressRoute",
          "Azure DNS",
          "VNet peering"
        ],
        "answer": 1,
        "explanation": "ExpressRoute is a private connection; VPN Gateway uses the public internet."
      },
      {
        "q": "Which compute option is serverless and billed per execution?",
        "options": [
          "Azure Virtual Machines",
          "Azure Functions",
          "Availability sets",
          "Azure Virtual Desktop"
        ],
        "answer": 1,
        "explanation": "Azure Functions is event-driven serverless compute."
      },
      {
        "q": "What do Virtual Machine Scale Sets provide?",
        "options": [
          "A dedicated physical host",
          "A group of identical VMs that can scale automatically",
          "A private connection to on-premises",
          "Managed web hosting"
        ],
        "answer": 1,
        "explanation": "Scale sets manage identical VMs and can scale out and in automatically."
      }
    ],
    [
      {
        "q": "Which redundancy option copies data across three availability zones in one region?",
        "options": [
          "LRS",
          "ZRS",
          "GRS",
          "Archive"
        ],
        "answer": 1,
        "explanation": "Zone-redundant storage (ZRS) spreads copies across availability zones."
      },
      {
        "q": "Which storage tier is offline and needs rehydration before access?",
        "options": [
          "Hot",
          "Cool",
          "Cold",
          "Archive"
        ],
        "answer": 3,
        "explanation": "Archive data is offline and must be rehydrated, which takes time."
      },
      {
        "q": "Which tool syncs an on-premises Windows file server with Azure Files?",
        "options": [
          "AzCopy",
          "Azure File Sync",
          "Azure Data Box",
          "Azure DNS"
        ],
        "answer": 1,
        "explanation": "Azure File Sync keeps on-premises servers and Azure Files in sync."
      }
    ],
    [
      {
        "q": "Which service allows sign-in once to access many applications?",
        "options": [
          "Single sign-on",
          "Azure DNS",
          "ExpressRoute",
          "Resource locks"
        ],
        "answer": 0,
        "explanation": "Single sign-on lets one authentication cover many apps."
      },
      {
        "q": "Which model is summarised as 'never trust, always verify'?",
        "options": [
          "Shared responsibility",
          "Zero Trust",
          "Consumption-based",
          "Serverless"
        ],
        "answer": 1,
        "explanation": "Zero Trust assumes breach and verifies every request."
      },
      {
        "q": "Which feature applies different sign-in requirements based on signals such as location and device?",
        "options": [
          "Conditional Access",
          "RBAC",
          "Azure Policy",
          "Azure Advisor"
        ],
        "answer": 0,
        "explanation": "Conditional Access evaluates signals and then allows, blocks or requires MFA."
      }
    ]
  ],
  [
    [
      {
        "q": "Which tool estimates the cost of Azure services before you deploy them?",
        "options": [
          "Azure Advisor",
          "Pricing calculator",
          "Service Health",
          "Azure Monitor"
        ],
        "answer": 1,
        "explanation": "The pricing calculator creates an estimate for planned services."
      },
      {
        "q": "What can tags be used for?",
        "options": [
          "Granting permissions",
          "Organising resources and reporting cost by team",
          "Blocking deletion",
          "Encrypting data"
        ],
        "answer": 1,
        "explanation": "Tags are metadata used for organisation and cost reporting."
      }
    ],
    [
      {
        "q": "Which service enforces that all resources are created only in approved regions?",
        "options": [
          "Azure Policy",
          "RBAC",
          "Cost Management",
          "Azure Advisor"
        ],
        "answer": 0,
        "explanation": "Azure Policy enforces rules such as allowed locations."
      },
      {
        "q": "Which lock allows changes but blocks deletion?",
        "options": [
          "ReadOnly",
          "CanNotDelete",
          "Private",
          "Archive"
        ],
        "answer": 1,
        "explanation": "CanNotDelete permits reading and modification but not deletion."
      }
    ],
    [
      {
        "q": "Which tool lets you manage servers outside Azure using Azure management features?",
        "options": [
          "Azure Arc",
          "Azure DNS",
          "Azure Files",
          "Azure Cloud Shell"
        ],
        "answer": 0,
        "explanation": "Azure Arc extends Azure management to on-premises and other clouds."
      },
      {
        "q": "What does infrastructure as code help achieve?",
        "options": [
          "Consistent, repeatable deployments",
          "Lower internet bandwidth",
          "Higher VM CPU speed",
          "Automatic billing discounts"
        ],
        "answer": 0,
        "explanation": "IaC makes deployments consistent and repeatable."
      },
      {
        "q": "Which layer processes every request to create or manage Azure resources?",
        "options": [
          "Azure Resource Manager",
          "Azure Advisor",
          "Azure Purview",
          "Microsoft Defender"
        ],
        "answer": 0,
        "explanation": "ARM is the management layer for all Azure requests."
      }
    ],
    [
      {
        "q": "Which service gives personalised recommendations to improve cost, security and reliability?",
        "options": [
          "Azure Advisor",
          "Azure Service Health",
          "Azure DNS",
          "Azure File Sync"
        ],
        "answer": 0,
        "explanation": "Azure Advisor provides personalised best-practice recommendations."
      },
      {
        "q": "Which Azure Monitor feature monitors performance of a web application?",
        "options": [
          "Application Insights",
          "Log Analytics only",
          "Azure Policy",
          "Cloud Shell"
        ],
        "answer": 0,
        "explanation": "Application Insights is application performance monitoring."
      }
    ]
  ]
];