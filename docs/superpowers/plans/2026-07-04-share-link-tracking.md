# Share Link Tracking + Copy Link Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users copy a trackable share link for an app so that visits made through that link are counted in the existing `openCount` monitoring metric, just like clicking "BUKA APLIKASI" directly in the portal.

**Architecture:** Add a portal-owned redirect route `GET /go/[id]` that increments `Application.openCount` then 307-redirects to the app's real `accessLink`. Extract the increment logic (currently inline in `POST /api/apps/[id]/open`) into a shared helper `incrementOpenCount()` in `src/lib/appStats.ts` so both the existing beacon route and the new redirect route share one code path. Add a "Copy Link" icon button to `AppCard.tsx` that copies `${origin}/go/{id}` to the clipboard instead of the raw `accessLink`.

**Tech Stack:** Next.js 16 App Router route handlers, Prisma 5 (`Application.openCount` field, no schema change), React 19 client component state, `navigator.clipboard`, `lucide-react` icons.

## Global Constraints

- No database migration — reuses the existing `Application.openCount` Int field (`prisma/schema.prisma:18`).
- No new API endpoints beyond `GET /go/[id]` — do not add a separate "share count" metric or KPI card (explicitly merged into `openCount` per the approved spec, `docs/superpowers/specs/2026-07-04-share-link-tracking-design.md`).
- No test framework exists in this repo (no Jest/Vitest configured, no test script in `package.json`) — do not add one as part of this feature. Verify each task manually via `npm run dev` + `curl`/browser, matching how the existing codebase is verified today.
- Match existing code style: no comments unless explaining non-obvious rationale, `"use client"` directive stays at the top of client components, Tailwind classes follow the `foundry-*` design tokens already used in `AppCard.tsx`.

---

### Task 1: Extract `incrementOpenCount` helper and refactor the existing open-tracking route

**Files:**
- Create: `src/lib/appStats.ts`
- Modify: `src/app/api/apps/[id]/open/route.ts`

