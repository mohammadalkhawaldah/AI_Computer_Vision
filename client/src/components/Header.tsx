import { BookOpen, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Header({
  platformName,
}: {
  platformName: string;
  onMenuToggle?: () => void;
}) {
  const [location] = useLocation();
  return (
    <header className="lab-header">
      <Link href="/" className="lab-brand">
        <span className="lab-mark">
          <BookOpen size={21} />
        </span>
        <span>
          <strong>{platformName}</strong>
          <small>THE COMPUTER VISION CLASSROOM</small>
        </span>
      </Link>
      <nav aria-label="Main navigation" className="lab-navigation">
        <Link
          href="/lesson"
          aria-current={
            location === "/lesson" || location === "/home" ? "page" : undefined
          }
        >
          Classroom
        </Link>
        <Link
          href="/dashboard"
          aria-current={location === "/dashboard" ? "page" : undefined}
        >
          My progress
        </Link>
        <Link href="/" className="course-home">
          Course home
          <ArrowUpRight size={14} />
        </Link>
      </nav>
    </header>
  );
}
