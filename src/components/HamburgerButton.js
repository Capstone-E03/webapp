export default function HamburgerButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-600 rounded-md md:hidden hover:bg-gray-100"
      aria-label="Open sidebar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}