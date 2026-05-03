interface StockBoxLogoProps {
  size?: number;
  className?: string;
}

export default function StockBoxLogo({ size = 36, className = '' }: StockBoxLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-[9px] bg-blue-700 flex-shrink-0 overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Bold S lettermark */}
      <span
        style={{
          fontFamily: '"Arial Black", "Arial", sans-serif',
          fontWeight: 900,
          fontSize: size * 0.58,
          color: 'white',
          lineHeight: 1,
          userSelect: 'none',
          position: 'relative',
          zIndex: 1,
          letterSpacing: '-0.5px',
        }}
      >
        S
      </span>

      {/* Rising arrow — shifted 4px right vs before */}
      <svg
        viewBox="0 0 36 36"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}
      >
        <polyline
          points="7,27  12,18  17,22  24,11  31,14"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="27,10  31,14  28,17"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
