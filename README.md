# MULWA — Clinical Exam Portal

**Author:** MULWA (<martinmulwa95@gmail.com>)  
**Version:** 4.2.0  

A high-yield, distraction-free examination revision and self-assessment platform built specifically for medical, clinical, and nursing candidates (including Kenya Registered Nursing / KRCHN / KRN, End-of-Block, and Board Licensure candidates).

The portal provides structured multi-choice question (MCQ) sets, evidence-based physiological rationales, instant chromatic feedback, high-yield Short Answer Questions (SAQs) with structured mnemonic tables, real-time analytics, and an automated mistakes remediation queue.

---

## 📚 Curriculum & Question Bank Inventory

The platform organizes content modularly under **Block 1**, divided into clinical specialty units:

### 1. Trauma and Emergency Nursing (MSN 102)
* **Status:** 5 Curated Examination Papers (77 total MCQs & True/False items)
* **Examinations Included:**
  1. **April 2025 Class End of Block Exam** (`krn-block1-april2025-trauma-emergency-nursing`) — 16 Questions
  2. **September 2024 Class End of Block Exam** (`krn-block1-sept2024-trauma-emergency-nursing`) — 15 Questions
  3. **April 2024 Class End of Block Exam** (`krn-block1-april2024-trauma-emergency-nursing`) — 15 Questions
  4. **September 2023 Class End of Block Exam** (`krn-block1-sept2023-trauma-emergency-nursing`) — 15 Questions
  5. **September 2022 Class End of Block Exam** (`krn-block1-sept2022-trauma-emergency-nursing`) — 16 Questions
* **Key Topics Covered:**
  * Primary & Secondary Trauma Surveys (ABCDE protocol, cervical spine stabilization)
  * Canadian Triage and Acuity Scale (CTAS Levels 1–5 triage criteria)
  * Shock classifications: Hypovolemic, Cardiogenic, Anaphylactic, Neurogenic, and Obstructive
  * Parkland's fluid resuscitation formula for burns & Curling's stress ulcer prophylaxis
  * Basic Life Support (BLS): Adult & pediatric CPR ratios (30:2, 15:2), chain of survival, choking relief (Heimlich, back blows & chest thrusts)
  * Emergency thoracic trauma: Tension pneumothorax, open sucking chest wound 3-sided flutter valve dressing, massive hemothorax (>1500 mL)
  * Trimodal distribution of trauma deaths (first, second, and third morbidity peaks)
  * Disaster triage color codes (START immediate, delayed, minimal, expectant)

---

### 2. Respiratory Disorders (MSN 101)
* **Status:** 11 Curated Examination Papers & Practice Modules (220+ MCQs)
* **Examinations Included:**
  1. **March 2026 Class End of Block Exam**
  2. **October 2025 Class End of Block Exam**
  3. **September 2024 Class End of Block Exam**
  4. **September 2023 Class End of Block Exam**
  5. **August 2013 TNH Block 1 Exam**
  6. **July 2012 TNH Block 1 Exam**
  7. **January 2011 KRN Respiratory Exam**
  8. **January 2011 NHSON Block 1 Exam**
  9. **TNH Practice: Acute Conditions**
  10. **TNH Practice: Chronic Conditions**
  11. **TNH Practice: Traumatic Conditions**

---

