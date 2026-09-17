# Cosplay Photography Portfolio — Setup Guide

A pink & yellow, sparkle-covered, vanilla HTML/CSS/JS portfolio site. No frameworks, no build step — just open `index.html` and it works.

## What's in here

```
cosplay-portfolio/
├── index.html          the whole site's structure
├── css/style.css        all styling (colors, fonts, sparkle animations, layout)
├── js/script.js         gallery builder, filters, lightbox, sparkle effects
├── js/photos-data.js    ← YOU edit this to add your 60 photos
├── images/               ← YOU put your actual photo files in here
└── README.md            this file
```

You only need to touch **`js/photos-data.js`**, **`images/`**, and the placeholder text in `index.html` (About/Contact sections). You do not need to touch the CSS or the rest of the JS unless you want to.

---

## Step 1 — Add your photos

1. Drop your 60 image files into the `images/` folder. Use web-friendly formats (`.jpg` or `.webp`) — if your files are huge camera RAWs or giant PNGs, resize/export them to roughly **1600–2000px on the long edge** first, or the site will load slowly. Any free tool like Squoosh.app or even your phone's photo editor can do this.

2. Open `js/photos-data.js`. It already has 60 placeholder entries that look like this:

   ```js
   { src: "images/photo-01.jpg", category: "convention", featured: false },
   ```

3. For each of the 60 lines, update:
   - **`src`** — the filename of your actual image, exactly as it's named in the `images/` folder (must match exactly, including capitalization)
   - **`category`** — one of `local`, `convention`, or `stage` (these power the filter buttons)
   - **`featured`** — set to `true` for any photo you want to appear in the **Favorites** section near the top of the page, `false` for everything else. The first 6 are set to `true` by default — change these to whichever are actually your favorites.

   You can rename your image files to match the placeholders (`photo-01.jpg`, `photo-02.jpg`, ...) or just edit the `src` values to match whatever your files are actually named — either works. **The filenames have to match exactly**, or the photo won't show up.

   Want different category names (e.g. "cons", "shoots", "portraits")? Change the category value here **and** update the `data-filter` values + button labels in the `.filter-bar` section of `index.html` to match.

## Step 2 — Personalize the text

Open `index.html` and find/replace:
- `your name` in the nav logo and footer
- The hero heading (`frame the magic`) if you want different wording
- The **About** section paragraphs — swap in your real bio
- `images/about-me.jpg` — add a headshot to `images/` with that filename, or change the path
- The **Contact** section — your real email and social links (replace the `#` hrefs and `youremail@example.com`)

## Step 3 — Preview it locally

You can just double-click `index.html` to open it in your browser. If a couple of things look slightly off opening it that way (some browsers restrict local file loading), install the free **Live Server** extension in VS Code, right-click `index.html`, and choose "Open with Live Server" — that runs it properly.

---

## Step 4 — Push it to GitHub

1. Create a new repository on [github.com](https://github.com) (don't initialize it with a README — you already have one).
2. In VS Code, open this project folder (`File > Open Folder`).
3. Open the built-in terminal (`` Ctrl+` `` or `` Cmd+` ``) and run:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```

   (Replace the URL with the one GitHub gives you after creating the repo.)

   If this is your first time using git, it may ask you to sign in — follow the prompts, or use GitHub Desktop instead if you'd rather click buttons than type commands.

## Step 5 — Deploy on Netlify

1. Go to [netlify.com](https://netlify.com) and sign up/log in (you can log in with your GitHub account).
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub** and authorize Netlify to access your repos.
4. Select your portfolio repository.
5. Build settings: leave everything blank/default — there's no build command and no framework, since this is plain HTML/CSS/JS. Just click **Deploy site**.
6. Netlify gives you a live URL in about 30 seconds (something like `random-name-123.netlify.app`). You can rename it or connect a custom domain later under **Site settings → Domain management**.

From now on, every time you `git push` an update, Netlify automatically redeploys the live site — no extra steps needed.

---

## Making future edits

- **Add more photos later**: drop new files in `images/`, add matching entries to `photos-data.js`, then `git add . && git commit -m "add new photos" && git push`.
- **Change colors**: all the color values live at the very top of `css/style.css` under `:root` — change the hex codes there and they update everywhere.
- **Turn off the cursor sparkle trail** (if it feels like too much): open `js/script.js` and delete or comment out the line `setupCursorSparkles();` near the top.
- **Change which photos show as the floating hero bubbles**: the 4 circular photos floating around your hero text are picked automatically from `photos-data.js` (spread evenly across your list). To feature specific photos instead, open `js/script.js`, find `setupHeroBubbles()`, and edit the `chosen` array to pull whichever `photos[...]` entries you want. On small/mobile screens the bubbles are hidden automatically so they don't cover the text.
- **Change your Favorites**: the Favorites section pulls any photo with `featured: true` in `photos-data.js`. Flip that to `true`/`false` on any entry to add or remove it from the section. If no photos are marked featured, the section hides itself automatically.

Have fun with it! ✧
