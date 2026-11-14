# CASEVERSE
> *"Every Case Has a Different Truth."*

CASEVERSE is a casual, procedural 2D browser detective mystery game with educational Artificial Intelligence features. The player steps into the shoes of an investigator solving randomly generated mysteries across three distinct eras, while exploring three fundamental AI algorithms operating directly on live crime scene data.

---

## 🌟 Core Features

- **Three Randomized Historical Eras**:
  - **Victorian Era (1800–1900)**: Classic gaslit London aesthetics, handwritten telegrams, pocket watches, and mechanical locks.
  - **Modern Era (2000–2026)**: High-tech metropolitan crimes, CCTV footage, encrypted smartphones, biometric scans, and bank records.
  - **Future Era (2100–2300)**: Cyberpunk space-station mysteries, holographic terminals, neural implants, and nanite phages.
- **Seeded Deterministic Generation**:
  - Mulberry32 PRNG ensures every case has a unique, copyable `CV-XXXXXXXX` seed and generator version (`v1.2.0`). Sharing a seed reproduces the exact same case.
- **Interactive Weighted Probabilities**:
  - Live probability distributions for Eras, World Modes, and Item Rarities with interactive sliders and "Restore Defaults".
- **Turn-Based Crisis Mode**:
  - Danger meters, environmental emergencies, and high-stakes tactical choices affecting case survival.
- **Four Unique Suspects per Case**:
  - Diverse backgrounds, psychological traits, stress & trust metrics, hidden secrets, and dynamic interrogations.
- **Interactive Crime Scene Investigation**:
  - 5–8 themed rooms per era with interactive hotspots for *Inspect*, *Talk*, *Collect*, and *Analyze* actions.
- **Evidence Confrontation Mechanic**:
  - Challenge suspect statements directly with discovered clues to break fabricated alibis.
- **Guaranteed Solvability & Story Consistency**:
  - Automated constraint validator enforces $\ge 3$ essential clues, coherent motives, valid timeline trajectories, and logical misleading clue explanations.
- **Progressive 3-Level Hint System**:
  - Contextual investigative hints balancing guidance against final score deductions.
- **Three Distinct Outcomes**:
  - **Outcome 1 (Flawless Deduction)**: Accused the true culprit with $\ge 3$ essential clues verified.
  - **Outcome 2 (Partial Match / Lucky Guess)**: Accused the true culprit without sufficient corroborating proof.
  - **Outcome 3 (False Accusation)**: Accused an innocent citizen, allowing the real culprit to escape.
- **AI Laboratory (3 Genuine Algorithms)**:
  1. **Adversarial Search (Minimax + Alpha-Beta Pruning)**: Detective utility maximization against strategic culprit counter-actions with live node-pruning counts.
  2. **Probabilistic Reasoning (Bayesian Networks)**: Exact inference over latent binary factors (*Motive, Opportunity, Physical, Timeline, Digital Access*), updating uniform priors ($0.25$) into normalized posteriors summing to $1.0$.
  3. **Sequential Timeline Analysis (HMM + Viterbi)**: Dynamic programming trellis decoding the most probable chronological room trajectory of suspects based on temporal forensic evidence.
- **Bilingual Localization**:
  - Complete support for Kazakh (default) and English.
- **100% Client-Side**:
  - Zero external APIs, zero databases, zero runtime dependencies. All logic runs in the browser with persistent `localStorage`.

---

## 🛠️ Technologies

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React icons
- **Build Tool**: Vite 8
- **Audio**: Web Audio API Sound Synthesizer (zero external audio files)
- **Persistence**: Browser `localStorage` (up to 50 archived completed cases)

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher, v20 LTS recommended)
- npm (v9 or higher)

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/USERNAME/caseverse.git
cd caseverse
npm install
```

### Local Development
Start the local development server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### Running Tests
Execute the comprehensive unit test suite (validates algorithms, 100-seed batches, determinism, and full gameplay simulation):
```bash
npm test
```

### Production Build
Build static assets for production:
```bash
npm run build
```
The compiled static website will be created in the `dist/` directory.

### Preview Production Build
Preview the built application locally:
```bash
npm run preview
```

---

## 🌐 GitHub Pages Deployment

The application is completely static and pre-configured for deployment to GitHub Pages.

### Automated Deployment via GitHub Actions
A complete workflow is provided in `.github/workflows/deploy.yml`:
1. Push your repository to GitHub (`main` branch).
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Pushing commits to `main` or triggering **workflow_dispatch** in the Actions tab will automatically test, build, and deploy the application.

### Configuring Base Path
By default, the Vite configuration uses `/caseverse/` in GitHub Actions for `https://USERNAME.github.io/caseverse/`.

If your repository has a different name, or if you deploy to a custom domain:
- **Different repository name** (e.g. `https://USERNAME.github.io/my-detective-game/`):
  Set `VITE_BASE_PATH` in `.github/workflows/deploy.yml` or build command:
  ```bash
  VITE_BASE_PATH=/my-detective-game/ npm run build
  ```
- **Custom domain / User root site** (e.g. `https://USERNAME.github.io/` or `https://mycaseverse.com/`):
  Set `VITE_BASE_PATH` to `/`:
  ```bash
  VITE_BASE_PATH=/ npm run build
  ```

---

## 🧠 Educational AI Laboratory Notes

CASEVERSE includes an interactive laboratory demonstrating real mathematical models of artificial intelligence:
- **Minimax with Alpha-Beta Pruning**: Simulates turn-based adversarial game trees. As the detective gathers evidence (MAX node), the culprit chooses strategic counter-actions (MIN node). Alpha-Beta pruning avoids exploring branches that cannot influence the final decision.
- **Bayesian Networks**: Uses Bayes' Theorem to compute posterior probability $P(\text{Culprit}_i \mid \text{Evidence})$:
  $$P(\text{Culprit}_i \mid \mathbf{E}) = \frac{P(\text{Culprit}_i) \prod_k P(E_k \mid \text{Culprit}_i)}{\sum_j P(\text{Culprit}_j) \prod_k P(E_k \mid \text{Culprit}_j)}$$
- **Hidden Markov Models (HMM) & Viterbi Algorithm**: Models hidden suspect locations as Markovian states and temporal evidence as emissions. The Viterbi algorithm uses dynamic programming with recurrence:
  $$V_{t}(j) = \max_i \left( V_{t-1}(i) \cdot A_{ij} \right) \cdot B_j(y_t)$$
  to reconstruct the most probable chronological path.

---

## 📄 License
Apache-2.0
