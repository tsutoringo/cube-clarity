import { HorizontalRule } from "../../components/HorizontalRule/HorizontalRule";
import { BottomDrawer } from "../../layouts/BottomDrawer/BottomDrawer";
import { Screen } from "../../layouts/Screen/Screen";
import styles from "./AlgorithmStep.module.css";

export const AlgorithmStep = () => {
  return (
    <Screen>
      <BottomDrawer.Layout
        viewBox={
          <BottomDrawer.ViewBox>
            aiue
          </BottomDrawer.ViewBox>
        }
        drawer={
          <BottomDrawer.Drawer>
            <BottomDrawer.Drawer.Title>
              ステップ1
            </BottomDrawer.Drawer.Title>
            <div>
              <p>
                白いセンターを上にして持ち、白い部分のエッジを見つけて下の層の持ってきます。
              </p>
              <p>
                エッジが同じ色のセンターの下になるように下の層を回します。
              </p>
              <p>
                その面を回転させて、エッジの部分を上に持ってきます。
              </p>
            </div>
            <HorizontalRule>アルゴリズムを見る</HorizontalRule>
          </BottomDrawer.Drawer>
        }
      />
    </Screen>
  );
};
