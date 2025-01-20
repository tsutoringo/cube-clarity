import cube from "../../assets/CUBE.svg";
import clarity from "../../assets/CLARITY.svg";
import Rectangle from "../../assets/Rectangle.svg";
import styles from "./Home.module.css";

export const Home = () => {
  return (
    <div className={styles.window}>
      {startAnimation()}
      {homepage()}
      {loadingPage()}
    </div>
  );
};

const startAnimation = () => {
  return (
    <div id={styles.flex}>
      <p className={styles.alignRight}>
        <img src={cube} alt="" className={styles.slideInBottom1} />
      </p>
      <p className={styles.alignLeft}>
        <img src={clarity} alt="" className={styles.slideInBottom2} />
      </p>
    </div>
  );
};

const homepage = () => {
  return (
    <div className={styles.homeSpace}>
      <p>
        <img src={cube} alt="" />
      </p>
      <p>
        <img src={clarity} alt="" />
      </p>
      <p>
        <img src={Rectangle} alt="" id={styles.square} />
      </p>
      <p>
        <span className={styles.spanHeader}>スキャンして、解こう！</span>
        <br />
        ルービックキューブを読み取って、<br />
        最速で解く方法を見つけよう
      </p>
      <div className={styles.circle}>
      </div>
    </div>
  );
};

const loadingPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}></div>
      <div className={styles.content}></div>
      <div className={styles.content}></div>
      <div className={styles.content}></div>
      <div className={styles.content}></div>
    </div>
  );
};
