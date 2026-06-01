"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1009] px-4">
      <div className="w-full max-w-lg rounded-xl bg-[#271a11] p-6 text-[#f6efe2]">
        <h1 className="mb-3 font-serif text-xl font-bold text-red-400">Something went wrong</h1>
        <p className="mb-4 text-sm text-[#b9824f]">An unexpected error occurred in the admin panel.</p>
        {error?.digest && (
          <p className="mb-4 font-mono text-xs text-[#b9824f]">Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="rounded-lg bg-[#8a5a32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7a4f2c]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
