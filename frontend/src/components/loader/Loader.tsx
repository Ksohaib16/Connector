export const Loader = ({ size }: { size?: number }) => {
  return (
    <div className="flex items-center justify-center">
      <svg
        className={`animate-spin text-white`}
        style={{height: `${size}px`, width: `${size}px`}}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <circle
            cx="12"
            cy="12"
            r="9.5"
            fill="none"
            strokeWidth="3"
            stroke="currentColor"
            strokeLinecap="round"
            className="opacity-20"
          />
          <path
            d="M12 2.5A9.5 9.5 0 0 1 21.5 12"
            fill="none"
            strokeWidth="3"
            stroke="currentColor"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};