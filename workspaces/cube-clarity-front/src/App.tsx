import { useEffect, useState } from "react";
import { AlgorithmStep } from "./pages/Algorithm/AlgorithmStep";
import { Home } from "./pages/Home/Home";
import { Screen } from "./layouts/Screen/Screen";

export type ScreenStatus = "none" | "start" | "scan" | "load" | "algorithm";
export type RubikCubeData = {};

const App = () => {
  const [screenStatus, setScreenStatus] = useState<ScreenStatus>("none");

  useEffect(() => {
    setScreenStatus("start");
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

export default App;
