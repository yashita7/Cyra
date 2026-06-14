import { NavRail } from "./NavRail";
import { TopBar } from "./TopBar";
import { ShellOutlet } from "./ShellOutlet";

/** Console shell: left nav rail + top bar + scrollable content area. */
export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-ink">
      <NavRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="relative flex-1 overflow-y-auto">
          <ShellOutlet />
        </main>
      </div>
    </div>
  );
}
