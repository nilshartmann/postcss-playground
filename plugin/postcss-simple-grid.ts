import { plugin, Root, Container, Node, Result, rule, decl as createDecl } from "postcss";

const errorContext = {
	plugin: 'postcss-simple-grid'
};

export const determineConfigName = (prop: string) => {
		if (prop.length < 6 || prop.substring(0, 5) !== '--sg-') {
		return null;
		}

		prop = prop.substring(5);
		let lastChar;
		let result = "";

		for (let i = 0; i < prop.length; i++) {
		const c = prop.charAt(i);
		if (c === '-') {
			lastChar = c;
			continue;
		}

		result += (lastChar === '-' ? c.toUpperCase() : c);
		lastChar = c;
		}

		return result;
}

const createNode = (selector: string, ...decls: string[]) => {
		const node = rule({ selector });
		decls.forEach(d => {
			const j = d.indexOf(':');
			const prop = d.substring(0, j).trim();
			const value = d.substring(j + 1).trim();
			node.append(createDecl({ prop, value }));
		});
		return node;
};

const insertNodes = (rootNode: Container, afterNode: Node, newNodes: Node[]): Node => {
	let oldNode = afterNode;

	newNodes.forEach(newNode => { rootNode.insertAfter(oldNode, newNode); oldNode = newNode; });

	return oldNode;
}

const buildGridConfig = (gridNode: Container) => {
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

export default plugin("postcss-simple-grid", () => {

	const handleGrid = (root: Root, gridNode) => {
		const gridOptions = buildGridConfig(gridNode);
		const baseWidth = (100 / gridOptions.columns);

		const createColumnRule = (index: number, prop: 'width' | 'margin-left', name: string) => {
			const w = (baseWidth * index).toFixed(5);
			return createNode(`.sg-${name}-${index}`, prop + ':' + w + '%');
		}

		const gridRules: Node[] = [];

		for (let i = gridOptions.columns; i > 0; i--) {
			gridRules.push(createColumnRule(i, 'width', 'small'));
			gridRules.push(createColumnRule(i, 'margin-left', 'small-offset'));
		}

		const largeMq = rule({ selector: `@media screen and (min-width: ${gridOptions.largeMinWidth})` });
		for (let i = gridOptions.columns; i > 0; i--) {
			largeMq.append(createColumnRule(i, 'width', 'large'));
			largeMq.append(createColumnRule(i, 'margin-left', 'large-offset'));
		}
		gridRules.push(largeMq);

		insertNodes(root, gridNode, [
			createNode('.row, .column', 'box-sizing: border-box', 'margin: 0', 'padding: 0'),
						createNode('.column', 'float: left'),
			createNode('.row', 'max-width: 75rem', 'margin-left: auto', 'margin-right: auto'),
			createNode('.row:before, .row:after', 'content: " "', 'display: table'),
			createNode('.row:after', 'clear: both'),
			...gridRules
		]);

		gridNode.remove();


		// gridNode.first().remove();
	};

	return root => {
		root.walkRules(theRule => {
			if (theRule.selector === '.simple-grid') {
				handleGrid(root, theRule);
				// const n1 = createNode('h1', 'text: VORNE');
				// const n2 = createNode('h2', 'text: ZWEI');
				// const n3 = createNode('h3', 'text: ZWEI');
				// const x2 = root.insertAfter(n1, n2); 
				// const x3 = root.insertAfter(n2, n3);
				// theRule.remove();
			}
		});
	};
});

