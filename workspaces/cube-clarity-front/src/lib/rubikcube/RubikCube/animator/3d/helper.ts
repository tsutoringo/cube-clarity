import { Euler, MathUtils, Quaternion, Vector3, Vector3Like } from "three";

export const axisToVector = (axis: "x" | "y" | "z"): Vector3 => {
  switch (axis) {
    case "x":
      return new Vector3(1, 0, 0);
    case "y":
      return new Vector3(0, 1, 0);
    case "z":
      return new Vector3(0, 0, 1);
  }
};

/**
 * ワールド座標のY軸で回転させる。
 * @param beforeRotation 元のオイラー角
 * @param axis 軸
 * @param degre 回転量
 */
export const rotateByWorldAxis = (
  beforeRotation: Vector3Like,
  axis: "x" | "y" | "z",
  degree: number,
): Vector3Like => {
  const vector3Axis = axisToVector(axis);

  const rotation = new Quaternion();
  rotation.setFromAxisAngle(vector3Axis, MathUtils.degToRad(degree));

  rotation.clone();

  const quaternion = new Quaternion().setFromEuler(
    new Euler(
      MathUtils.degToRad(beforeRotation.x),
      MathUtils.degToRad(beforeRotation.y),
      MathUtils.degToRad(beforeRotation.z),
    ),
  )
    .premultiply(rotation);

  const eular = new Euler().setFromQuaternion(quaternion);

  return {
    x: MathUtils.radToDeg(eular.x),
    y: MathUtils.radToDeg(eular.y),
    z: MathUtils.radToDeg(eular.z),
  };
};
