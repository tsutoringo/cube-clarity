import { Group, OrthographicCamera, Scene, WebGLRenderer } from "three";
import { sizeSet } from "./cubeSizeCreate";


export class CubeGuideRenderer {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: OrthographicCamera;
  resizeObserver: ResizeObserver;
  rubikCubeGroup: Group;
  unmounted: boolean = false;

  constructor(
    public currentRefElement: HTMLDivElement,
  ) {
    const sizeList = sizeSet(currentRefElement);

    // シーンの設定
    this.scene = new Scene();
    // this.scene.add(new AxesHelper(10)); // キューブにそれぞれの軸の線を追加（不要）

    // WebGLRendererの設定
    this.renderer = new WebGLRenderer({ alpha: true }); // 透明度の設定

    // 指定要素にcanvasを格納
    currentRefElement.appendChild(this.renderer.domElement);

    // レンダラーのサイズの設定
    this.renderer.setSize(
      currentRefElement.clientWidth,
      currentRefElement.clientHeight,
    );

    // カメラの定義
    this.camera = new OrthographicCamera(
      sizeList[0],
      sizeList[1],
      sizeList[2],
      sizeList[3],
      0.1,
      1000,
    );

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(currentRefElement);

    this.rubikCubeGroup = new Group();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.renderer.setSize(
      this.currentRefElement.clientWidth,
      this.currentRefElement.clientHeight,
    );
    const newSize = sizeSet(this.currentRefElement);
    this.camera.left = newSize[0];
    this.camera.right = newSize[1];
    this.camera.top = newSize[2];
    this.camera.bottom = newSize[3];

    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
  }
  unmount() {
    this.currentRefElement.removeChild(this.renderer.domElement);
    this.resizeObserver.disconnect();

    this.unmounted = true;
  }
}
