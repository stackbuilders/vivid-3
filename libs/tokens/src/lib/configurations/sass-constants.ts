
const SD = require('style-dictionary');

import { prefix, buildPath, selector } from '../common';
import cssThemeableVariables from '../formatters/sass-constants';
import { isSource } from '../filters';

SD.registerFormat(cssThemeableVariables);


export default {
	source: [
		'../../../../node_modules/@vonage/vivid-figma-tokens/data/themes/light/semantics.tokens.json',
		'../../../../node_modules/@vonage/vivid-figma-tokens/data/themes/light/elevation.tokens.json',
		'../../../../node_modules/@vonage/vivid-figma-tokens/data/typography.tokens.json'
	],
	include: [
		'../../../../node_modules/@vonage/vivid-figma-tokens/data/globals/**/*.tokens.json'
	],
	platforms: {
		scss: {
			transforms: ["name/cti/kebab"],
			prefix,
			buildPath,
			files: [{
				destination: '_tokens.constants.scss',
				format: "sass/constants",
				filter: token => isSource(token) || token.public,
				options: {
					selector
				}
			}]
		}
	}
};