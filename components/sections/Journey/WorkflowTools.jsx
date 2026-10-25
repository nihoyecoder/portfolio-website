import Image from "next/image";
import { workflow } from "@/data/journey";
import { publicFileExists } from "@/lib/assets";
import styles from "./Journey.module.css";

const caption = "font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted";

// "What I use in my workflow" — tools in the order work moves from design to
// code. Each tile shows the official logo once its SVG exists in /public,
// otherwise the tool's name.
export default function WorkflowTools() {
  return (
    <div data-journey-workflow className={styles.workflow}>
      <h3 data-journey-workflow-heading className="text-lg font-medium tracking-[-0.02em]">
        {workflow.heading}
      </h3>

      <div className="mt-5 inline-flex max-w-full flex-col gap-3">
        <ul className={styles.tools}>
          {workflow.tools.map((tool) => {
            const hasIcon = publicFileExists(tool.icon);
            return (
              <li
                key={tool.name}
                data-journey-tool
                data-placeholder={hasIcon ? undefined : ""}
                className={styles.tool}
              >
                {hasIcon ? (
                  <>
                    <Image src={tool.icon} alt={tool.name} width={28} height={28} unoptimized />
                    <span aria-hidden="true" className={styles.tip}>
                      {tool.name}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-medium tracking-[-0.01em]">{tool.name}</span>
                )}
              </li>
            );
          })}
        </ul>

        <p data-journey-flow aria-hidden="true" className={`flex items-center gap-3 ${caption}`}>
          <span>{workflow.from}</span>
          <span className={styles.flowLine} />
          <span>{workflow.to}</span>
        </p>
      </div>
    </div>
  );
}
