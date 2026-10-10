# Recipe Finder

A small, responsive recipe search app built with plain HTML, CSS, and JavaScript. Search for meals by name, browse matching recipe cards, and open a recipe to see its ingredients, measurements, cooking instructions, and (when available) a YouTube video.

Recipe data is provided by [TheMealDB](https://www.themealdb.com/api.php).

## Features

- Search recipes by meal name or keyword.
- Submit a search with the Search button or Enter key.
- Browse recipe cards with meal images and category labels.
- Open a recipe for its category, cuisine area, ingredients, measures, and instructions.
- Follow an optional YouTube link when one is supplied by the API.
- See helpful messages for empty searches, no matches, and network/API errors.
- Use recipe cards with a mouse, Enter, or Space; layout adapts to small screens.
- Uses TheMealDB's public API and requires no API key or account for the endpoints used here.

## Requirements

- A modern browser with JavaScript enabled.
- Internet access to contact TheMealDB and load recipe images.

There are no npm dependencies, build step, or environment variables.

## Run the app

1. Download or clone this project.
2. Open `index.html` in a modern browser.
3. Enter a meal name or keyword, such as `chicken`, and select **Search**.
4. Select a result card to read its recipe. Use **Back to recipes** to return to the results.

If your browser or environment restricts requests from pages opened with the `file://` scheme, serve the project directory over HTTP instead. For example, with Python installed, run this from the project folder:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000). You can stop the server with `Ctrl+C` in the terminal.

## Project files

```text
Recipe-Finder/
├── index.html   # Page structure and accessible controls
├── style.css    # Responsive layout and visual styles
├── script.js    # Search, API requests, and recipe rendering
└── README.md    # Project documentation
```

## How it works

The browser calls TheMealDB's version 1 API directly:

- `search.php?s=<term>` searches meals by name.
- `lookup.php?i=<meal-id>` retrieves a selected meal's full details.

The application builds the request URL with `encodeURIComponent`, checks for unsuccessful HTTP responses, and handles an empty result separately from a failed request. Recipe fields are rendered as text nodes so API content is not interpreted as HTML. The only inline HTML is a fixed icon label; Font Awesome is loaded from its CDN for decorative icons.

## Troubleshooting

- **No recipes found:** Try a broader meal name or a different spelling. Search is supplied by TheMealDB, so the available matches depend on its catalog.
- **Could not load recipes:** Confirm internet access and try again. The app needs TheMealDB's API and image hosts to be reachable.
- **The page loads but search fails from a local file:** Run the optional local HTTP server shown above.
- **Icons are missing:** The Font Awesome stylesheet comes from a CDN; the rest of the app works without it.

## Limitations

- Search is by meal name (`search.php?s=`); it does not provide ingredient-only, category, area, or dietary filters.
- Recipe data and images are managed by TheMealDB and may be incomplete or unavailable.
- This is a static front-end project. It has no backend, persistence, accounts, or saved favorites.

## Attribution

Thanks to [TheMealDB](https://www.themealdb.com/) for the recipe API and data. The interface uses [Font Awesome](https://fontawesome.com/) icons via CDN.
