import { plugin, Root, Container, Node, Rule, rule as createRule, decl as createDecl } from "postcss";

const errorContext = {
	plugin: 'postcss-simple-grid'
};

/**
 * Converts a CSS property name (eg --sg-max-width) to a config property name (maxWidth)
 * @return null in case the property name could not be converted (invalid format) otherwise converted string
 */
export const determineConfigName = (prop: string): string => {
	if (prop.length < 6 || prop.substring(0, 5) !== '--sg-') {
		return null;
	}

	let lastChar;
	let result = "";

	for (let i = 5; i < prop.length; i++) {
		const c = prop.charAt(i);

		if (c !== '-') {
			result += (lastChar === '-' ? c.toUpperCase() : c);
		}

		lastChar = c;
	}

	return result;
}

/**
 * Creates a Rule with specified declarations. 
 * 
 * @param {string} selector: The selector for this rule ('.column')
 * @param {string[]} decls: Declarations specified as String like in a CSS file ('prop: value')
 */
const createConfiguredRule = (selector: string, ...decls: string[]): Rule => {
	const node = createRule({ selector });
	decls.forEach(d => {
		const j = d.indexOf(':');
		const prop = d.substring(0, j).trim();
		const value = d.substring(j + 1).trim();
		node.append(createDecl({ prop, value }));
	});
	return node;
};

/** 
 * Inserts the specified behind a specified Node
 *  
 * @param {Container} rootNode: The Root Node of the CSS
 * @param {Node} afterNode: the reference node, after which the new nodes should be added
 * @param {Node[]} newNodes: Nodes to add
 * @return {Node} The last node that has been added (i.e. the last node from the newNodes array)
 * 
*/
const insertNodes = (rootNode: Container, afterNode: Node, newNodes: Node[]): Node => {
	return newNodes.reduce((oldNode, newNode) => { rootNode.insertAfter(oldNode, newNode); return newNode }, afterNode);
}

/** 
 * Describes the object with configuration paramters that is used to configure the resulting grid
 */
interface IGridConfig {
	columns: number,
	maxWidth: string,
	largeMinWidth: string
}

/**
 * Reads the grid configuration from the grid configuration rule ('.simle-grid')
 * 
 * @return {IGridConfig} the fully configured IGridConfig object
 */
const buildGridConfig = (gridNode: Container): IGridConfig => {
	const gridOptions = {
		columns: 12,
		maxWidth: '90rem',
		largeMinWidth: '40em'
	};

	// Iterate over config properties
	gridNode.walkDecls(candidate => {
		const prop = candidate.prop;
		const configName = determineConfigName(prop);
		if (!configName || !gridOptions.hasOwnProperty(configName)) {
			throw candidate.error(`Invalid Property '${prop}'`, errorContext);
		}
		gridOptions[configName] = candidate.value;
	});

	return gridOptions;
}

/**
 * Handles the CSS '.simple-grid' rule and builds the grid from it
 */
const handleGrid = (root: Root, gridRule: Rule) => {
	// this will hold all rules that have been created during the transformation
	const gridRules: Node[] = [];

	// Read configuration from .simple-grid-Rule
	const gridOptions = buildGridConfig(gridRule);

	const createColumnRule = (index: number, prop: 'width' | 'margin-left', name: string) => {
		const w = ((100 / gridOptions.columns) * index).toFixed(5);
		return createConfiguredRule(`.sg-${name}-${index}`, prop + ':' + w + '%');
	}
	
	// create column rules
	for (let i = gridOptions.columns; i > 0; i--) {
		gridRules.push(createColumnRule(i, 'width', 'small'));
		gridRules.push(createColumnRule(i, 'margin-left', 'small-offset'));
	}

	// create 'large' column rules
	const largeMq = createRule({ selector: `@media screen and (min-width: ${gridOptions.largeMinWidth})` });
	for (let i = gridOptions.columns; i > 0; i--) {
		largeMq.append(createColumnRule(i, 'width', 'large'));
		largeMq.append(createColumnRule(i, 'margin-left', 'large-offset'));
	}
	gridRules.push(largeMq);

	// add created rules to CSS
	insertNodes(root, gridRule, [
		createConfiguredRule('.row, .column', 'box-sizing: border-box', 'margin: 0', 'padding: 0'),
		createConfiguredRule('.column', 'float: left'),
		createConfiguredRule('.row', 'max-width: 75rem', 'margin-left: auto', 'margin-right: auto'),
		createConfiguredRule('.row:before, .row:after', 'content: " "', 'display: table'),
		createConfiguredRule('.row:after', 'clear: both'),
		...gridRules
	]);

	// remove the '.simple-grid' rule from the output
	gridRule.remove();
};

export default plugin("postcss-simple-grid", () => root => {
	root.walkRules(theRule => {
		if (theRule.selector === '.simple-grid') {
			handleGrid(root, theRule);
		}
	});
});

