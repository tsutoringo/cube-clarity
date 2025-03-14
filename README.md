# Cube Clarity

## Requirements
- (Deno https://deno.com/): v2.2.3
  - Install `irm https://deno.land/install.ps1 | iex`
- Python
- OpenCV

## Setup
スキャン側起動
```shell
cd workspaces/cube-clarity-scan-rubik-cube
pip install -r requirements.txt
```

フロント側
[Release](https://github.com/tsutoringo/cube-clarity/releases/tag/0.0.1)からcube-clarity.exeをダウンロードして起動して表示されたURLにアクセスして下さい。

## Stacks

- フロントエンド
  -  Runtime: Deno
    - LSPを除く
    - Package Manager
    - Formatter
    - Linter
    - Monorepo
    - Runtime
  - TypeScript
  - Vite
    - Bundler
    - ライブラリビルドにも使用
  - React
  - CSS Modules
    - sassでやりたい。
  - Three.js
    - フロントのルービックキューブ表示で使用
    - Reactで直接使うには少し相性が悪いので以下を使用
      - @react-three/fiber
      - @react-three/drei
- スキャン
  - 初期はPython + Flaskで実装
  - 余裕であればJS or C or C++でやりたい。
    - 要はWASMなどを利用してクライアントサイドで処理をしたい。
