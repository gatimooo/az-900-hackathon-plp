# AzureVibe

**A calm, focused study hub for the Microsoft Azure Fundamentals (AZ-900) exam.**

Read through short study modules, drill flashcards, take timed practice quizzes and plan your study sessions, all in one browser-based app with no sign-up and no backend.

**Live demo:** https://az-9000-hackathon.vercel.app/

> **Disclaimer:** AzureVibe is an **unofficial** study aid. It is not affiliated with, endorsed by or sponsored by Microsoft. All questions, flashcards and explanations are original and written for this project. No real exam questions and no Microsoft logos are used.

---

## About the project

This project was built solo for the **AZ-900 exam preparation hackathon** run by the Power Learn Project. The brief was to turn our own AZ-900 learning journey into a tool that helps the next learner, using AI-assisted and low-code tools.

Theme: *"Building Smarter Exam Prep Tools from Our Own Learning Journey."*

AzureVibe combines several of the suggested challenge ideas into one app:

| Hackathon idea | Where it lives in AzureVibe |
| --- | --- |
| Practice & Assessment (Smart Quiz Builder) | **Smart Quiz Builder**: timed quiz, instant feedback and an explanation for every answer |
| Memory & Revision (Flashcard Coach) | **Flashcard Coach**: 3D flip cards with a "mastered" tracker |
| Support (Study Buddy) | **Study Buddy**: plain-language study modules with a quick check after each one |
| Planning (Personal Study Planner) | **Study Planner**: schedule study sessions by topic, date and time |
| Progress (Readiness Tracker) | **Dashboard**: flashcards mastered, average quiz score and recent attempts |

## Features

- **Dashboard** with flashcards mastered, average quiz score, planned sessions and a log of recent quiz attempts.
- **Flashcard Coach**: 45 cards grouped by topic area, a flip animation, filters, previous/next controls and a *Mastered* button that is saved between visits.
- **Smart Quiz Builder**: 45 original questions (15 per topic area), a 25-minute countdown that starts only when you press *Start*, topic filters, and a clear explanation after every answer.
- **Study Buddy**: 3 learning paths and 11 modules, each with a short intro, numbered topics, an exam tip and a 2–3 question quick check. Mark modules complete and watch the overall progress bar fill.
- **Study Planner**: add and delete study sessions; they count towards your dashboard stats.
- **Light and dark themes**, remembered between visits.
- **Glass-style, minimal interface** that works on desktop and mobile, with subtle motion that switches off automatically for visitors who prefer reduced motion.
- **Private by design**: everything is stored in your own browser (`localStorage`). Nothing is sent to a server.

### Topic areas covered

1. Cloud Concepts
2. Azure Architecture & Services
3. Azure Management & Governance

## Tech stack

- Plain **HTML, CSS and JavaScript**, with no build step and no framework
- **Tailwind CSS** (via CDN) for layout utilities, plus a hand-written `style.css` for the glass design system
- **Plus Jakarta Sans** from Google Fonts
- Inline **SVG icons**, so there is no icon-font dependency
- **Browser `localStorage`** for progress, planner and theme
- Hosted on **Vercel**

## Project structure

```
az-9000-hackathon/
├── index.html      # Page layout and all five views
├── style.css       # Glass UI, theme variables, motion
├── app.js          # App logic, flashcards, quiz, planner, dashboard
├── study-data.js   # Study Buddy modules and quick-check questions
└── README.md
```

## Run it locally

No installation is needed.

1. Clone the repository:
   ```bash
   git clone https://github.com/gatimooo/az-9000-hackathon.git
   cd az-9000-hackathon
   ```
2. Open `index.html` in your browser, or serve the folder with any static server:
   ```bash
   npx serve .
   ```

You need an internet connection the first time, because Tailwind and the font load from a CDN.

## Deploy

The site is static, so any static host works. To deploy on Vercel, import the repository and keep the defaults: there is no build command and no output directory to set.

## Customising the content

All content lives in plain JavaScript objects, so you can extend it without touching the UI code.

**Flashcards and quiz questions** (in `app.js`):

```js
// Flashcard
{ category: "Cloud Concepts", term: "...", definition: "...", prompt: "..." }

// Quiz question
{ category: "Cloud Concepts", question: "...", options: ["A", "B", "C", "D"], answer: 1, explanation: "..." }
```

`answer` is the zero-based index of the correct option.

**Study Buddy modules and quick checks** (in `study-data.js`):

```js
// studyModulesData: learning path -> modules -> sections
{ title: "...", lessons: [ { title: "...", intro: "...", sections: [ { heading: "...", body: "..." } ], examTip: "..." } ] }

// studyChecks: same [path][module] order as studyModulesData
{ q: "...", options: ["..."], answer: 0, explanation: "..." }
```

**Colours:** every colour is a CSS variable at the top of `style.css`. Change `--accent` (in both the light and dark blocks) to re-theme the whole app.

## Data and privacy

AzureVibe has no accounts, analytics or backend. Progress is kept in your browser under these keys, and *Clear all progress* on the dashboard removes them:

| What | Stored in `localStorage` |
| --- | --- |
| Study Buddy progress | `azurevibe_study_buddy_v3` |
| Mastered flashcards | `azurevibe_mastered_cards` |
| Quiz history | `azurevibe_quiz_history` |
| Study planner sessions | `azurevibe_study_plans` |
| Theme | `azurevibe_theme` |

Clearing your browser data will also reset your progress.

## Content and attribution

- All study text, flashcards, quiz questions and explanations are original and written for this project.
- The topic areas follow the public AZ-900 skills outline published on Microsoft Learn. For the authoritative list of exam skills and for official training, use Microsoft Learn directly.
- Microsoft, Azure and AZ-900 are trademarks of Microsoft Corporation. They are used here only to describe the exam this tool helps learners prepare for.

## Known limitations

- This is a hackathon MVP. The question bank (45 questions) and flashcard set (45 cards) are intentionally small.
- Study Buddy content is pre-written. It does not call an AI model or answer free-form questions.
- Progress is stored per browser and per device, so it does not sync between devices.
- The app has not been validated with learners yet, so it makes no claims about exam pass rates.

## Ideas for next steps

- Grow the question bank and tag questions by individual skill for finer-grained weak-spot tracking
- Spaced repetition for flashcards you keep missing
- A study plan generated from an exam date and weak topics
- Optional AI-powered explanations for follow-up questions
- A pilot with a small group of learners to collect feedback

## Author

**Hibis Mureithi**: solo builder, product design and development.
