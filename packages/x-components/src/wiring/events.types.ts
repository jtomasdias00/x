import { Result, Suggestion } from '@empathyco/x-types';
import { ExtractPayload } from '../store/index';
import { ArrowKey, PropsWithType } from '../utils';
import { DeviceXEvents } from '../x-modules/device';
import { EmpathizeXEvents } from '../x-modules/empathize/events.types';
import { ExtraParamsXEvents } from '../x-modules/extra-params';
import { FacetsXEvents } from '../x-modules/facets/events.types';
import { HistoryQueriesXEvents } from '../x-modules/history-queries/events.types';
import { IdentifierResultsXEvents } from '../x-modules/identifier-results/events.types';
import { NextQueriesXEvents } from '../x-modules/next-queries/events.types';
import { PopularSearchesXEvents } from '../x-modules/popular-searches/events.types';
import { QuerySuggestionsXEvents } from '../x-modules/query-suggestions/events.types';
import { RecommendationsXEvents } from '../x-modules/recommendations/events.types';
import { RelatedTagsXEvents } from '../x-modules/related-tags/events.types';
import { ScrollXEvents } from '../x-modules/scroll/events.types';
import { SearchBoxXEvents } from '../x-modules/search-box/events.types';
import { SearchXEvents } from '../x-modules/search/events.types';
import { TaggingXEvents } from '../x-modules/tagging/events.types';
import { UrlXEvents } from '../x-modules/url/events.types';
import { WireMetadata } from './wiring.types';

/**
 * Dictionary of all the {@link XEvent | XEvents}, where each key is the event name, and the value
 * is the event payload type or `void` if it has no payload.
 *
 * @remarks
 * Aside from common {@link XEvent | XEvents}, this interface also extends the different XModule's
 * XEventsTypes:
 * {@link DeviceXEvents}
 * {@link EmpathizeXEvents}
 * {@link ExtraParamsXEvents}
 * {@link FacetsXEvents}
 * {@link HistoryQueriesXEvents}
 * {@link IdentifierResultsXEvents}
 * {@link NextQueriesXEvents}
 * {@link PopularSearchesXEvents}
 * {@link QuerySuggestionsXEvents},
 * {@link RecommendationsXEvents}
 * {@link RelatedTagsXEvents}
 * {@link ScrollXEvents},
 * {@link SearchBoxXEvents}
 * {@link SearchXEvents}
 * {@link TaggingXEvents}
 * {@link UrlXEvents}
 *
 * @public
 */
export interface XEventsTypes
  extends DeviceXEvents,
    EmpathizeXEvents,
    ExtraParamsXEvents,
    FacetsXEvents,
    HistoryQueriesXEvents,
    IdentifierResultsXEvents,
    NextQueriesXEvents,
    PopularSearchesXEvents,
    QuerySuggestionsXEvents,
    RecommendationsXEvents,
    RelatedTagsXEvents,
    ScrollXEvents,
    SearchBoxXEvents,
    SearchXEvents,
    TaggingXEvents,
    UrlXEvents {
  /**
   * The search adapter configuration has changed
   * Payload: The new search adapter configuration.
   */
  AdapterConfigChanged: unknown;
  /**
   * The number of columns of a grid has changed.
   * Payload: the columns number.
   */
  ColumnsNumberProvided: number;
  /**
   * Any kind of suggestions have been displayed (query-suggestions, popular searches...)
   * Payload: The displayed {@link @empathyco/x-types#Suggestion | suggestions}.
   */
  SuggestionsDisplayed: Suggestion[];
  /**
   * The `BaseToggleIdPanel` `isOpen` state changed.
   * Payload: the new state.
   */
  TogglePanelStateChanged: boolean;
  /**
   * The user has accepted a query
   * Payload: the accepted query.
   */
  UserAcceptedAQuery: string;
  /**
   * The user has accepted the spellcheck
   * Payload: the spellcheck query.
   */
  UserAcceptedSpellcheckQuery: string;
  /**
   * The user has clicked on a result.
   * Payload: The {@link @empathyco/x-types#Result | result} that the user clicked.
   */
  UserClickedAResult: Result;
  /**
   * The user clicked the button to close the events modal.
   * Payload: none.
   */
  UserClickedCloseEventsModal: void;
  /**
   * The user clicked the button to close a modal.
   * Payload: the id of the modal to close.
   */
  UserClickedCloseModal: string;
  /**
   * The user clicked the button to close X.
   * Payload: none.
   */
  UserClickedCloseX: void;
  /**
   * The user clicked the button to select the number of columns.
   * Payload: the column number.
   */
  UserClickedColumnPicker: number;
  /**
   * The user clicked the button to open the events modal.
   * Payload: none.
   */
  UserClickedOpenEventsModal: void;
  /**
   * The user clicked the button to open a modal.
   * Payload: the id of the modal to open.
   */
  UserClickedOpenModal: string;
  /**
   * The user clicked the button to open X.
   * Payload: none.
   */
  UserClickedOpenX: void;
  /**
   * The user clicked out of the events modal while it is opened.
   * Payload: none.
   */
  UserClickedOutOfEventsModal: void;
  /**
   * The user clicked out of a modal while it was opened.
   * Payload: the id of the modal.
   */
  UserClickedOutOfModal: string;
  /**
   * The user clicked the button to toggle a panel.
   * Payload: the id of the panel to toggle.
   */
  UserClickedPanelToggleButton: string;
  /**
   * The user has clicked on the add to cart button of a result.
   * Payload: The {@link @empathyco/x-types#Result | result} that the user clicked.
   */
  UserClickedResultAddToCart: Result;
  /**
   * The user has clicked on the rating of a result.
   * Payload: The {@link @empathyco/x-types#Result | result} that the user clicked.
   */
  UserClickedAResultRating: Result;
  /**
   * The user has clicked the scroll to top button.
   * Payload: The scroll id which has scrolled to top.
   */
  UserClickedScrollToTop: string;
  /**
   * The user opened X programmatically.
   * Payload: none.
   */
  UserOpenXProgrammatically: void;
  /**
   * The user pressed an {@link ArrowKey | arrow key} with the focus on the search-box.
   * Payload: the pressed {@link ArrowKey | arrow key}.
   */
  UserPressedArrowKey: ArrowKey;
  /**
   * The user has reached the top of the empathize and keeps navigating in that direction.
   * Payload: none.
   */
  UserReachedEmpathizeTop: void;
  /**
   * User selected any kind of suggestion (query-suggestion, popular-search...)
   * Payload: The {@link @empathyco/x-types#Suggestion | suggestion} that the user selected.
   */
  UserSelectedASuggestion: Suggestion;
  /**
   * A callback from the snippet has been executed.
   * Payload: An object containing the event that executed the callback, the callback result, and
   * the original event payload and  metadata.
   */
  SnippetCallbackExecuted: {
    event: XEvent;
    callbackReturn: unknown;
    payload: ExtractPayload<XEvent>;
    metadata: WireMetadata;
  };
}

/**
 * Name of all available events.
 *
 * @public
 */
export type XEvent = keyof XEventsTypes;

/**
 * Selects events of the with a payload matching the provided type.
 *
 * @typeParam Type - The type that events payload should match.
 * @public
 */
export type XEventsOf<Type> = PropsWithType<XEventsTypes, Type>;

/**
 * Extracts the payload type of an event.
 *
 * @typeParam Event - The {@link XEvent} to extract its payload type
 * @public
 */
export type XEventPayload<Event extends XEvent> = XEventsTypes[Event] extends void
  ? undefined
  : XEventsTypes[Event];
