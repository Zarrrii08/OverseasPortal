Place images used by the site in this folder.

Recommended structure:

- public/images/ - static images served as-is (good for logos, backgrounds referenced in CSS/HTML)
  - logo.png
  - login-hero.jpg

If you prefer the bundler to process images (hashing and optimizations), create `src/assets/images/` and import them in components:

import hero from '../assets/images/login-hero.jpg'

Use `public/` for quick prototyping and assets referenced from non-JS (index.html or global CSS).
