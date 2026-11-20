# pleromastudios.com — the WORLDS: Anthropos website

Plain HTML. No build tools, no plugins, nothing to install. Every page is one file you can open and edit.

## The pages

| File | Page |
|---|---|
| `index.html` | Home |
| `world.html` | The World — Maya, Anthropos, the Malachi, the survivors |
| `manifest.html` | The Manifest — recovered in-game documents |
| `media.html` | Trailer, screenshots, key art |
| `news.html` | News |
| `studio.html` | Studio, team, press fact sheet, contact |
| `404.html` | Shown when a page doesn't exist |
| `wayfinder.html`, `seal.html` | Hidden. Not linked in the menu on purpose. |

The look lives in `assets/css/site.css`. The behaviour lives in `assets/js/site.js`.

## Common edits

**Change some text.** Open the page, find the words, change them, save. Don't touch anything inside `< >` unless you mean to.

**Add a news post.** Open `news.html`. Find the line `NEW POSTS GO HERE`. Copy one whole `<article class="post"> … </article>` block, paste it directly under that line, and change the date and text.

**Add or replace an image.** Put the file in `assets/img/shots/` (screenshots) or `assets/img/art/` (art). Screenshots are 1600×900 JPG, plus a 640×360 copy ending in `-sm.jpg` for the small grids. Then point the page's `src="..."` at the new file name.

**Settings** (top of `assets/js/site.js`):
- `newsletterAction` — paste the form URL from Kit or MailerLite once the account exists. Until then the form tells people signups open soon and points them to Discord.
- `heroVideo` — set to `true` after adding a looping video at `assets/video/hero.mp4` (keep it under ~10 MB, no sound needed).

**The trailer button** links to the YouTube channel. To link the trailer itself, search the pages for `UCAHSgf9oYVnLiyJPHW9-ACw` and replace those links with the trailer's YouTube URL.

## Hosting

Hosted free on GitHub Pages. `CNAME` tells GitHub the address is `pleromastudios.com`. `.nojekyll` tells GitHub to serve the files as they are. Don't delete either.
