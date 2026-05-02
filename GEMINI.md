# Cube Solver - Project Context

## 1. Project Objective
A 3D Rubik's Cube simulator and solver built with React and Three.js. The application allows users to interact with a virtual 3D cube, perform rotations, and visualize the solving process.

## 2. Tech Stack
- **Frontend Framework:** [React 19](https://react.dev/)
- **3D Rendering:** [Three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) and [@react-three/drei](https://github.com/pmndrs/drei)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Deployment:** [Firebase](https://firebase.google.com/)

## 3. Naming Conventions
- **Components:** PascalCase (e.g., `RubiksCube.tsx`, `HistoryPanel.tsx`).
- **Hooks:** camelCase with `use` prefix (e.g., `useCubeStore.ts`).
- **Utils/Logic:** camelCase (e.g., `cubeLogic.ts`).
- **Styles:** lowercase with kebab-case (e.g., `global.css`).
- **Directories:** PascalCase for component folders, camelCase for others (e.g., `src/components/Cube/`, `src/utils/`).

## 4. How to Run Tests
*Note: Testing framework is not yet explicitly configured in `package.json`. Standard commands for future implementation:*
- `npm test` (once configured)
- `npm run lint` to run ESLint checks.

## 5. Style Guide
- **Functional Components:** Prefer `const Component: React.FC = () => { ... }`.
- **Styling:** Vanilla CSS for global styles. Component-specific styling via Three.js props or global CSS classes.
- **State:** Use Zustand for global cube state and UI themes. Local state (`useState`) for component-specific UI logic (e.g., animation progress).
- **TypeScript:** Strict typing preferred. Avoid `any`. Define interfaces for state and data structures in their respective files.
- **3D Scene:** Utilize R3F (React Three Fiber) declarative patterns. Keep geometry and material logic clean within cubie components.

## 6. Directory Structure
- `src/components`: UI and 3D components organized by feature.
- `src/store`: Global state management using Zustand.
- `src/styles`: Global CSS files.
- `src/utils`: Mathematical and logical helpers for Rubik's Cube rotations and solvers.
- `public`: Static assets (icons, favicons).
