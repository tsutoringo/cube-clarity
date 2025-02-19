import { useEffect, useState } from "react";
import { Home } from "./Home/Home";
import { Screen } from "../layouts/Screen/Screen";
import { AlgorithmStep } from "./Algorithm/AlgorithmStep";

export type ScreenStatus = "none" | "start" | "scan" | "load" | "algorithm";
export type RubikCubeData = null;

export const Main = () => {
  const [screenStatus, setScreenStatus] = useState<ScreenStatus>("none");

  useEffect(() => {
    setScreenStatus("algorithm");
  }, []);

  const handleScanCRubikCubeComplete = (_rubikCube: RubikCubeData) => {
    setScreenStatus("load");
    // 解法アルゴリズムを実行
    setTimeout(() => {
      setScreenStatus("algorithm");
    }, 10000);
  };

  return (
    <>
      <Screen>
        <Home.StartAnimationPage
          displaying={screenStatus === "start"}
          onStartEnd={() => setScreenStatus("scan")}
        />
        <Home.ScanPage
          displaying={screenStatus === "scan"}
          onScanComplete={(data) => handleScanCRubikCubeComplete(data)}
        />
        <AlgorithmStep
          displaying={screenStatus === "algorithm"}
        />
        <Home.LoadingPage
          displaying={screenStatus === "load"}
        />
      </Screen>
    </>
  );
};
