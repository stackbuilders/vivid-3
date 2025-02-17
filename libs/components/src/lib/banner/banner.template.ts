import { html, slotted, when } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import type {
	ElementDefinitionContext,
	FoundationElementDefinition,
} from '@microsoft/fast-foundation';
import { classNames } from '@microsoft/fast-web-utilities';
import { affixIconTemplateFactory, IconWrapper } from '../../shared/patterns/affix';
import { Button } from '../button/button';
import type { Banner } from './banner';

const getClasses = (_: Banner) => classNames(
	'control',
	[`connotation-${_.connotation}`, !!_.connotation]
);

/**
 *
 */
function renderDismissButton(buttonTag: string) {
	return html<Banner>`
	  <${buttonTag}
	  		aria-label="${x => x.dismissButtonAriaLabel || x.locale.banner.dismissButtonLabel}"
			part="vvd-theme-alternate"
			size="condensed"
			class="dismiss-button"
			icon="close-line"
			@click="${x => x.remove()}">
	  </${buttonTag}>`;
}

/**
 * The template for the Banner component.
 *
 * @param context - element definition context
 * @public
 */
export const BannerTemplate: (
	context: ElementDefinitionContext,
	definition: FoundationElementDefinition
) => ViewTemplate<Banner> = (context: ElementDefinitionContext) => {
	const affixIconTemplate = affixIconTemplateFactory(context);
	const buttonTag = context.tagFor(Button);

	return html<Banner>`
	  <div class="${getClasses}" 
	  tabindex="${x => (x.removable || (x.actionItemsSlottedContent && x.actionItemsSlottedContent.length) ? '0' : null)}">
		  <header class="header">
					<div class="content">
            ${x => affixIconTemplate(x.conditionedIcon, IconWrapper.Slot)}
						<div class="banner-message"
						 role="${x => x.role ? x.role : 'status'}"
						 aria-live="${x => x.ariaLive ? x.ariaLive : 'polite'}">
									${x => x.text}
            </div>
						<slot class="action-items" ${slotted('actionItemsSlottedContent')} name="action-items"></slot>
					</div>

			  ${when(x => x.removable, renderDismissButton(buttonTag))}
		  </header>
	  </div>
	`;
};

