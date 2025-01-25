import cube from "../../assets/CUBE.svg";
import clarity from "../../assets/CLARITY.svg";
import rectangle from "../../assets/Rectangle.svg";
import styles from "./Home.module.css";
import { Loading } from "../../components/Loading/Loading";
import { Screen } from "../../layouts/Screen/Screen";

export const Home = () => {
  return (
    <Screen>
      {StartAnimation()}
      {Homepage()}
      {/* {Loading()} */}
    </Screen>
  );
};

const StartAnimation = () => {
  return (
    <div className={styles.flex}>
      <p className={styles.alignRight}>
        <img src={cube} alt="" className={styles.slideInBottom1} />
      </p>
      <p className={styles.alignLeft}>
        <img src={clarity} alt="" className={styles.slideInBottom2} />
      </p>
    </div>
  );
};

const Homepage = () => {
  return (
    <div className={styles.homeSpace}>
      <div className={styles.titleLogo}>
        <p>
          <img src={cube} alt="" className={styles.cubeClarity} />
        </p>
        <p>
          <img src={clarity} alt="" className={styles.cubeClarity} />
        </p>
      </div>
      <p>
        <img src={rectangle} alt="" className={styles.square} />
      </p>
      <p className={styles.text}>
        <span className={styles.spanHeader}>スキャンして、解こう！</span>
        <br />
        ルービックキューブを読み取って、<br />
        最速で解く方法を見つけよう
      </p>
      <div className={styles.circle}></div>
    </div>
  );
};
