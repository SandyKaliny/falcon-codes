# Git guide for Sandy — get the latest updates

Hi Sandy 👋

Don’t worry about breaking anything. Follow this guide step by step.  
If something looks wrong, stop and send the error message — we’ll help.

We combined the latest work into a shared branch called **`development`**.  
That branch has your updates **plus** the mobile work.  
**For now, use `development` as your starting point.**

---

## Branches (simple)

| Branch | What it is | What you should do |
|--------|------------|--------------------|
| `main` | Older / stable line | Don’t start new work here for now |
| `mobile` | Mobile UI work (already merged into development branch, mahamoud's edits...) | You don’t need to use this now |
| **`development`** | **Latest shared project** | **Start here. Pull this. Build from this.** |

Repo: `https://github.com/SandyKaliny/falcon-codes`

### Best practice for our project (read this)

1. **Latest expected working code right now = `development`**  
   That’s the branch where finished pieces should land first so we can all see them together.

2. **`main` is not “abandoned”** — later, when `development` looks good and stable, we merge into `main`.  
   So: **finish work into `development` first**, not straight into `main` while things are still moving.

3. **Don’t edit directly on `development` for big new features** (best practice).  
   Create your **own small branch from `development`**, do your work there, then we merge it back into `development`.

4. You **do not** need to manually copy mobile work into your branch.  
   When you start from `development`, mobile work is already included.

---

## How to get the latest `development` branch

Open a terminal **inside your Falcon Codes project folder**, then run:

```bash
git fetch origin
git checkout development
git pull origin development
```

That’s it. You now have the latest shared version.

Open the site from this folder as usual (for example `index.html`).

---

## If `development` doesn’t exist on your computer yet

First time only:

```bash
git fetch origin
git checkout -b development origin/development
```

Next times, just use:

```bash
git checkout development
git pull origin development
```

---

## Before you pull (if you have unsaved local edits)

Check:

```bash
git status
```

- If it says **clean** → safe to pull.
- If you have files you changed and want to keep → commit them first on your own branch (see below), or ask before pulling.

---

## Quick check that you’re on the right branch

```bash
git branch
```

The branch with `*` should be:

```text
* development
```

---

## Best way for you to work: create your own branch from `development`

This is the recommended practice.

### Step 1 — Update `development`

```bash
git fetch origin
git checkout development
git pull origin development
```

### Step 2 — Create your new branch from it

Pick a clear name, for example:

- `sandy-about-updates`
- `sandy-contact-form`
- `sandy-web-page`

```bash
git checkout -b sandy-about-updates
```

You are now on your own branch, based on the latest `development`  
(so you already have the mobile work + shared updates).

### Step 3 — Make your edits, then save them

```bash
git status
git add .
git commit -m "Describe your update in a short sentence"
```

### Step 4 — Send your branch to GitHub

```bash
git push -u origin sandy-about-updates
```

(Use your real branch name instead of `sandy-about-updates`.)

### Step 5 — Merge into `development` (together)

After your work looks good:

- open a Pull Request on GitHub: **your branch → `development`**  
  or tell us your branch is ready and we’ll merge it with you.

**Do not merge into `main` by yourself for now.**  
We put finished shared work into **`development` first**.

---

## What if you already did work on `main`?

No stress. Tell us, and we’ll help move it.  
In many cases the safe idea is:

1. Save your work (commit on your current branch).
2. Update `development`.
3. Create a new branch from `development`.
4. Bring your commits over carefully (we can help with this).

You don’t need to solve that alone.

---

## Where should “finished” code live?

| Question | Answer |
|----------|--------|
| Where is the latest expected combined code **today**? | **`development`** |
| Where should your new finished feature go first? | Merge into **`development`** |
| When does code go to **`main`**? | Later, when `development` is stable and we agree it’s ready |
| Do you need the `mobile` branch every day? | **No** — it’s already inside `development` - mahmoud already did it |

So you can relax:  
**pull `development` → create your branch from it → work → push → merge back to `development`.**

---

## Optional: look at `main` later (not for daily work)

```bash
git checkout main
git pull origin main
```

Remember: for current work, go back to `development` (or your branch created from it).

---

## Need help? 
### Get back to Mahmoud and he'll guide you to walk through this file if you face any problems.

If a command shows an error, copy the **full message** and send it — we’ll help fix it.  
Please don’t force-push, and don’t delete branches unless we agree together.

You’re not expected to manage all branches alone.  
Your simple loop is enough:

1. Pull latest `development`  
2. Create your branch from it  
3. Commit + push your work  
4. Merge into `development` when ready
