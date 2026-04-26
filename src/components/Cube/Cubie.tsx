import React from 'react';
import * as THREE from 'three';
import type { CubieState } from '../../utils/cubeLogic';

interface CubieProps {
  cubieState: CubieState;
  isAnimating: boolean;
  animatingGroupRef: React.MutableRefObject<THREE.Group | null>;
  isPartOAnimatingLayer: boolean;
}

// Cores das faces: Direita(X+), Esquerda(X-), Cima(Y+), Baixo(Y-), Frente(Z+), Trás(Z-)
const colors = {
  right: '#B90000',  // Red
  left: '#FF5900',   // Orange
  top: '#FFFFFF',    // White
  bottom: '#FFD500', // Yellow
  front: '#009B48',  // Green
  back: '#0045AD',   // Blue
  core: '#222222'    // Black/Dark Gray for inner plastic
};

export const Cubie: React.FC<CubieProps> = ({ cubieState, isPartOAnimatingLayer, animatingGroupRef }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);

  // Define as cores com base na posição inicial (id é gerado previsivelmente)
  const initX = cubieState.id % 3 === 2 ? 1 : cubieState.id % 3 === 0 ? -1 : 0;
  const initY = Math.floor((cubieState.id % 9) / 3) === 2 ? 1 : Math.floor((cubieState.id % 9) / 3) === 0 ? -1 : 0;
  const initZ = Math.floor(cubieState.id / 9) === 2 ? 1 : Math.floor(cubieState.id / 9) === 0 ? -1 : 0;

  // Os materiais do BoxGeometry no Three.js seguem a ordem: Right, Left, Top, Bottom, Front, Back
  const materials = React.useMemo(() => {
    return [
      new THREE.MeshStandardMaterial({ color: initX === 1 ? colors.right : colors.core, roughness: 0.1, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: initX === -1 ? colors.left : colors.core, roughness: 0.1, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: initY === 1 ? colors.top : colors.core, roughness: 0.1, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: initY === -1 ? colors.bottom : colors.core, roughness: 0.1, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: initZ === 1 ? colors.front : colors.core, roughness: 0.1, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: initZ === -1 ? colors.back : colors.core, roughness: 0.1, metalness: 0.1 }),
    ];
  }, [initX, initY, initZ]);

  // Posiciona a peça no grupo de animação ou no cena global
  React.useEffect(() => {
    if (meshRef.current) {
      if (isPartOAnimatingLayer && animatingGroupRef.current) {
        animatingGroupRef.current.add(meshRef.current);
      } else {
        // Volta para a cena original, mas a propriedade parent é gerenciada pelo R3F.
        // Como o R3F reconstrói o nó, isso será lidado de forma declarativa renderizando dentro ou fora do <group>.
      }
    }
  }, [isPartOAnimatingLayer, animatingGroupRef]);

  return (
    <mesh
      ref={meshRef}
      position={cubieState.position}
      quaternion={new THREE.Quaternion(...cubieState.quaternion)}
      material={materials}
    >
      {/* Box reduzido ligeiramente para dar o espaçamento entre as peças */}
      <boxGeometry args={[0.96, 0.96, 0.96]} />
      {/* Bordas pretas da peça */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.96, 0.96, 0.96)]} />
        <lineBasicMaterial color="#000000" linewidth={2} />
      </lineSegments>
    </mesh>
  );
};
