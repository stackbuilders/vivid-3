import { attr } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { arrow, autoUpdate, computePosition, flip, hide, inline, offset, Strategy } from '@floating-ui/dom';
import type { Placement } from '@floating-ui/dom';
import { keyEscape } from '@microsoft/fast-web-utilities';

/**
 * Base class for popup
 *
 * @public
 */
export class Popup extends FoundationElement {
	get #arrowPosition(): any { return { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }; }
	get #padding(): number { return 0; }
	get #distance(): number { return 12; }
	get #strategy(): Strategy { return 'fixed'; }
	get #middleware(): Array<any> {
		const middleware = [flip(), hide(), inline()];
		if (this.arrow) { middleware.push(arrow({ element: this.arrowEl, padding: this.#padding }), offset(this.#distance)); }
		return middleware;
	}

	#cleanup?: () => void; // cleans the autoupdate

	#anchorEl: Element | null | undefined;

	popupEl!: HTMLElement;

	arrowEl!: HTMLElement;

	/**
	 * indicates whether the popup is open
	 *
	 * @public
	 * HTML Attribute: open
	 */
	@attr({
		mode: 'boolean',
	}) open = false;

	/**
	 * adds close button to the popup
	 *
	 * @public
	 * HTML Attribute: dismissible
	 */
	@attr({
		mode: 'boolean',
	}) dismissible = false;

	/**
	 * determines if popup can be light dismissed
	 *
	 * @public
	 * HTML Attribute: light-dismiss
	 */
	@attr({
		mode: 'boolean', attribute: 'light-dismiss'
	}) lightDismiss = false;

	/**
	 * adds small triangle to indicate the trigger element
	 *
	 * @public
	 * HTML Attribute: arrow
	 */
	@attr({
		mode: 'boolean',
	}) arrow = false;

	/**
	 * set the color-scheme to dark
	 *
	 * @public
	 * HTML Attribute: alternate
	 */
	@attr({
		mode: 'boolean',
	}) alternate = false;

	/**
	 * the placement of the popup
	 *
	 * @public
	 * HTML Attribute: placement
	 */
	@attr({ mode: 'fromView' }) placement?: Placement;

	/**
	 * ID reference to element in the popup’s owner document.
	 *
	 * @public
	 * HTML Attribute: anchor
	 */
	@attr anchor!: string;

	constructor() {
		super();
	}

	override connectedCallback(): void {
		super.connectedCallback();
		if(this.lightDismiss){
			window.addEventListener('mousedown', this.#dismiss);
		}
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		window.removeEventListener('mousedown', this.#dismiss);
		this.#anchorEl?.removeEventListener('keydown', this.#handleKeydown);
		this.#cleanup?.();
	}

	override attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		super.attributeChangedCallback(name, oldValue, newValue);
		switch (name) {
			case 'anchor': {
				this.#anchorEl?.removeEventListener('keydown', this.#handleKeydown);
				this.#anchorEl = this.#getAnchorById();
				// close the popup if pressed escape
				this.#anchorEl?.addEventListener('keydown', this.#handleKeydown);
				break;
			}
		}
		if (this.#anchorEl && this.popupEl) {
			this.#cleanup = autoUpdate(this.#anchorEl, this.popupEl, () => this.updatePosition());
		}
		else {
			this.#cleanup?.();
		}
	}

	/**
	 * Updates popup's position
	 *
	 * @public
	 */
	async updatePosition() {
		if (!this.open || !this.#anchorEl) {
			return;
		}

		const positionData = await computePosition(this.#anchorEl, this.popupEl, {
			placement: this.placement,
			strategy: this.#strategy,
			middleware: this.#middleware
		});
		this.#assignPopupPosition(positionData);
		if (this.arrow) { this.#assignArrowPosition(positionData); }
	}

	#assignPopupPosition(data: any): void {
		const { x: popupX, y: popupY } = data;
		const { referenceHidden } = data.middlewareData.hide;
		Object.assign(this.popupEl.style, {
			left: `${popupX}px`,
			top: `${popupY}px`,
			visibility: referenceHidden ? 'hidden' : 'visible',
		});
	}

	#assignArrowPosition(data: any): void {
		const { x: arrowX, y: arrowY } = data.middlewareData.arrow;
		const side: string = this.#arrowPosition[data.placement.split('-')[0]];
		Object.assign(this.arrowEl.style, {
			left: `${arrowX}px`,
			top: `${arrowY}px`,
			right: '',
			bottom: '',
			[side]: '-4px',
		});
	}

	#close(): void {
		this.open = false;
	}

	/**
	 * Gets the anchor element by id
	 */
	#getAnchorById(): HTMLElement | null {
		return document.getElementById(this.anchor);
	}

	#handleKeydown = (event: Event) => {
		if ((event as KeyboardEvent).key === keyEscape) {
			this.#close();
		}
	};

	#dismiss = (event: Event) => {
		if (!this.open || !this.#anchorEl) {
			return;
		}
		// if clicked on popup
		if (this.contains(event.target as Element)) {
			return;
		}
		// if clicked on anchor
		if (this.#anchorEl.contains(event.target as Element)) {
			return;
		}
		this.#close();
	};
}
