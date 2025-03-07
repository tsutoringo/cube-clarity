import { useEffect, useMemo, useState } from "react";
import { Home } from "./Home/Home.tsx";
import { Screen } from "@layouts/Screen/Screen.tsx";
import { AlgorithmSteps } from "./Algorithm/AlgorithmSteps.tsx";
import { useLocation, useNavigate } from "react-router";
import { RubikCube } from "@cube-clarity/core";
import { detectCube } from "@lib/detectFetch.ts";

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

  const handleStartScanCRubikCube = () => {
    setScreenStatus("load");

    // 解法アルゴリズムを実行
    detectCube().then((reesult) => {
      reesult.match(
        (cubeState) => {
          const cubeEncoded = new RubikCube(cubeState).encodeBase64();

          navigator({
            hash: cubeEncoded,
          });
        },
        (error) => {
          console.error(error);
        },
      );
    }).finally(() => {
      setScreenStatus("scan");
    });
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
                onScanStart={() => handleStartScanCRubikCube()}
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
