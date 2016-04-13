WebVR iOS 360 video test
===============

This is just a prototype too test stereoscopic rendering of 360 video on iOS devices. It's very experimental and not meant to be used in production.

## Installation
If you've never used Node or npm before, you'll need to install Node.
If you use homebrew, do:

```
brew install node
```

Otherwise, you can download and install from [here](http://nodejs.org/download/).

### Install dependencies
```
npm install
```

### Running development environment
```
npm run dev
```

This will transpile assets and start an express server with hot module replacement middleware.

### Preview production environment
```
npm run build
npm start
```

### Code style
Depending on which editor you're using this may vary. For sublime, follow the instructions for ESLint [here](https://github.com/roadhump/SublimeLinter-eslint) and for editor config [here](https://github.com/sindresorhus/editorconfig-sublime).

## License
This repo is licensed under [The MIT License (MIT)](LICENSE).
