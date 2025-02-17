import { applyMixins, FoundationElement } from '@microsoft/fast-foundation';
import {attr, observable} from '@microsoft/fast-element';
import { Localized } from '../../shared/patterns';

// eslint-disable-next-line compat/compat
export const isDialogSupported = Boolean(HTMLDialogElement && HTMLDialogElement.prototype.showModal);

// Make sure we support Safari 14
let dialogPolyfill: any;
(async () => {
	if (!isDialogSupported) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		delete window.HTMLDialogElement;
		dialogPolyfill = await import('dialog-polyfill');
	}
})();

/**
 * Types of icon placement
 *
 * @public
 */
export type IconPlacement = 'top' | 'side';

/**
 * Base class for dialog
 *
 * @public
 * @slot graphic - Use the graphic slot in order to replace the icon.
 * @slot body - Use the body slot in order to add custom HTML to the dialog.
 * @slot footer - Use the footer slot in order to add action buttons to the bottom of the dialog.
 * @slot main - Assign nodes to the main slot to fully override a dialog’s predefined flow and style with your own.
 * @slot action-items - Use the action-items slot in order to add action buttons to the bottom of the dialog.
 * @event close - Fired when the dialog is closed.
 */
export class Dialog extends FoundationElement {
	/**
	 * Indicates dialog's state
	 *
	 * @public
	 * @remarks
	 * HTML Attribute: open
	 */
	@attr({mode: 'boolean'}) open = false;
	@attr icon?: string;
	@attr({attribute: 'icon-placement'}) iconPlacement?: IconPlacement;
	@attr subtitle?: string;
	@attr headline?: string;
	@attr ({attribute: 'full-width-body', mode: 'boolean'}) fullWidthBody = false;
	@attr({attribute: 'aria-label'}) override ariaLabel: string | null = null;
	@attr({attribute: 'dismiss-button-aria-label'}) dismissButtonAriaLabel: string | null = null;
	@attr ({attribute: 'no-light-dismiss', mode: 'boolean'}) noLightDismiss = false;

	#modal = false;

	set returnValue(value) {
		this.#dialog.returnValue = value;
	}

	get returnValue(): string {
		return this.#dialog?.returnValue;
	}


	/**
	 * @internal
	 */
	get modal() {
		return this.#modal;
	}

	#dialogElement?: HTMLDialogElement;

	get #dialog() {
		if (!this.#dialogElement) {
			this.#dialogElement = this.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
			if (this.#dialogElement) {
				this.#dialogElement.open = this.open;
				if (dialogPolyfill) {
					dialogPolyfill.registerDialog(this.#dialogElement);
				}
			}
		}
		return this.#dialogElement as HTMLDialogElement;
	}

	/**
	 * @internal
	 */
	openChanged(oldValue: boolean, newValue: boolean) {
		if (oldValue === undefined) {
			return;
		}
		if (!newValue) {
			this.close();
		} else {
			if (this.#dialog) {
				this.#dialog.open = true;
			}
		}
	}

	#handleScrimClick = (event: MouseEvent) => {
		if (event.target !== this.#dialog || this.noLightDismiss) {
			return;
		}
		const rect = this.#dialog.getBoundingClientRect();

		const clickedInDialog = (
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width
		);

		this.open = clickedInDialog;
	};

	#handleInternalFormSubmit = (event: SubmitEvent) => {
		if ((event.target as HTMLFormElement).method !== 'dialog') {
			return;
		}

		this.open = false;
	};

	close() {
		if (this.#dialog.open) {
			this.#dialog.close();
			this.$emit('close', this.returnValue, { bubbles: false });
		}

		this.open = false;
		this.#handleModal(false);
	}

	#handleModal(show: boolean) {
		this.#modal = show;
		this.#dialog.toggleAttribute('aria-modal', show);
		this.#dialog.classList.toggle('modal', show);
	}

	show() {
		this.#dialog.show();
		this.open = true;
	}

	showModal() {
		this.#handleModal(true);
		this.#dialog.showModal();
		this.open = true;
	}

	override connectedCallback() {
		super.connectedCallback();
		this.#dialog.addEventListener('mousedown', this.#handleScrimClick);
		this.#dialog.addEventListener('submit', this.#handleInternalFormSubmit);
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		this.#dialog.removeEventListener('mousedown', this.#handleScrimClick);
		this.#dialog.removeEventListener('submit', this.#handleInternalFormSubmit);
	}


	/**
	 * @internal
	 */
	@observable bodySlottedContent?: HTMLElement[];
	/**
	 * @internal
	 */
	@observable footerSlottedContent?: HTMLElement[];
	/**
	 * @internal
	 */
	@observable actionItemsSlottedContent?: HTMLElement[];

}

export interface Dialog extends Localized {}
applyMixins(Dialog, Localized);