**Interfaces:**
- Produces: `incrementOpenCount(id: string): Promise<boolean>` — attempts to increment `Application.openCount` for the given `id`; returns `true` if the app was found and updated, `false` if the update failed (e.g. app doesn't exist). Later tasks (Task 2) import this from `@/lib/appStats`.

- [ ] **Step 1: Create the shared helper**

Create `src/lib/appStats.ts`:

```ts
import { prisma } from "@/lib/prisma";

export async function incrementOpenCount(id: string): Promise<boolean> {
  try {
    await prisma.application.update({
      where: { id },
      data: { openCount: { increment: 1 } },
    });
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Refactor the existing route to use the helper**

Replace the full contents of `src/app/api/apps/[id]/open/route.ts` with:

```ts
import { NextRequest, NextResponse } from "next/server";
import { incrementOpenCount } from "@/lib/appStats";

type Params = { params: Promise<{ id: string }> };

// Publik: dipanggil saat operator membuka aplikasi dari portal.
// Fire-and-forget — mencatat satu "open" lalu balas 204.
export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const ok = await incrementOpenCount(id);
  if (!ok) return new NextResponse(null, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
```

- [ ] **Step 3: Verify behavior is unchanged**

Run: `npm run dev`

In a second terminal, find a real app id first (any id from `/api/apps`), then:

```bash
curl -s http://localhost:3000/api/apps | node -e "process.stdin.once('data', d => console.log(JSON.parse(d)[0].id))"
```

Copy the printed id, then check the stats before and after hitting the open endpoint:

```bash
curl -s http://localhost:3000/api/stats
curl -i -X POST http://localhost:3000/api/apps/<PASTE_ID_HERE>/open
curl -s http://localhost:3000/api/stats
```

Expected: the POST returns `HTTP/1.1 204 No Content`, and `totalOpens` in the second `/api/stats` call is exactly 1 higher than the first. Also verify the 404 path:

```bash
curl -i -X POST http://localhost:3000/api/apps/nonexistent-id/open
```

Expected: `HTTP/1.1 404 Not Found`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/appStats.ts src/app/api/apps/[id]/open/route.ts
git commit -m "refactor: extract incrementOpenCount helper from open-tracking route"
```

---

### Task 2: Add the trackable redirect route `GET /go/[id]`

**Files:**
- Create: `src/app/go/[id]/route.ts`

**Interfaces:**
- Consumes: `incrementOpenCount(id: string): Promise<boolean>` from `src/lib/appStats.ts` (Task 1); `prisma` from `src/lib/prisma.ts`.
- Produces: the URL pattern `/go/{id}` that Task 3's Copy Link button will construct and copy to the clipboard.

- [ ] **Step 1: Create the route handler**

Create `src/app/go/[id]/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { incrementOpenCount } from "@/lib/appStats";

type Params = { params: Promise<{ id: string }> };

// Link yang dibagikan (Copy Link) mengarah ke sini, bukan langsung ke accessLink,
// supaya akses lewat link share ikut tercatat di openCount sebelum redirect.
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const app = await prisma.application.findUnique({
    where: { id },
    select: { accessLink: true },
  });

  if (!app) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  await incrementOpenCount(id);

  return NextResponse.redirect(new URL(app.accessLink, req.url));
}
```

- [ ] **Step 2: Verify the redirect and tracking behavior**

Run: `npm run dev` (if not already running)

Get a real app id and its `accessLink`, then check redirect + tracking:

```bash
curl -s http://localhost:3000/api/apps | node -e "process.stdin.once('data', d => { const a = JSON.parse(d)[0]; console.log(a.id, a.accessLink); })"
```

```bash
curl -s http://localhost:3000/api/stats
curl -i http://localhost:3000/go/<PASTE_ID_HERE>
curl -s http://localhost:3000/api/stats
```

Expected: the `curl -i` call returns `HTTP/1.1 307 Temporary Redirect` with a `Location` header matching the app's `accessLink` (resolved to an absolute URL), and `totalOpens` in the second `/api/stats` call is exactly 1 higher than the first.

Then verify the not-found fallback:

```bash
curl -i http://localhost:3000/go/nonexistent-id
```

Expected: `HTTP/1.1 307 Temporary Redirect` with `Location: http://localhost:3000/`.

- [ ] **Step 3: Commit**

```bash
git add src/app/go/[id]/route.ts
git commit -m "feat: add trackable /go/[id] redirect route for shared links"
```

---

### Task 3: Add the Copy Link button to `AppCard`

**Files:**
- Modify: `src/components/AppCard.tsx`

**Interfaces:**
- Consumes: the `/go/{id}` URL pattern from Task 2 (constructed client-side as `${window.location.origin}/go/${app.id}`).

- [ ] **Step 1: Add imports and local state**

In `src/components/AppCard.tsx`, update the icon import (line 4-7) to include `Copy` and `Check`:

```tsx
import {
  Flame, Star, ExternalLink, Eye,
  MessageSquarePlus, AlertTriangle, CheckCircle2,
  Copy, Check,
} from "lucide-react";
```

Add a `copied` state next to the existing `opens` state (after line 20, `const [opens, setOpens] = useState(app.openCount ?? 0);`):

```tsx
  const [copied, setCopied] = useState(false);
```

- [ ] **Step 2: Add the copy handler**

After the existing `handleOpen` function (after line 29, the closing `}` of `handleOpen`), add:

```tsx
  async function handleCopyLink() {
    const url = `${window.location.origin}/go/${app.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
```

- [ ] **Step 3: Add the button to the actions row**

In the actions row (lines 139-165), insert a new button between the "BUKA APLIKASI" anchor (closing `</a>` at line 156) and the feedback button (starting at line 157):

```tsx
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-2 border border-foundry-border/40 text-foundry-muted hover:border-molten/50 hover:text-molten transition-all duration-200"
              aria-label={`Salin link untuk ${app.name}`}
              title="Salin Link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-active" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
```

The full actions row block should now read (lines 139-166 replaced):

```tsx
          <div className="flex gap-2 mt-4 pt-3 border-t border-foundry-border/40">
            <a
              href={isMaintenance ? undefined : app.accessLink}
              target={isMaintenance ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-disabled={isMaintenance}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 transition-all duration-200",
                isMaintenance
                  ? "bg-foundry-steel/40 text-foundry-muted cursor-not-allowed opacity-60"
                  : "bg-molten text-foundry-black hover:bg-molten-bright"
              )}
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "0.1em" }}
              onClick={isMaintenance ? (e) => e.preventDefault() : handleOpen}
            >
              <ExternalLink className="w-3 h-3" />
              {isMaintenance ? "DALAM PERBAIKAN" : "BUKA APLIKASI"}
            </a>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-2 border border-foundry-border/40 text-foundry-muted hover:border-molten/50 hover:text-molten transition-all duration-200"
              aria-label={`Salin link untuk ${app.name}`}
              title="Salin Link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-active" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-2.5 py-2 border border-foundry-border/40 text-foundry-muted hover:border-molten/50 hover:text-molten transition-all duration-200"
              aria-label={`Beri masukan untuk ${app.name}`}
              title="Beri Masukan"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
            </button>
          </div>
```

Note: the Copy Link button is intentionally rendered unconditionally (no `isMaintenance` check) — it must stay usable during maintenance per the approved spec.

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`, open `http://localhost:3000` in a browser.

- Click the new copy-link icon button (between "BUKA APLIKASI" and the feedback button) on any app card.
- Expected: the icon briefly swaps to a checkmark for ~1.5 seconds, then reverts.
- Paste the clipboard content (e.g. into the address bar) and confirm it matches `http://localhost:3000/go/<that app's id>`.
- Navigate to that pasted URL directly and confirm it redirects to the app's `accessLink`.
- Repeat on a card with status "Maintenance" (or toggle one via `/admin/apps`) and confirm the copy-link button still works there, while "BUKA APLIKASI" remains disabled.

- [ ] **Step 5: Commit**

```bash
git add src/components/AppCard.tsx
git commit -m "feat: add Copy Link button to AppCard for trackable share links"
```
