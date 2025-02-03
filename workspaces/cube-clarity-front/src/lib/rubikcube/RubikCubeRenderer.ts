import {
  AxesHelper,
  GridHelper,
  Group,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { calcAspectRatio } from "./helper";
import { RubikCube } from "./RubikCube/RubikCube";
import { generateRubikCubeCubeModel } from "./RubikCubeModel";

export class RubikCubeRenderer {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  resizeObserver: ResizeObserver;
  unmounted: boolean = false;
  rubikCubeGroup: Group;

  constructor(
    public parentElement: HTMLElement,
  ) {
    this.renderer = new WebGLRenderer();

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
    this.rubikCubeGroup = generateRubikCubeCubeModel(rubikCube);
    this.scene.add(this.rubikCubeGroup);
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

  unmount() {
    this.parentElement.removeChild(this.renderer.domElement);
    this.resizeObserver.disconnect();

    this.unmounted = true;
  }
}
