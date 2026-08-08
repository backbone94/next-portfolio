import { PROFILE } from '../content/site';

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-muted md:px-8">
        <span>
          {PROFILE.name} · {PROFILE.jobTitle}
        </span>
        <span>© {new Date().getFullYear()} Jun</span>
      </div>
    </footer>
  );
}
