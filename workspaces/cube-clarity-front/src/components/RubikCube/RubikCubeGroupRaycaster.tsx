import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { getMouseoverRubikCubeGroup, type RubikCubeGroup } from "@cube-clarity/core";

export const RaycasterForRubikCubeGroup = ({
  onMousemove,
  onClick,
}: {
  onMousemove?: (rubikCubeGroup: RubikCubeGroup | null) => void;
  onClick?: (rubikCubeGroup: RubikCubeGroup | null) => void;
}) => {
  const { gl, scene, camera } = useThree();

  const onMousemoveHandler = (event: MouseEvent) => {
    const result = getMouseoverRubikCubeGroup(
      scene,
      camera,
      gl.domElement,
      event,
    );

    onMousemove?.(result);
  };

  const onClickHandler = (event: MouseEvent) => {
    const result = getMouseoverRubikCubeGroup(
      scene,
      camera,
      gl.domElement,
      event,
    );

    onClick?.(result);
  };

  useEffect(() => {
    gl.domElement.addEventListener("mousemove", onMousemoveHandler);
    gl.domElement.addEventListener("click", onClickHandler);

    return () => {
      gl.domElement.removeEventListener("mousemove", onMousemoveHandler);
      gl.domElement.removeEventListener("click", onClickHandler);
    };
  }, []);

  return null;
};
