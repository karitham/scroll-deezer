# Deezer Volume Scroll

Firefox extension to scroll on Deezer's volume icon to adjust volume.

## Development

Uses Nix for dev environment.

### Setup & Run
```bash
nix develop
web-ext run --firefox-binary firefox-devedition
```

### Build
```bash
web-ext build
```

Creates `.zip` in `web-ext-artifacts/`.

## How it works

Content script finds volume slider, listens for wheel events, adjusts volume, and updates UI.

## Customization

Update `findVolumeElement()` in `content.js` if Deezer's volume selector changes.