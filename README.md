<div align="center">
  <h1>🧊 Virtual Cube Solver</h1>
  <p><strong>A 3D Rubik's Cube Simulator and Solver built with React & Three.js</strong></p>

  <p>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" /></a>
  </p>
  <p>
    <a href="https://github.com/craudinmoreira/cube-solver/actions/workflows/ci.yml"><img src="https://github.com/craudinmoreira/cube-solver/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
    <a href="https://github.com/craudinmoreira/cube-solver/actions/workflows/codeql.yml"><img src="https://github.com/craudinmoreira/cube-solver/actions/workflows/codeql.yml/badge.svg" alt="CodeQL" /></a>
    <a href="https://github.com/craudinmoreira/cube-solver/releases"><img src="https://img.shields.io/github/v/release/craudinmoreira/cube-solver" alt="Release" /></a>
  </p>
  <p><a href="https://virtual-cube-solver.web.app"><strong>▶ Open the app</strong></a></p>
</div>

---

## 🎯 Overview

Virtual Cube Solver is an interactive, browser-based 3D Rubik's Cube experience. Whether you want to practice your algorithms, learn how the cube moves, or input a state to visualize a solution sequence, this application provides a smooth, animated, and intuitive interface.

## ✨ Key Features

- **🎮 Interactive 3D Cube:** Freely rotate the camera and inspect the cube from any angle using mouse or touch controls.
- **🔄 Standard Move Notation:** Execute classic Rubik's cube notation moves (e.g., `U`, `R'`, `F2`, `M`).
- **📐 Extended Moves:** Full support for face moves, slice moves (`M`, `E`, `S`), wide moves (`u`, `r`), whole cube rotations (`X`, `Y`, `Z`), and 270-degree reverse rotations (`R3`, `U3`, `B1`, etc.).
- **🎬 Smooth Animations:** Fluid layer rotations with adjustable animation speeds.
- **📝 History & Undo:** Keep track of every move you make and easily undo mistakes.
- **🎨 Custom State Input:** Input a custom cube state string (compatible with Python's `rubik.cube` library) to instantly set the cube.
- **🚀 Sequence Execution:** Paste a sequence of moves (e.g., `R U R' U'`) and watch the cube execute them step-by-step.
- **🏷️ Face Labels:** Toggle visual indicators for Up, Down, Left, Right, Front, and Back faces to help beginners orient themselves.

---

## ⌨️ Controls & Notation

The application supports standard Singmaster notation:

| Move Type | Examples | Description |
| :--- | :--- | :--- |
| **Basic Faces** | `U`, `D`, `R`, `L`, `F`, `B` | 90° clockwise rotation of the respective face. |
| **Inverses** | `U'`, `R'`, `F'` | 90° counter-clockwise rotation. (Also accepts `i` suffix like `Ri`). |
| **Double / Triple** | `U2`, `R2`, `B3`, `L1` | 180° rotation (`2`) or 270°/90° alias rotations (`3`, `1`). |
| **Slices** | `M`, `E`, `S` | Inner slice rotations. |
| **Wide Moves** | `u`, `r`, `f` | Rotate two layers at once. |
| **Cube Rotations** | `X`, `Y`, `Z` | Rotate the entire cube in 3D space. |

---

## 🛠️ Tech Stack

- **Frontend:** [React 19](https://react.dev/)
- **3D Rendering:** [Three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) & [@react-three/drei](https://github.com/pmndrs/drei)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Styling:** Vanilla CSS
- **Tooling:** Vite, TypeScript, ESLint, Vitest, Playwright
- **Hosting:** Firebase Hosting (CSP, keyless OIDC deploys)

---

## 🚀 Running Locally

```bash
git clone https://github.com/craudinmoreira/cube-solver.git
cd cube-solver
nvm install && npm install   # also installs the git hooks
npm run dev                  # http://localhost:5173
```

| Task | Command |
| :--- | :--- |
| Unit tests (+ coverage) | `npm run test:coverage` |
| E2E (Playwright) | `npm run test:e2e` or `npm run test:e2e:docker` |
| Lint / types | `npm run lint` · `npm run typecheck` |
| Build + bundle budget | `npm run build && npm run size` |

---

## 🧭 Development

Every change goes through a pull request with a required quality gate (lint, types, tests with a coverage floor, E2E under the production CSP, bundle budget, secret scanning, dependency audit, CodeQL). Merges land on a staging channel; production ships only from a reviewed release. Release notes are written in Portuguese for users and shown in the app.

- [`AGENTS.md`](AGENTS.md): project rules for people and AI agents
- [`CONTRIBUTING.md`](CONTRIBUTING.md): how to contribute
- [`docs/ai-workflow.md`](docs/ai-workflow.md): AI-assisted development
- [`docs/deploy.md`](docs/deploy.md): deploys and self-hosted runner
- [`docs/releases.md`](docs/releases.md): releases and release notes
- [`SECURITY.md`](SECURITY.md): security policy
