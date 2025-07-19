# Vue.js
Is progressive JS framework for building user interfaces and SPAs.
- component based architecture
- supports 2-way bindings
- Meta frmework Nuxt.js (on top of Vuejs) also allows you to build server-side rendering (SSR), and static site generation (SSG) websites. It is simillar to next.js for react.

## Why Vuejs
- Simplicity and Approachability (Angular & React are relatively difficult to learn)
- Flexibility
- Performance & Size
- Component based architecture
- Active community & rich echosystem ()

## Vite
Is the build tool that powers the developers to build reactjs or vuejs application in much easier and faster way. It is comparable to webpack.

## Vue Components
- Reusable, self-contained piece of code.
- It contains 3 things: logic or js, template/dynamic html, and scoped styling.
- Option API (Vue js v2) vs Composition API (Vue js v3) 

## Getting Started
- CDN: Include the script tag with CDN url

- Vue CLI - Command line interafce for setting up vue projects (**not recommended any more**)

- Create Vue - It uses Vite which includes features like hot-reloading, out of the box Typescripts and an ecosystem of plugins.

- Nuxt.js - SSR & SSG frameworks that use Vue

## Create an App using Vite
```
npm create vue@latest northwind

cd northwind

npm install

npm run dev
```

## Vuejs Component Lifecycle Events (common ones)

    - onBeforeMount()
    - onMounted()
    - onBeforeUpdate()
    - onBeforeUnMount()
    - onUnMounted()
    - onActivated()
    - onDeactivated()
    - onErrorCaptured()

## Install Tailwind CSS using vite
//install
```sh

npm install tailwindcss @tailwindcss/vite
```

//update vite.config.ts
```
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

//src/assets/main.css (remove everything else from this file except below content)
```css
/* ./src/index.css */
@import "tailwindcss";

```

## Install Prime Icons
```bash
npm install primeicons
```

//Include the css in the main.js
```js
import 'primeicons/primeicons.css';
```


## Using Router (optional: not needed if you have already made the selection during project creation)
//install react router
```bash
npm install vue-router

```

//create a route file (./route/index.js)
```js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
    ]
});

export default router;
```

//Import the route into the startup file main.js and link to the app
```js
import '@/assets/main.css'
import 'primeicons/primeicons.css';
import router from '@/router/index';

import { createApp } from 'vue'
import App from '@/App.vue'

// createApp(App).mount('#app')

const app = createApp(App);

app.use(router);

app.mount('#app');

```

//Create a view page for home page (view page is nothing but a collection of components) e.g. /views/HomeView.vue
It looks same as a component
```vue
<script setup>
  import Hero from '@/components/Hero.vue'
  import HomeCards from '@/components/HomeCards.vue'
  import JobListings from '@/components/JobListings.vue'
</script>

<template>
  <Hero title="Test Title"/>
  <HomeCards/>
  <JobListings :limit="3" :showButton="true"/>
</template>
```

//Add the router view (router view is a placeholder that would load the view page based on your route selection)
```vue
<script setup>
  import Navbar from '@/components/Navbar.vue'
  import { RouterView } from 'vue-router';
</script>

<template>
  <Navbar/>
  <RouterView />
</template>
```

//In navigation, change the <a> tag with <RouterLink>
Why: href link does page refres, RouterLink stops that
```html
              <a
                  href="/"
                  class="text-white bg-green-900 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                  >Home</a
                >
```

```html
<RouterLink
                  to="/"
                  class="text-white bg-green-900 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                  >Home</RouterLink>
```

## JSON Server
to load a json and server from a http endpoint
```
npm install -D json-server
```

## Loading Hour Glass or Spinner to the page
```
npm install vue-spinner
```



## Adding nice notification to the page
```
npm install vue-toastification@next
```

//add to main.js
```
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

app.use(Toast);
```

// On the page where you need notification
```
import {useToast} from 'vue-toastification';

const toast = useToast();

toast.error('Error in adding job.', error)

toast.success('Job added successfully.');

```

## Need for env.d.ts file
If you are creating project using Vite, Vite injects environment variables using import.meta.env, but TypeScript doesn't know about them unless you explicitly add Vite’s type definitions.

//env.d.ts
```ts
/// <reference types="vite/client" />
```
This line tells TypeScript that this project is using Vite, so include Vite-specific environment typings.

Note: TypeScript does not natively understand .vue files. You must manually tell it how to interpret them.

Example:
```
// Inside env.d.ts or shims-vue.d.ts
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

**To extend import.meta.env for custom variables**
You can define custom environment variable types for your Vite app:

```ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## Making production ready. (converting *.vue and *.ts to *.js files)

1. Make sure the env.d.ts file exists for the Typescript to undestand *.vue and environment variables so that it can translate them to js.

2. Make sure the tsconfig.json file defines the location of env.d.ts and *.ts files so that the Vite builder can pick them up and conver them to js.

```json
{
    "compilerOptions": {
      "target": "esnext",
      "module": "esnext",
      "moduleResolution": "node",
      "strict": true,
      "jsx": "preserve",
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "resolveJsonModule": true,
      "allowSyntheticDefaultImports": true,
      "baseUrl": "./",
      "outDir": "./dist",
      "paths": {
        "@/*": ["src/*"]
      }
    },
    "include": [
      "src/**/*.ts",
      "src/**/*.d.ts",
      "src/**/*.tsx",
      "src/**/*.vue",
      "./env.d.ts",
    ],
    "exclude": [
      "node_modules",
      "dist"
    ]
  }
  
```

## Run the built code
**Note:** Vite builds static client-side files (HTML, JS, CSS) meant to be served by a static server — not run with Node.js directly.

You need to serve the dist/ folder via a static file server. You have 2 main options:

**_Option1_**: Preview locally for testing
```bash
npm run preview
```

**_Option2_**: Use a static file server:
```bash
npm install -g serve
serve dist
```

## vite.config.ts
**This file is used by vite for development and preview testing only. It has no use in production.**
"vite build" produces static output. It converts the *.vue and *.js that can run from the user browser. There is no server side rendering. It means "vite.config.ts" is never used.

VITE exposes only environment variables that starts with VITE_ in the development environment. It reads the .env file.

When you build the code, it reads the VITE_ variables from .env.production file, and replaces the value in the built code whereever it is referred.

VITE_ variables are referred in the code as "import.meta.env.VITE_API_URL".



