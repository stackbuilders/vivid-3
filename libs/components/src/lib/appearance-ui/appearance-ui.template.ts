import { html } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import type {
	ElementDefinitionContext,
	FoundationElementDefinition,
} from '@microsoft/fast-foundation';
import { classNames } from '@microsoft/fast-web-utilities';
import type { AppearanceUi } from './appearance-ui';

const getClasses = ({appearance, hovered, active, selected, disabled, readonly} : AppearanceUi) => classNames(
	'base',
	[`appearance-${appearance}`, Boolean(appearance)],
	['hover', Boolean(hovered)],
	['active', Boolean(active)],
	['checked selected', Boolean(selected)],
	['disabled', Boolean(disabled)],
	['readonly', Boolean(readonly)],
);


/**
 * The template for the AppearanceUi component.
 *
 * @param context - element definition context
 * @public
 */
export const AppearanceUiTemplate: (
	context: ElementDefinitionContext,
	definition: FoundationElementDefinition,
) => ViewTemplate<AppearanceUi> = () => {
	return html` <div class="wrapper">
		<span class="${getClasses} connotation-accent">accent</span>
		<span class="${getClasses} connotation-cta">cta</span>
		<span class="${getClasses} connotation-success">success</span>
		<span class="${getClasses} connotation-alert">alert</span>
		<span class="${getClasses} connotation-warning">warning</span>
		<span class="${getClasses} connotation-information">information</span>
		<span class="${getClasses} connotation-announcement">announcement</span>
	</div>
	`;
};
