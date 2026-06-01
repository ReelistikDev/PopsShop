"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ background: "#1a1009", color: "#f6efe2", fontFamily: "sans-serif", padding: "2rem" }}>
        <h1 style={{ color: "#f87171", marginBottom: "1rem" }}>Something went wrong</h1>
        <p style={{ color: "#d8c3a2", marginBottom: "1rem", fontSize: "14px" }}>
          An unexpected error occurred. Please try again.
        </p>
        {error?.digest && (
          <p style={{ color: "#b9824f", fontSize: "12px", fontFamily: "monospace", marginBottom: "1rem" }}>
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{ background: "#8a5a32", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
