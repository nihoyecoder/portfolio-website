import ProcessCard from "./ProcessCard";
import ProcessNav from "./ProcessNav";
import styles from "./Process.module.css";

// .track supplies the scroll distance; .stage holds still (sticky) inside it
// while the cards transition. In the stacked layout both are plain blocks.
export default function ProcessStage({ steps }) {
  return (
    <div data-process-track className={styles.track}>
      <div data-process-stage className={styles.stage}>
        <ProcessNav steps={steps} />
        <div className={styles.cards}>
          {steps.map((step, index) => (
            <ProcessCard key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
