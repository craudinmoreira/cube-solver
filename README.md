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
- **Tooling:** Vite, TypeScript, ESLint
- **Hosting:** Firebase Hosting

---

## 🚀 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/virtual-cube-solver.git
   cd virtual-cube-solver
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.


