import {
  AxesHelper,
  Group,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { calcAspectRatio } from "./helper";
import type { RubikCube } from "./RubikCube/RubikCube";
import { generateRubikCubeCubeModel } from "./RubikCubeModel";

export class RubikCubeRenderer {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  unmounted: boolean = false;
  rubikCubeGroup: Group;
  progress: number = 0;

  constructor() {
    this.renderer = new WebGLRenderer({ alpha: true });

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      75,
      1 / 1,
      0.1,
      1000,
    );

    this.scene.add(new AxesHelper(10));
    // this.scene.add(new GridHelper(80, 50, 0xffff00));

    this.rubikCubeGroup = new Group();
  }

  /**
   * @param parent
   * @returns cleanup function
   */
  setParent(parent: HTMLElement) {
    parent.appendChild(this.renderer.domElement);

    this.renderer.setSize(
      parent.clientWidth,
      parent.clientHeight,
    );

    const resize = () => {
      this.renderer.setSize(
        parent.clientWidth,
        parent.clientHeight,
      );
      this.camera.aspect = calcAspectRatio(parent);
      this.camera.updateProjectionMatrix();

      this.renderer.render(this.scene, this.camera);
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(parent);

    resize();

    return () => {
      resizeObserver.disconnect();
      parent.removeChild(this.renderer.domElement);

      this.dispose();
    };
  }

  rerenderRubikCube(rubikCube: RubikCube) {
    this.scene.remove(this.rubikCubeGroup);

    const rubikCubeModel = generateRubikCubeCubeModel(rubikCube);

    this.rubikCubeGroup = rubikCubeModel;
    this.scene.add(this.rubikCubeGroup);

    this.render();

    return rubikCubeModel;
  }

  /**
   * 再レンダーをする
   */
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
  }

  dispose() {
    this.renderer.dispose();
    this.unmounted = true;
  }
}
