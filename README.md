# AfriHealth Household — Data-Sovereign Family Health PWA

> Built according to specifications in [`BluePrint.md`](file:///home/prantik/Downloads/Sei/BluePrint.md).

AfriHealth is a responsive, local-first web application engineered specifically for maternal, infant, and multi-generational household health management in resource-constrained environments. It runs 100% offline, features client-side optical character recognition (OCR) for physical paper prescriptions and clinic cards, and generates cryptographically verifiable offline Emergency ICE (In Case of Emergency) passes.

---

## 📱 Mobile-First Architecture & Mobile App Readiness

The application has been engineered from the ground up to be **fully responsive** and **easily convertible into native iOS and Android apps**:

1. **Touch Targets & Viewport**: All touch targets adhere to the `--min-tap-target: 48px` standard. Full support for notch and home indicators via `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
2. **PWA Enabled**: Comes with [`public/manifest.json`](file:///home/prantik/Downloads/Sei/public/manifest.json) and a Service Worker ([`public/sw.js`](file:///home/prantik/Downloads/Sei/public/sw.js)) allowing direct installation to home screens on Android and iOS without an app store account.
3. **Turnkey Native Mobile Conversion via Capacitor**:
   ```bash
   npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
   npx cap init AfriHealth com.afrihealth.app
   npm run build
   npx cap add android
   npx cap add ios
   npx cap open android
   ```
   No UI rewrite is required—every screen, drawer, modal, and camera capture interface maps directly into native WebViews.

---

## 🚀 Key Modules & Screen Implementation

### 1. Household Command Hub ([`DashboardView.jsx`](file:///home/prantik/Downloads/Sei/src/components/DashboardView.jsx))
* **Real-Time Offline Status**: Dynamic badge displaying `"Synced 4m ago"` / `"Offline (Local Safe)"`.
* **Urgent Action Callouts with Regional TTS Audio**: Urgent alerts for pending child vaccines and medication refills. Adjacent audio button speaks alerts aloud in English, Hausa, Yoruba, Igbo, or Swahili cadence via the Web Speech API.
* **Horizontal Family Avatar Ribbon**: Avatars with active glow and status indicators (Green: up to date; Amber: vaccine/clinic action due; Red: chronic regimen). Persistent `(+) Add Member` button with full clinical intake modal.
* **Continuous Medical Stream**: Real-time searchable history of clinic prescriptions, lab investigations, and pharmacy receipts.

### 2. High-Yield Document Capture ([`DocumentCaptureView.jsx`](file:///home/prantik/Downloads/Sei/src/components/DocumentCaptureView.jsx))
* **Paper-to-Structure OCR**: Real-time viewfinder with corner anchors and edge contrast binarization.
* **Instant Regex Parsing**: Auto-detects dosage frequencies (`bd`, `tds`, `nocte`, `prn`), pharmaceutical brands (Coartem, Metformin, Amlodipine), currencies (`₦`, `GH₵`, `KSh`, `$`), and clinic names.
* **Confidence Highlighting**: Displays extraction accuracy score (Green: high confidence; Amber: manual review).
* **8-Second Voice Annotation**: Attach a quick voice note directly to any digitized physical record.
* **Test Presets**: One-click simulators for clinic prescriptions, hospital cards, and lab slips.

### 3. Family Health Tree & Genetic Risk Map ([`FamilyTreeRiskView.jsx`](file:///home/prantik/Downloads/Sei/src/components/FamilyTreeRiskView.jsx))
* **Interactive SVG Pedigree Lineage Chart**: Responsive 3-generation family tree (Grandparents → Parents → Offspring) tracking inherited traits.
* **Trait Matching Matrix (Pre-Marital Analyzer)**: Calculates Mendelian probability percentages for Sickle Cell Anemia (`SS`, `AS`, `AA`, `AC`) between two partners.
* **Hereditary Clustering Warnings**: Automatically detects multi-generational clustering of hypertension and diabetes with clinical lifestyle guidance.

### 4. Maternal & Child Health (MCH) Portal ([`MCHPortalView.jsx`](file:///home/prantik/Downloads/Sei/src/components/MCHPortalView.jsx))
* **WHO Expanded Programme on Immunization (EPI) Ladder**: Interactive milestone checklist (BCG, OPV 0, Penta 1/2/3, PCV, Rota, Vitamin A, Measles 1) with audio guidance and clinic days.
* **WHO Weight-for-Age Growth Curve**: Visual growth curve plotting the child's weight against the WHO 50th percentile reference line.
* **MUAC Malnutrition Strip Tracker**: Simplified logging using Green (>12.5cm), Yellow (11.5–12.5cm), and Red (<11.5cm urgent) color bands.

### 5. Out-of-Pocket Expense & Cash Ledger ([`ExpenseLedgerView.jsx`](file:///home/prantik/Downloads/Sei/src/components/ExpenseLedgerView.jsx))
* **Spend Hero**: Tracks 100% self-funded cash healthcare expenditures.
* **Monthly Budget Cap Progress Bar**: Alerts caretakers when out-of-pocket spending nears or exceeds the monthly household threshold.
* **Category Breakdown Graph**: Horizontal bar charts dividing costs across Medications, Lab Tests, Clinic Consultations, and Traditional/Unregistered Providers.

### 6. Emergency ICE Card System ([`EmergencyICECard.jsx`](file:///home/prantik/Downloads/Sei/src/components/EmergencyICECard.jsx))
* **High-Contrast Emergency Triage Card**: Blood-red header banner (`#BE123C`), blood group displayed in 48pt bold type, vital drug allergies highlighted in danger badges.
* **High-Density Offline QR Pass**: Real QR code generated completely on-device containing the base64-encoded encrypted JSON record for triage nurses and first responders.
* **One-Touch Speed Dial**: Direct `tel:` protocol dialer for the primary household contact.

### 7. Data Sovereign Export & NDPR Protocol ([`DataExportModal.jsx`](file:///home/prantik/Downloads/Sei/src/components/DataExportModal.jsx))
* **Standalone Offline HTML Medical Pass**: Bundles all records into a single `.html` file viewable on any feature phone, computer, or clinic terminal without internet.
* **JSON Backup & Restore**: Full peer-to-peer data export and import for seamless phone migrations.
* **Strict NDPR Compliance**: Declares zero cloud lock-in with on-device AES-256 key storage.

---

## 💻 Running the App

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build
npm run build

# 4. Preview production build
npm run preview -- --port 3000 --host
```
