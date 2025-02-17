import type { FoundationElementDefinition } from '@microsoft/fast-foundation';
import { registerFactory } from '../../shared/design-system';
import { iconRegistries } from '../icon/definition';
import { elevationRegistries } from '../elevation/definition';
import styles from './card.scss';

import { Card } from './card';
import { CardTemplate as template } from './card.template';

export type { CardAppearance } from './card';

/**
 * The Card component is a container for content and actions.
 *
 * @internal
 */
export const cardDefinition = Card.compose<FoundationElementDefinition>({
	baseName: 'card',
	template: template as any,
	styles,
});

/**
 * @internal
 */
export const cardRegistries = [cardDefinition(), ...iconRegistries, ...elevationRegistries];

/**
 * Registers the card elements with the design system.
 *
 * @param prefix - the prefix to use for the component name
 */
export const registerCard = registerFactory(cardRegistries);
