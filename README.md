# AI Vision Platform

## Local Development

```powershell
npm.cmd install
npm.cmd run dev
```

## GitHub Pages Deployment

This project is configured to deploy to GitHub Pages from the `main` branch using the workflow in [C:\Users\moham\OneDrive\Documents\AI_Vision_Plateform\.github\workflows\deploy-github-pages.yml](C:\Users\moham\OneDrive\Documents\AI_Vision_Plateform\.github\workflows\deploy-github-pages.yml).

### One-Time Setup

1. Create a GitHub repository and push this project to it.
2. In GitHub, open `Settings -> Pages`.
3. Under `Source`, choose `GitHub Actions`.
4. Make sure your default deployment branch is `main`.
5. Push to `main` or run the workflow manually from the `Actions` tab.

### Student URL

After deployment, GitHub Pages will publish the site at:

```text
https://<your-github-username>.github.io/<your-repository-name>/
```

### Notes

- Client-side routes such as `/lesson` and `/dashboard` are supported on GitHub Pages through the included `404.html` SPA redirect.
- The build automatically uses the repository name as the GitHub Pages base path during GitHub Actions deployment.
- Student progress is stored in each student's browser using `localStorage`.
