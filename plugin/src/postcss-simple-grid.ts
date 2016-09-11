import { plugin } from 'postcss';

/**
 * return the handleGrid function. 
 * 
 * In development mode this function is reloaded on every request, so that changes
 * to the file are mmediately visible without needing to restart Webpack.
 */
function getHandleGrid() {
  if (process.env.NODE_ENV === 'production') {
    return require('./postcss-simple-grid-logic').handleGrid;
  } else {
    console.log('Using development version of simple-grid plug-in');
    const reload = require('require-reload')(require);
    return reload('./postcss-simple-grid-logic').handleGrid;
  }
}

// TODO: maybe it would make sense to split this into two files
// (prod and dev version)
export default plugin('postcss-simple-grid', () => root => {
  // walk across all rules and invoke handleGrid on 'simple-grid' nodes.
  // 'simple-grid'-nodes specify the grid
  root.walkRules(theRule => {
    if (theRule.selector === '.simple-grid') {
      const handleGrid = getHandleGrid();
      handleGrid(root, theRule);
    }
  });
});
