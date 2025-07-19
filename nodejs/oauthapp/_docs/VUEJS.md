## Add Vuejs SPA to an already running nodejs WebApp

### Install Vuejs Dependencies
```JavaScript
npm install vue vue-loader vue-template-compiler @vue/compiler-sfc vue-style-loader css-loader
npm install --save-dev webpack webpack-cli webpack-dev-server

```

### Create a Vue.js Entry Point
Create a directory for your Vue.js components and setup:
- `src/main.js`
```JavaScript
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

- `src/App.Vue`
```html
<template>
    <div id="app">
        <h1>Simulated SPA with Vue.js</h1>
        <button @click="incrementCount">Click Me</button>
        <p>Button clicked {{ count }} times</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            count: 0
        };
    },
    methods: {
        incrementCount() {
            this.count += 1;
        }
    }
};
</script>

<style>
#app {
    font-family: Arial, sans-serif;
    text-align: center;
    margin-top: 50px;
}
</style>
```

- `src/index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue SPA Page</title>
</head>
<body>
    <div id="app"></div>
    <script src="/bundle.js"></script>
</body>
</html>

```

### Set Up Webpack
If you don’t have a webpack.config.js file, create one to compile your Vue.js application:
```JavaScript
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm-browser.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    devServer: {
        static: './public',
    }
};

```

### Integrate Vue.js with Your Existing Express App
Assuming your Node.js app is using Express, add a route to serve the Vue.js SPA page:
1. Set Up Static Middleware: Ensure your static files (including the Vue.js bundle) are served correctly.
```JavaScript
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the Vue.js SPA at a specific route
app.get('/vue-spa', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Other routes for your Node.js app
app.get('/', (req, res) => {
    res.send('Welcome to the existing Node.js app!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

```

### Build and Serve Your Vue.js App
You can build your Vue.js app by running Webpack:
```bash
npx webpack --mode production
```
This command generates the bundle.js file in your public/js directory.

### Access the Vue.js SPA
Now, when you navigate to http://localhost:3000/vue-spa, the Vue.js SPA will be served within your existing Node.js web application.