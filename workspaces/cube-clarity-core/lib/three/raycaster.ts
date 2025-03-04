import {
  type Camera,
  type Object3D,
  type Object3DEventMap,
  Raycaster,
  type Scene,
  Vector2,
} from "three";
import { RubikCubeGroup } from "./RubikCubeGroup.ts";

/**
 * @param canvas
 * @param event
 */
export const getMouseoverRubikCubeGroup = (
  scene: Scene,
  camera: Camera,
  canvas: HTMLCanvasElement,
  event: MouseEvent,
): null | RubikCubeGroup => {
  const rect = canvas.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const pointer = new Vector2(
    (mouseX / canvas.clientWidth) * 2 - 1,
    -(mouseY / canvas.clientHeight) * 2 + 1,
  );

  const ray = new Raycaster();
  ray.setFromCamera(pointer, camera);

  const intersections = ray.intersectObjects(scene.children);

  for (const intersection of intersections) {
    let object: Object3D<Object3DEventMap> | null = intersection.object;

    while (true) {
      if (!object) return null;

      if (object instanceof RubikCubeGroup) return object;

      object = object.parent;
    }
  }

  return null;
};
