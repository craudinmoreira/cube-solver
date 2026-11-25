import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { quatFromAxisAngle, quatMultiply, quatNormalize, rotateVec3, roundVec3, type Quat, type Vec3 } from './quat'

// Referência: os resultados têm de bater com o three.js, que a lógica usava antes.
const angles = [-Math.PI * 1.5, -Math.PI / 2, Math.PI / 2, Math.PI, 0.3]
const axes: Vec3[] = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0.6, 0.8, 0]]

const close = (a: number[], b: number[]) => a.forEach((v, i) => expect(v).toBeCloseTo(b[i], 12))

describe('quat (equivalência com three.js)', () => {
  it.each(axes.flatMap((axis) => angles.map((angle) => [axis, angle] as const)))(
    'eixo %j, ângulo %d',
    (axis, angle) => {
      const ref = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(...axis), angle)
      const q = quatFromAxisAngle(axis, angle)
      close(q, ref.toArray())

      const v: Vec3 = [1, -2, 0.5]
      close(rotateVec3(v, q), new THREE.Vector3(...v).applyQuaternion(ref).toArray())

      const other: Quat = [0.1, 0.2, 0.3, 0.9]
      const refOther = new THREE.Quaternion(...other)
      close(quatMultiply(q, other), ref.clone().multiply(refOther).toArray())
    },
  )

  it('normaliza e trata o quatérnio nulo', () => {
    close(quatNormalize([0, 0, 0, 2]), [0, 0, 0, 1])
    expect(quatNormalize([0, 0, 0, 0])).toEqual([0, 0, 0, 1])
  })

  it('roundVec3 elimina -0', () => {
    expect(Object.is(roundVec3([-0.0000001, 0.9999999, -1])[0], 0)).toBe(true)
    expect(roundVec3([-0.0000001, 0.9999999, -1])).toEqual([0, 1, -1])
  })
})
