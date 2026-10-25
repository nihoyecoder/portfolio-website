import { copy, InlineList, pad } from "./CaseText";
import styles from "./CaseStudy.module.css";

// Restrained editorial grid for short items — problems, user groups,
// constraints, principles: a hairline, optional number, title and a line.
// `level` sets the item heading level when the grid sits under a subheading.
// `text` can be a line, or a list shown inline ("a · b · c").
export default function ItemGrid({ items, numbered = false, columns = 2, level = 3 }) {
  const List = numbered ? "ol" : "ul";
  const Title = `h${level}`;
  return (
    <List className={styles.items} data-columns={columns}>
      {items.map((item, i) => (
        <li key={i} data-reveal className={styles.item}>
          {numbered && <span className={`${styles.label} ${styles.itemNumber}`}>{pad(i + 1)}</span>}
          <Title className={styles.itemTitle}>{copy(item.title)}</Title>
          {Array.isArray(item.text) ? (
            <InlineList items={item.text} className={`block ${styles.itemText}`} />
          ) : (
            item.text && <p className={styles.itemText}>{copy(item.text)}</p>
          )}
        </li>
      ))}
    </List>
  );
}
