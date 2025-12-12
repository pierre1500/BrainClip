# BrainClip Extension Icons

This folder should contain the extension icons in PNG format:
- `icon16.png` - 16x16 pixels (toolbar)
- `icon48.png` - 48x48 pixels (extensions page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Generating Icons

You can generate PNG icons from the provided SVG using any image editor or online converter.

### Using ImageMagick (if installed):
```bash
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

### Placeholder Icons

For development, you can create simple placeholder icons or use an online favicon generator.

The extension will work without icons, but Chrome will display a default puzzle piece icon.
