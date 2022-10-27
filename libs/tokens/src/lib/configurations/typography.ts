const SD = require('style-dictionary');

import { prefix, buildPath, selector } from '../common';
import fontWeight from '../transforms/font-weight';
import fontSize from '../transforms/font-size';
import typographyShorthand from '../transforms/typography-shorthand';
import { isTypography } from '../filters';


SD.registerTransform(fontWeight);
SD.registerTransform(fontSize);
SD.registerTransform(typographyShorthand);

export default {
	source: [
		'../../../../node_modules/@vonage/vivid-figma-tokens/data/globals/font.tokens.json',
		'../../../../node_modules/@vonage/vivid-figma-tokens/data/globals/typography-scale.tokens.json',
		'../../../../node_modules/@vonage/vivid-figma-tokens/data/typography.tokens.json'
	],
	platforms: {
		css: {
			transforms: ['attribute/cti', 'name/cti/kebab', 'type/fontWeight', 'type/fontSize', 'typography/shorthand'],
			prefix,
			buildPath,
			files: [{
				destination: '_typography.tokens.scss',
				format: "css/themeableVariables",
				filter: token => isTypography(token) || token.public,
				options: {
					selector
				}
			}]
		}
	}
};
