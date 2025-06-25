export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="M12 2 L2 7 L12 12 L22 7 L12 2 Z" />
          <path d="M2 17 L12 22 L22 17" />
          <path d="M2 12 L12 17 L22 12" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-foreground">METAYield</h1>
    </div>
  );
}
