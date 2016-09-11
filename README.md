# PostCSS Playground

This is my playground for [PostCSS](http://postcss.org/) experiments. It consists of a simple plug-in (`simple-grid`), that is implemented in [TypeScript](https://www.typescriptlang.org/). 

## Plug-in

The sample plug-in generates a very simple grid from a specification declared in css:
```css

.simple-grid {
  --sg-max-width: 960px;
  --sg-columns: 3
}
```

Will be transformed to something like this:

```css
.row, .column { . . . }
.column { . . . }
.row { . . . }
.row:before, .row:after { . . . }

.sg-small-3 {
    width: 100.00000%
}
.sg-small-offset-3 {
    margin-left: 100.00000%
}
.sg-small-2 {
    width: 66.66667%
}
.sg-small-offset-2 {
    margin-left: 66.66667%
}
. . .

@media screen and (min-width: 40em) {
    .sg-large-3 {
        width: 100.00000%
    }
    .sg-large-offset-3 {
        margin-left: 100.00000%
    }
    .sg-large-2 {
        width: 66.66667%
    }
    .sg-large-offset-2 {
        margin-left: 66.66667%
    }
    . . .
}
```


# Usage
1. Clone this repo
2. Run `npm install`

To build the plug-in, run `npm build`. This will build the plugin to `plugin/dist`.

Otherwise you can run a [webpack dev server](https://webpack.github.io/docs/webpack-dev-server.html) for developing the plug-in itself (see below)

## Run and test the plug-in (development mode)

1. Run `npm start` to start a webpack dev server. 
2. Open http://localhost:3333 to see the example page.

The webpack server detects changes both to the example stylesheets (`example/styles.css`) and also on the source code of the plugin. (`plugin/src`). Changes to these file 
trigger webpack to re-build the final CSS file.
This way you can develop the plug-in and see it's results for testing very easy in your browser.

To make it easier to see the generated CSS code the webpack configuration adds the [ExtractTextPlugin](https://github.com/webpack/extract-text-webpack-plugin) to write the CSS to it's own file. You can watch it in your browser.
The downside is, that files generated with `ExtractTextPlugin` cannot be hot reloaded, so you have to refresh your browser manually.

## Run the plug-in tests

There are some tests for the plug-in using [mocha](https://mochajs.org/) test framework and [chai](http://chaijs.com/) assertion library.
You can run the plug-in tests with `npm test`. This commands starts a mocha process in watching mode so that changes to the plug-in's source code lead to re-execution of the test suite.

## Why webpack at all?

For building a postcss plug-in Webpack might not be the perfect choice (consier an npm-only or grunt/gulp-based build process insteadt). But as I'm using
webpack in my [React](https://facebook.github.io/react/) projects I just wanted to find a way how to integrate postcss (including developing own plug-ins) in a webpack-based build process.

