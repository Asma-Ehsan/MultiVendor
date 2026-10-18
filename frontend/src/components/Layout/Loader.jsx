import { FiShoppingBag } from "react-icons/fi";

const Loader = () => {
  return (
    <div
      className="w-full min-h-[70vh] flex flex-col items-center justify-center gap-space-md"
      role="status"
      aria-live="polite"
    >
      <div className="relative w-20 h-20">
        {/* light ring (stays still) */}
        <div className="absolute inset-0 rounded-full border-4 border-primary-fixed"></div>

        {/* purple ring part (spins) */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>

        {/* bag icon in the middle */}
        <div className="absolute inset-3 rounded-full bg-primary-fixed/60 flex items-center justify-center text-primary">
          <FiShoppingBag size={24} className="animate-pulse" />
        </div>
      </div>

      <p className="font-label-md text-label-md text-secondary">Loading...</p>
    </div>
  );
};

export default Loader;