/**
 * Types allow for values of scroll direction.
 *
 * @public
 */
export type ScrollDirection = 'UP' | 'DOWN';

/**
 * Methods to initialise and cease visibility observing.
 *
 * @public
 */
export interface ScrollVisibilityObserver {
  observe(el: HTMLElement): void;
  unobserve(el: HTMLElement): void;
}
