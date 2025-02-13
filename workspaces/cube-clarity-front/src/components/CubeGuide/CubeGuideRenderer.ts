import { WebGLRenderer, Scene, OrthographicCamera } from "three";
export class CubeGuideRenderer {
  renderer   : WebGLRenderer;
  scene      : Scene;
  camera     : OrthographicCamera;

  constructor(
    public currentRefElement: HTMLElement,
  ) {
    const width = currentRefElement?.clientWidth;
    const height = currentRefElement?.clientHeight;
    const aspect = width / height;

    const frustumSize = height;
    const left = (frustumSize * aspect) / -2;
    const right = (frustumSize * aspect) / 2;
    const top = frustumSize / 2;
    const bottom = frustumSize / -2;
    // シーンの設定
    this.scene = new Scene()
    // this.scene.add(new AxesHelper(10));

    // WebGLRendererの設定
    this.renderer = new WebGLRenderer({ alpha: true })

    // 指定要素にcanvasを格納
    currentRefElement.appendChild(this.renderer.domElement);

    // レンダラーのサイズの設定
    this.renderer.setSize(
      currentRefElement.clientWidth,
      currentRefElement.clientHeight
    )

    // カメラの定義
    this.camera = new OrthographicCamera(
      left,
      right,
      top,
      bottom,
      0.1,
      1000
    )
  }
}