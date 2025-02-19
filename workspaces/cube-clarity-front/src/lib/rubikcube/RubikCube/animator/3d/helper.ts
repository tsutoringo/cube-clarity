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
 * @param degree 回転量
 */
export const rotateByWorldAxis = (
  beforeQuaternion: Quaternion,
  axis: "x" | "y" | "z",
  degree: number,
): Quaternion => {
  const vector3Axis = axisToVector(axis);

  const rotation = new Quaternion();
  rotation.setFromAxisAngle(vector3Axis, MathUtils.degToRad(degree));

  return beforeQuaternion.clone().premultiply(rotation);
};
