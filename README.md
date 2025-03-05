# Cube Clarity

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
