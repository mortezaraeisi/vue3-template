# Vue3-template

This is a Vue3 template that I build my projects up constantly around it.

Being fan of [Quasar framework](https://quasar.dev), as a replacement, I prefer using Vue3 and [Tailwind CSS](https://tailwindcss.com/docs/installation).

## Recommended IDE Setup
This project is entirely developing via [Webstorm](https://www.jetbrains.com/webstorm/) IDE.
We have been hearing --evey where almost-- to use VSCode, from my experience, [Jetbrains](https://www.jetbrains.com) IDEs are wonderful and the best option on the table, but it's not free.

Feel free and use your favorite IDE.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
