export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-muted md:px-8">
        <span>이정준 · AI Native Developer</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
