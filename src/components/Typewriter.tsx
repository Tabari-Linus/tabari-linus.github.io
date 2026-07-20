import { useEffect, useState } from "react";

/**
 * Rotates through a list of words with a typewriter effect.
 * Types → holds → backspaces → next word → loops.
 */
export default function Typewriter({
  words,
  typeSpeed = 70,
  deleteSpeed = 40,
  holdMs = 1400,
  className = "",
}: {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  holdMs?: number;
  className?: string;
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    const current = words[wordIndex % words.length];
    let t: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < current.length) {
        t = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed);
      } else {
        t = setTimeout(() => setPhase("holding"), 0);
      }
    } else if (phase === "holding") {
      t = setTimeout(() => setPhase("deleting"), holdMs);
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
      } else {
        setWordIndex((i) => (i + 1) % words.length);
        setPhase("typing");
        t = setTimeout(() => {}, 0);
      }
    }
    return () => clearTimeout(t);
  }, [text, phase, wordIndex, words, typeSpeed, deleteSpeed, holdMs]);

  return (
    <span className={className}>
      {text}
      <span className="cursor-blink" />
    </span>
  );
}
