import * as fs from 'fs';

import { expect } from 'chai';
import * as postcss from 'postcss';
import plugin, { determineConfigName } from './postcss-simple-grid';


describe('simple-grid transformations', () => {
  describe('determineConfigName works', () => {
    it('refuses properties not starting with prefix', () => {
      expect(determineConfigName('xyz')).to.equal(null);
      expect(determineConfigName('--gs-')).to.equal(null);
      expect(determineConfigName('--sg-')).to.equal(null);
    })
    it('correctly transform names', () => {
      expect(determineConfigName('--sg-columns')).to.equal("columns");
      expect(determineConfigName('--sg-large-max-width')).to.equal("largeMaxWidth");
    })
  });
  it('uses default configuration', () => {
    checkFromTestFile('it-uses-config');
  });
    it('renders 3 col grid with custom large break point', () => {
    checkFromTestFile('it-creates-3-col-grid-with-30em-lmq');
  });
});

const checkFromTestFile = (name: string) => {
  const inFile = `${__dirname}/specs/${name}.in.css`;
  const outFile = `${__dirname}/specs/${name}.out.css`;

  const inCss = fs.readFileSync(inFile).toString().trim();
  const outCss = fs.readFileSync(outFile).toString().trim();

  check(inCss, outCss);
}

/** 
 * From: https://github.com/jedmao/postcss-circle/blob/master/test/plugin.ts 
 * Credits to https://github.com/jedmao 
 * */
const check = (actual: string, expected?: string | RegExp) => {
		const processor = postcss().use(plugin);
		if (expected instanceof RegExp) {
    expect(() => {
      return processor.process(stripTabs(actual)).css;
    }).to.throw(expected);
    return;
		}
		expect(
    processor.process(stripTabs(actual)).css
		).to.equal(
    stripTabs(<string>expected)
    );
}

function stripTabs(input: string) {
		return input.replace(/\t/g, '');
}

// This is only to create test data ---------------------------------------------------------
const createSpecData = (name: string) => {
  const inFile = `${__dirname}/specs/${name}.in.css`;
  const outFile = `${__dirname}/specs/${name}.out.css`;

  console.log('READING SPEC DATA FROM ' + inFile);
  const inCss = fs.readFileSync(inFile).toString().trim();

  const processor = postcss().use(plugin);
  const outCss = processor.process(inCss).css;
  console.log(outCss);

  fs.writeFileSync(outFile, outCss);
  console.log('SPEC DATA WRITTEN TO ' + outFile);
};

  // createSpecData('very-simple');