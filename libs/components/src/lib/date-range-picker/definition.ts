import type { FoundationElementDefinition } from '@microsoft/fast-foundation';
import { registerFactory } from '../../shared/design-system';

import { buttonRegistries } from '../button/definition';
import { popupRegistries } from '../popup/definition';
import { textFieldRegistries } from '../text-field/definition';
import { focusRegistries } from '../focus/definition';
import { dividerRegistries } from '../divider/definition';
import styles from '../../shared/date-picker/date-picker-base.scss';
import { DatePickerBaseTemplate as template } from '../../shared/date-picker/date-picker-base.template';
import { DateRangePicker } from './date-range-picker';

export const dateRangePickerDefinition =
	DateRangePicker.compose<FoundationElementDefinition>({
		baseName: 'date-range-picker',
		template: template as any,
		styles,
		shadowOptions: {
			delegatesFocus: true,
		},
	});

/**
 * @internal
 */
export const dateRangePickerRegistries = [
	dateRangePickerDefinition(),
	...buttonRegistries,
	...popupRegistries,
	...textFieldRegistries,
	...focusRegistries,
	...dividerRegistries,
];

/**
 * Registers the date-range-picker element with the design system.
 *
 * @param prefix - the prefix to use for the component name
 */
export const registerDateRangePicker = registerFactory(
	dateRangePickerRegistries
);
