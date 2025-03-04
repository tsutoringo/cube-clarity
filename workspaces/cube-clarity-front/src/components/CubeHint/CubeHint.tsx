import { Tooltip } from "react-tooltip";
import styles from "./CubeHint.module.css";

interface HintProps {
  word: string;
  imageSrc: string;
}

export const CubeHint: React.FC<HintProps> = ({ word, imageSrc }) => {
  const tooltipId = `tooltip-${word.replace(/\s/g, "-")}`;

  return (
    <>
      <span
        data-tooltip-id={tooltipId}
        className={styles.cubeHint}
      >
        {word}
      </span>

      <Tooltip id={tooltipId} place="top">
        <img src={imageSrc} alt={word} width="100px" />
      </Tooltip>
    </>
  );
};
