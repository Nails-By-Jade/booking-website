export default function Sparkle({ className = "h-4 w-4" }: { className?: string }) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 2c.6 3.8 1.6 5.9 3.5 7.5C17.4 11.1 19.4 12 22 12c-2.6 0-4.6.9-6.5 2.5C13.6 16.1 12.6 18.2 12 22c-.6-3.8-1.6-5.9-3.5-7.5C6.6 12.9 4.6 12 2 12c2.6 0 4.6-.9 6.5-2.5C10.4 7.9 11.4 5.8 12 2Z" />
      </svg>
    );
  }