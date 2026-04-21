import { useClerk } from "@clerk/clerk-react";
import ScheduleDemo from "./ScheduleDemo";

export default function BookDemo() {
  const { signOut } = useClerk();

  return (
    <div className="relative">
      {/* Pending notice bar */}
      <div className="sticky top-0 z-50 border-b border-amber-800/40 bg-amber-950/80 backdrop-blur-sm px-4 py-2.5 text-center">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="text-xs font-medium text-amber-400">
            Your account is pending approval — book a demo while you wait.
          </span>
          <button
            onClick={() => signOut()}
            className="ml-4 text-xs text-amber-600 underline hover:text-amber-400 transition"
          >
            Sign out
          </button>
        </div>
      </div>

      <ScheduleDemo />
    </div>
  );
}
