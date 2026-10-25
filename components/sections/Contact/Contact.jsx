import { cal, contactDetails } from "@/lib/config/contact";
import ContactExperience from "./ContactExperience";
import ContactIdentity from "./ContactIdentity";
import styles from "./Contact.module.css";

// The closing section: a stable identity column (heading, portrait, mode
// switch) beside a panel that is either the message form or Cal.com booking.
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className={styles.root}>
      <div className={styles.container}>
        <ContactExperience identity={<ContactIdentity />} cal={cal} email={contactDetails.email} />
      </div>
    </section>
  );
}
