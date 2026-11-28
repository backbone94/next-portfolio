import Link from 'next/link';
import { CONTACT, PROFILE, RESUME_URL } from '../content/site';
import CopyEmailButton from './CopyEmailButton';

const link = 'transition-colors hover:text-accent';

/** 연락처와 방문 데이터 안내를 제공한다. */
export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-muted md:px-8">
        <span className="flex flex-wrap gap-x-5">
          <CopyEmailButton className={link}>{CONTACT.email}</CopyEmailButton>
          <a href={CONTACT.github} target="_blank" rel="noreferrer" className={link}>
            GitHub
          </a>
          <a href={RESUME_URL} target="_blank" rel="noreferrer" className={link}>
            이력서 PDF
          </a>
          <Link href="/privacy" className={link}>방문 데이터 안내</Link>
        </span>
        <span>
          © {new Date().getFullYear()} {PROFILE.name}
        </span>
      </div>
    </footer>
  );
}
