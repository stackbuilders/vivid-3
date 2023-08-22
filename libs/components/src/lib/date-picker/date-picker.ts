import { applyMixins, FoundationElement } from '@microsoft/fast-foundation';
import { attr, DOM, observable, volatile } from '@microsoft/fast-element';
import type { TextField } from '../text-field/text-field';
import { Localized } from '../../shared/patterns';
import {
	addDays,
	currentDateStr,
	type DateStr,
	formatDateStr,
	isValidDateStr,
} from './calendar/dateStr';
import {
	addMonths,
	areMonthsEqual,
	getCurrentMonth,
	type Month,
	monthOfDate,
	monthToStr,
} from './calendar/month';
import { buildCalendarGrid } from './calendar/calendarGrid';
import {
	formatPresentationDate,
	parsePresentationDate,
} from './calendar/presentationDate';
import { buildMonthPickerGrid, MonthsPerRow } from './calendar/monthPickerGrid';

/**
 * Base class for date-picker
 *
 * @public
 */
export class DatePicker extends FoundationElement {
	#dismissOnClickOutside = (event: MouseEvent) => {
		if (!this._popupOpen) {
			return;
		}

		const path = event.composedPath();
		if (!path.includes(this)) {
			this.#closePopup(false);
		}
	};
	// --- Attributes ---
	/**
	 * The label text of the date-picker.
	 *
	 * @public
	 * @remarks
	 * HTML Attribute: label
	 */
	@attr label?: string;

	/**
	 * The helper-text text of the date-picker.
	 *
	 * @public
	 * @remarks
	 * HTML Attribute: helper-text
	 */
	@attr({ attribute: 'helper-text' }) helperText?: string;

	/**
	 * The error-text text of the date-picker.
	 *
	 * @public
	 * @remarks
	 * HTML Attribute: error-text
	 */
	@attr({ attribute: 'error-text' }) errorText?: string;

	/**
	 * The currently selected date of the date-picker.
	 *
	 * @public
	 * @remarks
	 * HTML Attribute: text
	 */
	@attr({
		// Converter ensures that the value is always a valid date string or null
		converter: {
			fromView: (value: string) => {
				if (value && isValidDateStr(value)) {
					return value;
				}
				return null;
			},
			toView(value: string) {
				return value;
			},
		},
	})
		value: DateStr | null = null;

	/**
	 * @internal
	 */
	valueChanged() {
		this._internalValidationError = null;
		if (this.value !== null) {
			this._presentationValue = formatPresentationDate(
				this.value,
				this.locale.datePicker
			);
			// Ensure we are switched to the month of the new selected date
			this._selectedMonth = monthOfDate(this.value);
		} else {
			this._presentationValue = '';
		}
	}

	#updateValueDueToUserInteraction(newValue: DateStr | null) {
		this.value = newValue;
		this.$emit('change');
		this.$emit('input');
	}

	/**
	 * Whether the date-picker is disabled.
	 *
	 * @public
	 * @remarks
	 * HTML Attribute: disabled
	 */
	@attr({ mode: 'boolean' }) disabled = false;

	/**
	 * Whether the date-picker is readonly.
	 * @public
	 * @remarks
	 * HTML Attribute: readonly
	 */
	@attr({ attribute: 'readonly', mode: 'boolean' }) readOnly = false;

	// --- Refs ---
	/**
	 * @internal
	 */
	_textFieldEl!: TextField;
	/**
	 * @internal
	 */
	_dialogEl!: HTMLElement;
	/**
	 * @internal
	 */
	_firstFocusableEl!: HTMLElement;
	/**
	 * @internal
	 */
	_lastFocusableEl!: HTMLElement;

	// --- Common state and getters ---

	/**
	 * The month the calendar is currently showing.
	 * @internal
	 */
	@observable _selectedMonth = getCurrentMonth();

	/**
	 * Today's date.
	 * @internal
	 */
	_currentDate = currentDateStr();

	/**
	 * Today's month.
	 * @internal
	 */
	_currentMonth = getCurrentMonth();

	// --- Callbacks ---

	override connectedCallback() {
		super.connectedCallback();

		document.addEventListener('click', this.#dismissOnClickOutside);
	}

	override disconnectedCallback() {
		super.disconnectedCallback();

		document.removeEventListener('click', this.#dismissOnClickOutside);
	}

	// --- Popup ---

	/**
	 * Whether the date-picker popup is open.
	 * @internal
	 */
	@observable _popupOpen = false;

	/// Used to stop the popup from immediately opening when closing popup and returning focus to text field
	#isClosingPopup = false;

	#openPopupIfPossible() {
		if (!this.readOnly && !this.#isClosingPopup) {
			this._popupOpen = true;
		}
	}

	#closePopup(restoreFocusToTextField = true) {
		this._popupOpen = false;
		this._monthPickerYear = null;

		if (restoreFocusToTextField) {
			this.#isClosingPopup = true;
			this._textFieldEl.focus();
			this.#isClosingPopup = false;
		}
	}

	/**
	 * On keydown anywhere in the date picker.
	 * @internal
	 */
	_onBaseKeyDown(event: KeyboardEvent) {
		// Close dialog on Escape
		if (event.key === 'Escape') {
			this.#closePopup();
			return false;
		}

		// Trap focus inside the dialog
		if (event.key === 'Tab') {
			if (event.shiftKey) {
				// Shift + tab
				if (this.shadowRoot!.activeElement === this._firstFocusableEl) {
					this._lastFocusableEl.focus();
					return false;
				}
			} else {
				// Tab
				if (this.shadowRoot!.activeElement === this._lastFocusableEl) {
					this._firstFocusableEl.focus();
					return false;
				}

				// When tabbing from the text field into the dialog, focus the day/month
				if (
					this.shadowRoot!.activeElement === this._textFieldEl &&
					this._popupOpen
				) {
					(
						this._dialogEl.querySelector('[tabindex="0"]') as HTMLButtonElement
					).focus();
					return false;
				}
			}
		}

		// Otherwise, don't prevent default
		return true;
	}

	// --- Text field ---

	/**
	 * Stores the value of the text field.
	 * @internal
	 */
	@observable _presentationValue = '';

	/**
	 * @internal
	 */
	@observable private _internalValidationError: string | null = null;

	/**
	 * @internal
	 */
	@volatile
	get _textFieldErrorText() {
		return this.errorText || this._internalValidationError || '';
	}

	/**
	 * @internal
	 */
	_onTextFieldInput(event: Event) {
		const textField = event.currentTarget as TextField;
		this._presentationValue = textField.value;
		this._internalValidationError = null;
	}

	/**
	 * @internal
	 */
	_onTextFieldChange() {
		if (this._presentationValue === '') {
			this.#updateValueDueToUserInteraction(null);
			return;
		}

		try {
			this.#updateValueDueToUserInteraction(
				parsePresentationDate(this._presentationValue, this.locale.datePicker)
			);
		} catch (_) {
			this._internalValidationError = this.locale.datePicker.invalidDateError;
			return;
		}
	}

	/**
	 * @internal
	 */
	_onTextFieldFocus() {
		this.#openPopupIfPossible();
	}

	/**
	 * @internal
	 */
	_onTextFieldClick() {
		this.#openPopupIfPossible();
	}

	/**
	 * @internal
	 */
	_onTextFieldKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			if (this._popupOpen) {
				this.#closePopup();
			} else {
				this.#openPopupIfPossible();
			}
		}

		return true; // Don't prevent default
	}

	// --- Dialog header ---

	/**
	 * @internal
	 */
	_onTitleActionClick() {
		if (this._inMonthPicker) {
			this._monthPickerYear = null;
		} else {
			this._monthPickerYear = this._selectedMonth.year;
		}
	}

	/**
	 * @internal
	 */
	_onPrevYearClick() {
		if (this._inMonthPicker) {
			this._monthPickerYear = this._monthPickerYear! - 1;
		} else {
			this._selectedMonth = {
				year: this._selectedMonth.year - 1,
				month: this._selectedMonth.month,
			};
		}
	}

	/**
	 * @internal
	 */
	_onNextYearClick() {
		if (this._inMonthPicker) {
			this._monthPickerYear = this._monthPickerYear! + 1;
		} else {
			this._selectedMonth = {
				year: this._selectedMonth.year + 1,
				month: this._selectedMonth.month,
			};
		}
	}

	/**
	 * @internal
	 */
	_onPrevMonthClick() {
		this._selectedMonth = addMonths(this._selectedMonth, -1);
	}

	/**
	 * @internal
	 */
	_onNextMonthClick() {
		this._selectedMonth = addMonths(this._selectedMonth, 1);
	}

	// --- Calendar ---

	/**
	 * The calendar grid used to render the calendar.
	 * @internal
	 */
	get _calendarGrid() {
		return buildCalendarGrid(this._selectedMonth, this.locale.datePicker);
	}

	/**
	 * The last date that had focus, used to implement tab roving
	 * @internal
	 */
	@observable
	private _lastFocussedDate: DateStr | null = null;

	/**
	 * Handle selecting a date from the calendar.
	 * @internal
	 */
	_onDateClick(date: DateStr) {
		this.#updateValueDueToUserInteraction(date);
		this.#closePopup();
	}

	/**
	 * Handle keydown on a date in the calendar.
	 * @internal
	 */
	_onDateKeydown(date: DateStr, event: KeyboardEvent) {
		let newDate: DateStr | null = null;

		if (event.key === 'ArrowUp') {
			newDate = addDays(date, -7);
		} else if (event.key === 'ArrowDown') {
			newDate = addDays(date, 7);
		} else if (event.key === 'ArrowLeft') {
			newDate = addDays(date, -1);
		} else if (event.key === 'ArrowRight') {
			newDate = addDays(date, 1);
		}

		if (newDate) {
			const newMonth = monthOfDate(newDate);

			// Change month if we moved to a different month
			if (!areMonthsEqual(newMonth, this._selectedMonth)) {
				this._selectedMonth = newMonth;
				// Update DOM immediately so that we can focus the new date
				DOM.processUpdates();
			}

			// Move focus to new date
			(
				this._dialogEl.querySelector(
					`[data-date="${newDate}"]`
				) as HTMLButtonElement
			).focus();

			return false;
		}

		return true; // Don't prevent default
	}

	/**
	 * @internal
	 */
	_onDateFocus(date: DateStr) {
		this._lastFocussedDate = date;
	}

	/**
	 * Only one date should be in the tab order at a time (tab roving).
	 * @internal
	 */
	@volatile
	get _tabbableDate(): DateStr {
		const candidates = [this._lastFocussedDate, this.value, currentDateStr()];

		// Find valid candidate or default to the first day of the current month
		return (
			candidates.find(
				(date) =>
					date !== null &&
					areMonthsEqual(monthOfDate(date), this._selectedMonth)
			) ??
			formatDateStr(
				new Date(this._selectedMonth.year, this._selectedMonth.month, 1)
			)
		);
	}

	// --- Month picker ---

	/**
	 * The year the month picker is currently showing.
	 * If null, the month picker is not showing.
	 * @internal
	 */
	@observable _monthPickerYear: number | null = null;

	/**
	 * @internal
	 */
	get _inMonthPicker() {
		return this._monthPickerYear !== null;
	}

	/**
	 * The months grid used to render the month picker.
	 * @internal
	 */
	get _monthPickerGrid() {
		/* istanbul ignore next should be unreachable */
		if (this._monthPickerYear === null) {
			throw new Error('Not in month picker');
		}
		return buildMonthPickerGrid(this._monthPickerYear, this.locale.datePicker);
	}

	/**
	 * The month that had focus last, used to implement tab roving
	 * @internal
	 */
	@observable
	private _lastFocussedMonth: Month | null = null;

	/**
	 * Handle month selected in the month picker.
	 * @internal
	 */
	_onMonthClick(month: Month) {
		this._selectedMonth = month;
		this._monthPickerYear = null;
	}

	/**
	 * Handle keydown on a month in the month picker.
	 * @internal
	 */
	_onMonthKeydown(month: Month, event: KeyboardEvent) {
		let newMonth: Month | null = null;

		if (event.key === 'ArrowUp') {
			newMonth = addMonths(month, -MonthsPerRow);
		} else if (event.key === 'ArrowDown') {
			newMonth = addMonths(month, MonthsPerRow);
		} else if (event.key === 'ArrowLeft') {
			newMonth = addMonths(month, -1);
		} else if (event.key === 'ArrowRight') {
			newMonth = addMonths(month, 1);
		}

		if (newMonth) {
			// Change year if we moved to a different year
			if (newMonth.year !== this._monthPickerYear) {
				this._monthPickerYear = newMonth.year;
				// Update DOM immediately so that we can focus the new month
				DOM.processUpdates();
			}

			// Move focus to new month
			(
				this._dialogEl.querySelector(
					`[data-month="${monthToStr(newMonth!)}"]`
				) as HTMLButtonElement
			).focus();

			return false;
		}

		return true; // Don't prevent default
	}

	/**
	 * @internal
	 */
	_onMonthFocus(month: Month) {
		this._lastFocussedMonth = month;
	}

	/**
	 * Only one month should be in the tab order at a time (tab roving).
	 * @internal
	 */
	@volatile
	get _tabbableMonth(): Month {
		const year = this._monthPickerYear ?? this._selectedMonth.year;

		const candidates = [
			this._lastFocussedMonth,
			this._selectedMonth,
			getCurrentMonth(),
		];

		// Find valid candidate, otherwise chose the first month of the year
		return (
			candidates.find((month) => month && month.year === year) ?? {
				month: 0,
				year,
			}
		);
	}

	// --- Dialog footer ---

	/**
	 * @internal
	 */
	_onOkClick() {
		this.#closePopup();
	}

	/**
	 * @internal
	 */
	_onClearClick() {
		this.#updateValueDueToUserInteraction(null);
		this.#closePopup();
	}
}

export interface DatePicker extends Localized {}
applyMixins(DatePicker, Localized);
