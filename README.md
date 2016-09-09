# PostCSS Playground

This is my playground for PostCSS experiments. It consists of a simple plug-in (`simple-grid`), that is implemented in TypeScript. 

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

# Install and run

1. Clone this repo
2. Run `npm install`
3. Run `npm run install-types` to install the TypeScript type definitions for PostCSS etc
4. Run `npm test` to execute the plug-in tests
5. Run `npm plugin:build` to build the plug-in
6. Run `npm start` to start a webpack dev server. The sample "applications" defines a single CSS file that makes use of the plugin. The result can be found at http://localhost:3333





