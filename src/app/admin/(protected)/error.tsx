"use client";

export default function AdminError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1009] px-4">
      <div className="w-full max-w-lg rounded-xl bg-[#271a11] p-6 text-[#f6efe2]">
        <h1 className="mb-3 font-serif text-xl font-bold text-red-400">Admin Error</h1>
        <p className="mb-2 text-sm text-[#b9824f]">Something crashed. Error details:</p>
        <pre className="overflow-auto rounded-lg bg-[#1a1009] p-4 text-xs text-red-300">
          {error?.message || "No message"}
          {"\n\n"}
          {error?.stack || "No stack"}
          {"\n\nDigest: "}
          {error?.digest || "none"}
        </pre>
      </div>
    </div>
  );
}
