# Mindenity-2 — project guidance for Codex

## Design system

This project consumes the **Mindenity-DS** Figma file (`fileKey: qU7OupeoYyrtlNMEKi7ao5`) exclusively. A full catalog of the DS lives under [design-system/](design-system/). Read [design-system/README.md](design-system/README.md) at the start of any UI/Figma task.

Key facts:
- **Bridge:** Both `paperclip-figma-bridge` and `figma-console` are supported. Use whichever is currently available and specified — `figma-console` MCP tools are registered with a `mcp_figma_console_` prefix. Prefer the bridge the agent already has connected.
- **Theme model:** light + dark are separate Figma pages today (NOT variable modes — Phase 2 set up the infrastructure but pages aren't flipped). Pick the matching page. Phase 2.5 will collapse this when template-page screen backgrounds are migrated to semantic surfaces.
- **Tokens:** 36 numeric variables (radius, spacing, size, icon-size) + 144 `Palette` colors (renamed from `Colors` in Phase 2A) + 32 `Semantic` tokens with Light/Dark modes (31 from Phase 2 + `surface/base` from Phase 2.5 Step 1, both complete 2026-05-12). New components should bind to `Semantic` tokens (`surface/*`, `text/*`, `border/*`, `interactive/*`, `state/*`); `Palette` is implementation detail for decorative tints + Semantic aliases. Dark mode infrastructure exists but no page is flipped yet — see Phase 2 + Phase 2.5 Step 1 retrospectives for status.
- **Components:** 183 across 24 categories — see [design-system/components.md](design-system/components.md).
- **Templates:** every screen request should start by copying the closest frame from a [template page](design-system/templates.md), not from a blank artboard.

## Workflow for "build me a screen" prompts

1. Read [design-system/templates.md](design-system/templates.md) → pick the closest section (e.g. Mood Tracker, Authentication, Settings).
2. Pick light or dark page based on the request.
3. Drill into the section's screen grid, capture the section overview screenshot, choose the closest screen frame.
4. Duplicate the frame into a working area, swap content via component instances and text edits.
5. Verify after every mutation with `figma_capture_screenshot`. Final overview with `figma_take_screenshot`.

## When the DS catalog might be stale

NodeIds in the catalog were captured during the initial scan. If a `figma_execute` call referencing a cached id fails with "node not found", re-resolve by walking the page tree or via `figma_search_components`. The category structure and counts are stable.

## When the DS doesn't have what's needed

If a screen requires a pattern that doesn't exist in the catalog, **stop and ask** before authoring a new component. The DS owner may want it added properly first rather than as a one-off.

# context-mode — MANDATORY routing rules

You have context-mode MCP tools available. These rules are NOT optional — they protect your context window from flooding. A single unrouted command can dump 56 KB into context and waste the entire session.

## BLOCKED commands — do NOT attempt these

### curl / wget — BLOCKED
Any Bash command containing `curl` or `wget` is intercepted and replaced with an error message. Do NOT retry.
Instead use:
- `ctx_fetch_and_index(url, source)` to fetch and index web pages
- `ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls in sandbox

### Inline HTTP — BLOCKED
Any Bash command containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` is intercepted and replaced with an error message. Do NOT retry with Bash.
Instead use:
- `ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### WebFetch — BLOCKED
WebFetch calls are denied entirely. The URL is extracted and you are told to use `ctx_fetch_and_index` instead.
Instead use:
- `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Bash (>20 lines output)
Bash is ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other short-output commands.
For everything else, use:
- `ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### Read (for analysis)
If you are reading a file to **Edit** it → Read is correct (Edit needs content in context).
If you are reading to **analyze, explore, or summarize** → use `ctx_execute_file(path, language, code)` instead. Only your printed summary enters context. The raw file content stays in the sandbox.

### Grep (large results)
Grep results can flood context. Use `ctx_execute(language: "shell", code: "grep ...")` to run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `ctx_batch_execute(commands, queries)` — Primary tool. Runs all commands, auto-indexes output, returns search results. ONE call replaces 30+ individual calls.
2. **FOLLOW-UP**: `ctx_search(queries: ["q1", "q2", ...])` — Query indexed content. Pass ALL questions as array in ONE call.
3. **PROCESSING**: `ctx_execute(language, code)` | `ctx_execute_file(path, language, code)` — Sandbox execution. Only stdout enters context.
4. **WEB**: `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters context.
5. **INDEX**: `ctx_index(content, source)` — Store content in FTS5 knowledge base for later search.

## Subagent routing

When spawning subagents (Agent/Task tool), the routing block is automatically injected into their prompt. Bash-type subagents are upgraded to general-purpose so they have access to MCP tools. You do NOT need to manually instruct subagents about context-mode.

## Output constraints

- Keep responses under 500 words.
- Write artifacts (code, configs, PRDs) to FILES — never return them as inline text. Return only: file path + 1-line description.
- When indexing content, use descriptive source labels so others can `ctx_search(source: "label")` later.

## ctx commands

| Command | Action |
|---------|--------|
| `ctx stats` | Call the `ctx_stats` MCP tool and display the full output verbatim |
| `ctx doctor` | Call the `ctx_doctor` MCP tool, run the returned shell command, display as checklist |
| `ctx upgrade` | Call the `ctx_upgrade` MCP tool, run the returned shell command, display as checklist |
