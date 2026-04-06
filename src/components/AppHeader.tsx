import { useState } from "react";
import type { UserRole } from "../types";
import { IconMoon, IconRefresh, IconSun } from "./icons";
import { useFinanceStore } from "../store/useFinanceStore";

const navLink =
  "rounded-xl px-3 py-2 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]";

export function AppHeader() {
  const role = useFinanceStore((s) => s.role);
  const setRole = useFinanceStore((s) => s.setRole);
  const theme = useFinanceStore((s) => s.theme);
  const toggleTheme = useFinanceStore((s) => s.toggleTheme);
  const resetDemoData = useFinanceStore((s) => s.resetDemoData);
  const [mockLoading, setMockLoading] = useState(false);

  async function mockApiRefresh() {
    setMockLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    resetDemoData();
    setMockLoading(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-ink)]/10 bg-[var(--color-surface)]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <div
            className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-teal-800 text-lg font-bold text-white shadow-[var(--shadow-float)] ring-2 ring-white/25 dark:to-teal-950 dark:ring-white/10"
            aria-hidden
          >
            Z
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-[var(--color-ink)]">Finance Dashboard</p>
            <p className="text-xs text-[var(--color-ink-muted)]">Personal activity overview</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-1.5 sm:justify-end" aria-label="Toolbar">
          <a href="#overview" className={navLink}>
            Overview
          </a>
          <a href="#transactions" className={navLink}>
            Transactions
          </a>
          <a href="#insights" className={navLink}>
            Insights
          </a>

          <label className="ml-1 flex items-center gap-2 rounded-xl border border-[var(--color-ink)]/12 bg-[var(--color-surface-muted)]/70 px-3 py-2 shadow-sm">
            <span className="text-xs font-medium text-[var(--color-ink-muted)]">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="max-w-[11rem] cursor-pointer bg-transparent text-sm font-medium text-[var(--color-ink)] outline-none"
              aria-label="Simulated user role"
            >
              <option value="viewer">Viewer · read only</option>
              <option value="admin">Admin · edit data</option>
            </select>
          </label>

          <button
            type="button"
            onClick={mockApiRefresh}
            disabled={mockLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-ink)]/12 bg-[var(--color-surface-elevated)] px-3 py-2 text-sm font-medium text-[var(--color-ink)] shadow-sm transition hover:bg-[var(--color-surface-muted)] disabled:opacity-50"
            title="Simulated delay, then reload seed data"
          >
            <IconRefresh className={`size-4 shrink-0 ${mockLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{mockLoading ? "Syncing…" : "Mock sync"}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--color-ink)]/12 bg-[var(--color-surface-elevated)] p-2.5 text-[var(--color-ink)] shadow-sm transition hover:bg-[var(--color-surface-muted)]"
            aria-pressed={theme === "dark"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <IconSun className="size-5" /> : <IconMoon className="size-5" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