### 3. High-Yield Short Answer Questions (SAQ Bank)
* **Focused 1-at-a-time revision workspace:** Instant "Reveal Solution" action.
* **Mark-Sized Model Answers:** Sized directly to allocated examiner marks with physiological rationales.
* **Evidence-Based Mnemonics:** Structured reference tables (e.g. `TUBES` for underwater seal chest drains, `MONA` for acute coronary syndrome, `SAMPLE` for trauma histories).
* **Examiner Scoring Tips:** "Ace It" callouts highlighting required clinical keywords and common errors.
* **Comprehensive Coverage (40 Total SAQs):**
  * **Respiratory Disorders (29 SAQs across 8 condition banks):**
    * Chest Drain & Underwater Seal Drainage (UWSD)
    * Bronchial Asthma & Status Asthmaticus
    * Pneumonia (Community-Acquired, Hospital-Acquired, Aspiration)
    * Chronic Obstructive Pulmonary Disease (COPD)
    * Pulmonary Tuberculosis (TB) & DOTS Regimens
    * Pleural Effusion & Thoracentesis
    * Pulmonary Embolism & DVT Prophylaxis
    * Acute Respiratory Distress Syndrome (ARDS)
  * **Trauma and Emergency Nursing (11 SAQs across 8 condition banks):**
    * Triage in the Emergency Department (Importance, MVC triage questions, Triage nurse roles)
    * Trauma Assessment & Nurse Roles (Roles in trauma response, SAMPLE secondary survey history)
    * Snake Bite (First aid, 20WBCT, hospital care, what to avoid [TICS])
    * Tension Pneumothorax (Clinical manifestations, pathophysiology, obstructive shock)
    * Burns: Emergent Phase (Airway, Parkland formula fluid resuscitation, analgesia, hypothermia prevention)
    * Seizures: First Aid (Stay/Safe/Side, 5-minute rule, recovery position)
    * Near Drowning / Submersion Injury (Hypoxia resuscitation, rewarming, 24-hour ARDS observation)
    * Organophosphate Poisoning: Atropinisation (Signs of atropinisation, anticholinergic toxidrome)

---

## 🚀 Key Architectural Features

### 1. Interactive Practice Workspace (`QuestionScreen.tsx`)
* Single-choice (A, B, C, D) and authentic True/False interactive selectors.
* Immediate chromatic validation (emerald for correct, soft red for incorrect).
* Rich explanations detailing pathophysiological mechanisms and distractor refutations.
* Bi-directional question navigation and bookmarking flags.

### 2. Mistakes Review Queue (`ReviewIncorrectScreen.tsx`)
* Questions scored below 50% are automatically logged into an ephemeral remediation queue.
* In-line retesting interface: answering correctly automatically resolves and clears the mistake item.

### 3. Session Isolation & Workstation Privacy (`storage.ts`)
* Built with `window.sessionStorage` (Schema v3).
* Ephemeral: data persists across browser refreshes and tab switches, but clears immediately when the browser tab is closed.
* Ensures zero workstation data leakage on shared nursing laboratory, hospital, and university library computers.

### 4. Results Scorecard & Academic Grading (`ResultsScreen.tsx`)
* Deterministic auto-grading with academic performance bands:
  * **Distinction:** $\ge 80\%$
  * **Credit:** $\ge 60\%$
  * **Pass:** $\ge 50\%$
  * **Needs Review:** $< 50\%$
* Breakdown by source (Original exam questions vs Derived questions).
* Plain-text clipboard export for quick note-taking.

---

## 🛠️ Tech Stack & Directory Structure

```text
├── src/
│   ├── components/         # Clean UI views (Dashboard, MCQ Bank, SAQ Bank, Results, Review)
│   ├── config/             # Constants and threshold configs
│   ├── data/
│   │   ├── block1/
│   │   │   ├── mcqs/
│   │   │   │   ├── respiratory-disorders/     # 11 Respiratory exam modules
│   │   │   │   └── trauma-and-emergency/      # 5 Trauma & Emergency exam modules
│   │   │   └── saqs/                          # Condition-based SAQ bank data
│   │   ├── papers/         # Unified papers aggregator & exports
│   │   └── validator.ts    # 9-point strict schema integrity validator
│   ├── utils/              # Scoring, chunking, and ephemeral storage utilities
│   ├── types.ts            # Domain TypeScript types
│   ├── index.css           # Tailwind CSS v4 styling
│   └── main.tsx            # Application entry point
├── DESIGN.md               # Design constitution & ergonomic vision
├── PAST_PAPER_EXTRACTION_PROMPT.md # AI OCR past paper extraction prompt
└── README.md               # Project documentation
```

---

## 💻 Development & Build Commands

```bash
# Install dependencies
npm install

# Start Vite development server (port 3000)
npm run dev

# Run TypeScript type check and linter
npm run lint

# Build production bundle
npm run build
```
