// Matemática mínima de vetores e quatérnios (mesma convenção do three.js:
// [x, y, z, w]), para a lógica do cubo não depender do Three.js inteiro, que
// assim fica só no chunk da cena 3D, carregado sob demanda.

export type Vec3 = [number, number, number];
export type Quat = [number, number, number, number];

export const AXIS_VECTORS: Record<'x' | 'y' | 'z', Vec3> = {
  x: [1, 0, 0],
  y: [0, 1, 0],
  z: [0, 0, 1],
};

/** Quatérnio de rotação de `angle` radianos em torno de um eixo unitário. */
export const quatFromAxisAngle = ([x, y, z]: Vec3, angle: number): Quat => {
  const s = Math.sin(angle / 2);
  return [x * s, y * s, z * s, Math.cos(angle / 2)];
};

/** Produto a·b (aplica b, depois a). */
export const quatMultiply = ([ax, ay, az, aw]: Quat, [bx, by, bz, bw]: Quat): Quat => [
  ax * bw + aw * bx + ay * bz - az * by,
  ay * bw + aw * by + az * bx - ax * bz,
  az * bw + aw * bz + ax * by - ay * bx,
  aw * bw - ax * bx - ay * by - az * bz,
];

export const quatNormalize = (q: Quat): Quat => {
  const length = Math.hypot(...q);
  return length === 0 ? [0, 0, 0, 1] : (q.map((v) => v / length) as Quat);
};

/** Rotaciona o vetor v pelo quatérnio q. */
export const rotateVec3 = ([vx, vy, vz]: Vec3, [qx, qy, qz, qw]: Quat): Vec3 => {
  // t = 2 * cross(q.xyz, v); v' = v + w*t + cross(q.xyz, t)
  const tx = 2 * (qy * vz - qz * vy);
  const ty = 2 * (qz * vx - qx * vz);
  const tz = 2 * (qx * vy - qy * vx);
  return [
    vx + qw * tx + qy * tz - qz * ty,
    vy + qw * ty + qz * tx - qx * tz,
    vz + qw * tz + qx * ty - qy * tx,
  ];
};

/** Arredonda para inteiros, eliminando ruído de ponto flutuante (-0.0000001 → 0). */
export const roundVec3 = (v: Vec3): Vec3 => v.map((c) => Math.round(c) || 0) as Vec3;
