import { html } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import type {
	ElementDefinitionContext, FoundationElementDefinition,
} from '@microsoft/fast-foundation';
import { classNames } from '@microsoft/fast-web-utilities';
import { Popup } from '../popup/popup';
import type { Tooltip } from './tooltip';

const getClasses = ({
	open
}: Tooltip) => classNames(
	'control',
	['open', Boolean(open)],
);

/**
	* The template for the Tooltip component.
	*
	* @param context - element definition context
	* @public
	*/
export const TooltipTemplate: (
	context: ElementDefinitionContext,
	definition: FoundationElementDefinition
) => ViewTemplate<Tooltip> = (context: ElementDefinitionContext) => {
	const popupTag = context.tagFor(Popup);

	return html`
<${popupTag} class="${getClasses}" arrow alternate
	:placement=${(x) => x.placement}
	:anchor="${x => x.anchor}"
	:open=${(x) => x.open}
  exportparts="vvd-theme-alternate">
  <div class="tooltip" role="tooltip">
    <header part="vvd-theme-alternate" class="tooltip-header">
      <div class="tooltip-text">${(x) => x.text}</div>
    </header>
  </div>
</${popupTag}>`;
};
