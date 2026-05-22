"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ background: "#1a1009", color: "#f6efe2", fontFamily: "monospace", padding: "2rem" }}>
        <h1 style={{ color: "#f87171", marginBottom: "1rem" }}>Server Error</h1>
        <pre style={{ background: "#000", padding: "1rem", borderRadius: "8px", overflow: "auto", fontSize: "12px", color: "#fca5a5" }}>
          {error?.message || "No message"}
          {"\n\n"}
          {error?.stack || "No stack"}
          {"\n\nDigest: "}
          {error?.digest || "none"}
        </pre>
      </body>
    </html>
  );
}
