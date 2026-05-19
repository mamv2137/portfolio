export type CaretProps = {
  className?: string;
  glyph?: '▌' | '█' | '_';
};

export default function Caret({ className = '', glyph = '▌' }: CaretProps) {
  return (
    <span
      aria-hidden="true"
      className={`tui-caret-glyph inline-block align-baseline text-tui-caret ${className}`}
    >
      {glyph}
      <style>{`
        .tui-caret-glyph {
          animation: tui-blink 1.06s steps(2, end) infinite;
        }
        @keyframes tui-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
