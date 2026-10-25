import { redirect } from "next/navigation";

// No work index page yet: /work (the header's "Work" link, or a trimmed case
// study URL) leads to Selected Work on the home page. Replace this file with
// a real page whenever one exists.
export default function WorkIndexPage() {
  redirect("/#work");
}
