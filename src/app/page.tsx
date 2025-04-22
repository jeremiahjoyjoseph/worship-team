import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TextH2, TextLink } from "../../components/ui/typography";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <TextH2 className="text-center sm:text-left">
          Welcome to APC Worship Team Roster Submission App
        </TextH2>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            View all the dates submitted over time.
          </li>
          <li className="tracking-[-.01em]">
            Submit the dates for upcoming months (as and when your WP alerts
            you).
          </li>
        </ol>

        <Link href="/search">
          <Button className="flex self-center">Submit Dates Now</Button>
        </Link>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <TextLink
          className="flex items-center gap-2"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          History
        </TextLink>
        <TextLink
          className="flex items-center gap-2"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Submit
        </TextLink>
        <TextLink
          className="flex items-center gap-2"
          href="https://apcmusic.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to apcmusic.org →
        </TextLink>
      </footer>
    </div>
  );
}
