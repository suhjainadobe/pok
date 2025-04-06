# POK-V2

A web-based interactive content player.

## Project Structure
```
.
├── index.html              # Main entry point
├── assets/
│   ├── js/
│   │   ├── init.js        # Core initialization logic
│   │   ├── CPXHRLoader.js # Resource loader
│   │   ├── jquery-3.3.1.min.js
│   │   └── CPM.js
│   ├── css/
│   │   └── CPLibraryAll.css
│   └── htmlimages/
│       └── loader.gif
└── dr/
    ├── imgmd.json         # Image metadata
    ├── img1.json
    ├── img2.json
    └── img3.json
```

## Hosting
This project is hosted using GitHub Pages. You can access it at: `https://<username>.github.io/pok-v2/POK-V2/`

## Development
The project uses a modular structure with separated concerns:
- HTML structure in index.html
- Core initialization logic in init.js
- Styles in CPLibraryAll.css
- Resource loading handled by CPXHRLoader.js

## Usage
To use this in your project, simply link to the GitHub Pages URL:
```html
<a href="https://<username>.github.io/pok-v2/POK-V2/" class="button">Open POK-V2</a>
``` 