# Oeight Personal Site

Static personal website for GitHub Pages.

## What is included

- `Home / 首页`
- `Concerts / 演唱会`
- `Travel / 足迹`
- `Now / 近况`
- `Gallery / 照片集`

## Content files

- `data/profile.json`: basic profile and external links
- `data/concerts.json`: concert cards and Bilibili URLs
- `data/travel.json`: trip metadata and route points
- `content/travel/*.md`: long-form trip logs
- `data/now.json`: timestamped now entries
- `data/gallery.json`: themed gallery groups

## Deploy to GitHub Pages

This project already includes `.github/workflows/deploy.yml`, so GitHub Pages can deploy automatically after you push to GitHub.

Recommended choices:

1. User site:
   Create a repository named `YOUR_USERNAME.github.io`
   Your site will be published at `https://YOUR_USERNAME.github.io/`

2. Project site:
   Create any repository name you like
   Your site will be published at `https://YOUR_USERNAME.github.io/REPOSITORY_NAME/`

Because the site uses relative paths, both deployment styles work.

## First push

If this folder is not connected to a GitHub repo yet, use:

```bash
git init -b main
git add .
git commit -m "Initial site"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Then in GitHub:

1. Open the repository
2. Go to `Settings > Pages`
3. Set `Source` to `GitHub Actions`

After that, every push to `main` will redeploy the site automatically.

## Update content later

- Add new concerts in `data/concerts.json`
- Add new trips in `data/travel.json`
- Add travel writing in `content/travel/*.md`
- Add new now entries in `data/now.json`
- Add themed images in `data/gallery.json`

## Notes

- `08.png` is currently used as the hero portrait and placeholder image in demo content.
- Replace placeholder links and sample entries with your real GitHub, Bilibili, concert, and travel data before publishing.
