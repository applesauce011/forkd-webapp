import type { Metadata } from "next";
import { HelpMePickClient } from "@/components/help-me-pick/HelpMePickClient";

export const metadata: Metadata = {
  title: "Help Me Pick",
  description: "Can't decide what to cook? Let Fork'd surprise you with a random recipe.",
};

export default function HelpMePickPage() {
  return <HelpMePickClient />;
}
