import { redirect } from "next/navigation";

export default function Home() {
  // Admin landing not built yet. Send everyone to sign in for now.
  redirect("/dashboard");
}
