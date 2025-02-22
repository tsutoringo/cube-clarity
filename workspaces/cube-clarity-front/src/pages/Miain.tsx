import { useEffect, useMemo, useState } from "react";
import { Home } from "./Home/Home";
import { Screen } from "@layouts/Screen/Screen";
import { AlgorithmSteps } from "./Algorithm/AlgorithmSteps";
import { useLocation, useNavigate } from "react-router";
import { RubikCube } from "@lib/rubikcube/RubikCube/RubikCube";

export type ScreenStatus = "none" | "start" | "scan" | "load";
export type RubikCubeData = null;

export const Main = () => {
  const [screenStatus, setScreenStatus] = useState<ScreenStatus>("none");
  const navigator = useNavigate();

  const rawRubikCube = useLocation().hash.replace("#", "");
  const loadedRubikCubeResult = useMemo(
    () => RubikCube.decodeBase64(rawRubikCube),
    [rawRubikCube],
  );

  useEffect(() => {
    setScreenStatus("start");
  }, []);

  const setRubikCube = () => {
    navigator({
      hash: "AAAAAAERERERIiIiIiMzMzMzREREREVVVVVV",
    });
  };

  const handleScanCRubikCubeComplete = (_rubikCube: RubikCubeData) => {
    setScreenStatus("load");
    // 解法アルゴリズムを実行

    setTimeout(() => {
      setRubikCube();
      setScreenStatus("scan");
    }, 5000);
  };

  return (
    <>
      <Screen>
        {loadedRubikCubeResult.match(
          (decodedRubikCube) => (
            <AlgorithmSteps startCube={decodedRubikCube} displaying />
          ),
          () => (
            <>
              <Home.StartAnimationPage
                displaying={screenStatus === "start"}
                onStartEnd={() => setScreenStatus("scan")}
              />
              <Home.ScanPage
                displaying={screenStatus === "scan"}
                onScanComplete={(data) => handleScanCRubikCubeComplete(data)}
              />
              <Home.LoadingPage
                displaying={screenStatus === "load"}
              />
            </>
          ),
        )}
      </Screen>
    </>
  );
};
