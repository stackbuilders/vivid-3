import path from 'path';
import { mergeConfig } from 'vite';

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
	stories: ['../../vue-wrappers/stories/*.stories.js'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
	async viteFinal(config) {
		return mergeConfig(config, {
			resolve: {
				alias: {
					'@vonage/vivid': path.resolve(__dirname, '../../../dist/libs/components/index.js'),
					'@vonage/vivid-vue': path.resolve(__dirname, '../../../dist/libs/vue-wrappers/index.es.js'),
				},
			},
		});
	},
};
export default config;
