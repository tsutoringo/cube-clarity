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
  resizeObserver: ResizeObserver;
  unmounted: boolean = false;
  rubikCubeGroup: Group;
  progress: number = 0;

  constructor(
    public parentElement: HTMLElement,
  ) {
    this.renderer = new WebGLRenderer({ alpha: true });

    parentElement.appendChild(this.renderer.domElement);

    this.renderer.setSize(
      parentElement.clientWidth,
      parentElement.clientHeight,
    );

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      75,
      calcAspectRatio(parentElement),
      0.1,
      1000,
    );

    this.scene.add(new AxesHelper(10));
    // this.scene.add(new GridHelper(80, 50, 0xffff00));

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(parentElement);

    this.rubikCubeGroup = new Group();
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
    this.renderer.setSize(
      this.parentElement.clientWidth,
      this.parentElement.clientHeight,
    );
    this.camera.aspect = calcAspectRatio(this.parentElement);
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.dispose();
  }

  unmount() {
    this.parentElement.removeChild(this.renderer.domElement);
    this.resizeObserver.disconnect();

    this.unmounted = true;
  }
}
