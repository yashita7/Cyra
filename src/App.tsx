import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CursorGlow } from "@/components/layout/CursorGlow";
import { AppShell } from "@/components/layout/AppShell";

import Hero from "@/screens/Hero";
import Inbox from "@/screens/Inbox";
import Grade from "@/screens/Grade";
import Decision from "@/screens/Decision";
import Listing from "@/screens/Listing";
import Buyers from "@/screens/Buyers";
import Prevention from "@/screens/Prevention";
import Impact from "@/screens/Impact";
import Architecture from "@/screens/Architecture";
import Kit from "@/screens/Kit";

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider delayDuration={150}>
        <CursorGlow />
        <Routes>
          {/* Screen 1 — Hero / landing (full-bleed, no shell) */}
          <Route path="/" element={<Hero />} />

          {/* Console shell wraps the rest */}
          <Route element={<AppShell />}>
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/grade/:id" element={<Grade />} />
            <Route path="/decision/:id" element={<Decision />} />
            {/* Screens 5–8 — Person 2 stubs */}
            <Route path="/listing/:id" element={<Listing />} />
            <Route path="/buyers/:id" element={<Buyers />} />
            <Route path="/prevention" element={<Prevention />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/architecture" element={<Architecture />} />
            {/* Dev: motion-kit showcase */}
            <Route path="/_kit" element={<Kit />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  );
}
