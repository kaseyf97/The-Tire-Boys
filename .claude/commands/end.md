You are ending a work session on The Tire Boys website. Your job is to save a compact snapshot so the next session starts instantly without re-explaining anything.

## Step 1: Summarize This Session

Review what happened in this conversation and write a brief summary:
- What was completed (be specific — file names, what changed)
- What was NOT finished and why
- Any decisions made that affect future work
- Any warnings or blockers discovered

## Step 2: Update whereweleftoff.md

Rewrite `.claude/commands/whereweleftoff.md` to reflect current state. Keep the same format:

```
Remind me where we left off on The Tire Boys website. Here's the current to-do list:

**Most Important First:**
1. [highest priority task]

**Then when ready:**
2. [next task]
3. [next task]
...
```

Remove tasks that were completed. Add any new tasks discovered. Keep it honest — only what's actually left to do.

## Step 3: Save to Memory

Check `~/.claude/projects/C--Users-kasey-OneDrive-Documents-Claude-Projects-The-Tire-Boys/memory/MEMORY.md`.

- If it doesn't exist yet, create it (empty index to start)
- Save a `project_session_log.md` memory file with this session's summary (overwrite if it exists)
- Update MEMORY.md to include a pointer to it if not already there
- Save any other new user/feedback/project memories you learned this session

Memory file format:
```
---
name: Session Log
description: Summary of last work session — what was done, what's next, any blockers
type: project
---

**Date:** [today's date]
**Done:** [bullet list]
**Left to do:** [bullet list — same as whereweleftoff.md]
**Why:** [any important context about decisions made]
**How to apply:** Read this at /start to resume quickly
```

## Step 4: Commit Everything to GitHub

Run these git commands to save all changes:

```bash
git add -A
git status
```

Review what's staged, then commit with a message summarizing the session:

```bash
git commit -m "[one-line summary of what was done this session]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

Then push to GitHub:

```bash
git push
```

If the push fails because the remote branch doesn't exist yet, run:
```bash
git push -u origin HEAD
```

## Step 5: Confirm

Output:
```
Session saved and pushed to GitHub. To resume next time, run /start.
Tasks remaining: [count]
Last completed: [what you just finished]
Committed: [commit hash]
```
