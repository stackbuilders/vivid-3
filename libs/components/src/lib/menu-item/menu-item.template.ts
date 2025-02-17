import { elements, ExecutionContext, html, slotted, ViewTemplate, when } from '@microsoft/fast-element';
import type { ElementDefinitionContext, MenuItemOptions } from '@microsoft/fast-foundation';
import { classNames } from '@microsoft/fast-web-utilities';
import { affixIconTemplateFactory } from '../../shared/patterns/affix';
import { Icon } from '../icon/icon';
import { Menu } from '../menu/menu';
import { CheckAppearance, MenuItem, MenuItemRole } from './menu-item';
import { focusTemplateFactory } from './../../shared/patterns/focus';

const getIndicatorIcon = (x: MenuItem) => {
	if (x.checkedAppearance === CheckAppearance.TickOnly) {
		return x.checked ? 'check-line' : '';
	}

	const iconType = x.role === MenuItemRole.menuitemcheckbox ? 'checkbox' : 'radio';
	const iconStatus = x.checked ? 'checked' : 'unchecked';
	return `${iconType}-${iconStatus}-2-line`;
};

const getClasses = ({
	disabled, checked, role, text, textSecondary, icon, metaSlottedContent, checkTrailing
}: MenuItem) => classNames(
	'base',
	['disabled', Boolean(disabled)],
	['selected', role !== MenuItemRole.menuitem && Boolean(checked)],
	['trailing', role !== MenuItemRole.menuitem && (checkTrailing || Boolean(icon))],
	['item-checkbox', role === MenuItemRole.menuitemcheckbox],
	['item-radio', role === MenuItemRole.menuitemradio],
	['two-lines', Boolean(text?.length) && Boolean(textSecondary?.length)],
	['has-meta', Boolean(metaSlottedContent?.length)]
);

function handleClick(x: MenuItem, { event }: ExecutionContext<MenuItem>) {
	x.handleMenuItemClick(event as MouseEvent);
	return (x as any).role === MenuItemRole.presentation;
}

function checkIndicator(context: ElementDefinitionContext) {
	const iconTag = context.tagFor(Icon);

	return html<MenuItem>`${when(x => x.role === MenuItemRole.menuitemcheckbox || x.role === MenuItemRole.menuitemradio,
		html`<span class="action"><${iconTag} class="icon" name="${x => getIndicatorIcon(x)}"></${iconTag}></span>`)}`;
}

function text() {
	return html<MenuItem>`${when(x => x.text || x.textSecondary,
		html`<span class="text">
			${when(x => x.text, html`<span class="text-primary">${x => x.text}</span>`)}
			${when(x => x.textSecondary, html`<span class="text-secondary">${x => x.textSecondary}</span>`)}
		</span>`)}`;
}

/**
 * Generates a template for the (MenuItem:class) component using
 * the provided prefix.
 *
 * @param context - element definition context
 * @public
 */
export const MenuItemTemplate: (context: ElementDefinitionContext, definition: MenuItemOptions
) => ViewTemplate<MenuItem> = (context: ElementDefinitionContext) => {
	const affixIconTemplate = affixIconTemplateFactory(context);
	const focusTemplate = focusTemplateFactory(context);
	const iconTag = context.tagFor(Icon);

	return html<MenuItem>`
	<template
		role="${x => (x.role ? x.role : MenuItemRole.menuitem)}"
		aria-haspopup="${x => (x.hasSubmenu ? 'menu' : void 0)}"
		aria-checked="${x => (x.role !== MenuItemRole.menuitem ? x.checked : void 0)}"
		aria-disabled="${x => x.disabled}"
		aria-expanded="${x => x.expanded}"
		@keydown="${(x, c) => x.handleMenuItemKeyDown(c.event as KeyboardEvent)}"
		@click="${handleClick}"
		@mouseover="${(x, c) => x.handleMouseOver(c.event as MouseEvent)}"
		@mouseout="${(x, c) => x.handleMouseOut(c.event as MouseEvent)}"
	>
		<div class="${getClasses}">
			${() => focusTemplate}
			<slot name="meta" ${slotted('metaSlottedContent')}></slot>
			${checkIndicator(context)}
			${when(x => x.icon, html`<span class="decorative">${x => affixIconTemplate(x.icon)}</span>`)}
			${text()}
			${when(x => x.hasSubmenu, html`<${iconTag} class="chevron" name="chevron-right-line"></${iconTag}>`)}
		</div>
		<slot name="submenu" ${slotted({ property: 'slottedSubmenu', filter: elements(context.tagFor(Menu)) })}></slot>
	</template>
	`;
};
