<template>
  <div class="x">
    <Tagging :consent="false" />
    <SnippetConfigExtraParams :values="initialExtraParams" />
    <PreselectedFilters />
    <UrlHandler query="q" store="store" />
    <SnippetCallbacks />
    <BaseEventButton data-test="open-modal" :events="eventsToOpenX">Start</BaseEventButton>
    <h1>Test controls</h1>
    <ul class="x-test-controls x-list x-list--gap-05">
      <li class="x-test-controls__item x-list__item">
        <label>
          <input
            v-model="controls.searchInput.instant"
            type="checkbox"
            data-test="search-input-instant"
          />
          search-input - instant
        </label>
      </li>
      <li class="x-test-controls__item x-list__item">
        <label for="searchInput.instantDebounceInMs">search-input - debounce</label>
        <input
          v-model="controls.searchInput.instantDebounceInMs"
          id="searchInput.instantDebounceInMs"
          type="number"
          data-test="search-input-debounce"
        />
      </li>
      <li class="x-test-controls__item x-list__item">
        <label for="popularSearches.maxItemsToRender">popular-searches - maxItemsToRender</label>
        <input
          v-model="controls.popularSearches.maxItemsToRender"
          id="popularSearches.maxItemsToRender"
          type="number"
          data-test="popular-searches-max-to-render"
        />
      </li>
      <li class="x-test-controls__item x-list__item">
        <label>
          <input
            v-model="controls.slicedFilters.max"
            type="number"
            data-test="sliced-filters-max"
          />
          sliced-filters - max
        </label>
      </li>
      <li class="x-test-controls__item x-list__item">
        <label for="historyQueries.maxItemsToRender">history-queries - maxItemsToRender</label>
        <input
          v-model="controls.historyQueries.maxItemsToRender"
          id="historyQueries.maxItemsToRender"
          type="number"
          data-test="history-queries-max-to-render"
        />
      </li>
    </ul>
    <BaseEventsModal :eventsToOpenModal="eventsToOpenModal" :animation="modalAnimation">
      <MultiColumnMaxWidthLayout class="x-background--neutral-100">
        <template #header-middle>
          <div
            class="
              x-list x-list--vertical x-list--gap-05 x-list--align-stretch x-list__item--expand
            "
          >
            <BaseKeyboardNavigation>
              <div class="x-input-group x-input-group--card">
                <SearchInput
                  aria-label="Search for products"
                  placeholder="Search"
                  :instant="controls.searchInput.instant"
                  :instant-debounce-in-ms="controls.searchInput.instantDebounceInMs"
                />
                <ClearSearchInput aria-label="Clear query">Clear</ClearSearchInput>
                <SearchButton aria-label="Search" class="x-input-group__action">
                  <SearchIcon />
                </SearchButton>
              </div>
            </BaseKeyboardNavigation>

            <!-- Spellcheck -->
            <Spellcheck>
              <template #default="{ query }">
                No results found for '{{ query }}'. We show you results for
                <SpellcheckButton />
              </template>
            </Spellcheck>

            <SlidingPanel v-if="$x.relatedTags.length">
              <template #sliding-panel-left-button>
                <ChevronLeft />
              </template>
              <RelatedTags class="x-tag--card x-list--gap-03" />
              <template #sliding-panel-right-button>
                <ChevronRight />
              </template>
            </SlidingPanel>
          </div>
        </template>

        <template #header-end>
          <BaseEventButton class="x-button--ghost" :events="eventsToCloseX">
            <CrossIcon />
          </BaseEventButton>
        </template>

        <template #sub-header>
          <PredictiveLayer :controls="controls" />
        </template>

        <template #toolbar-aside>
          <BaseIdTogglePanelButton
            v-if="$x.totalResults > 0"
            class="x-button x-button--ghost"
            panelId="aside-panel"
          >
            Toggle Aside
          </BaseIdTogglePanelButton>
        </template>

        <template #toolbar-body>
          <div
            v-if="$x.totalResults > 0"
            class="x-list x-list--horizontal x-list--align-center x-list--gap-04"
          >
            <span>{{ $x.totalResults }} Results</span>
            <BaseColumnPickerList
              #default="{ column }"
              v-model="selectedColumns"
              :columns="columnPickerValues"
            >
              <template v-if="column === 0">
                <ChevronTinyRight />
                <Grid1Col />
                <ChevronTinyLeft />
              </template>
              <Grid1Col v-else-if="column === 4" />
              <Grid2Col v-else-if="column === 6" />
            </BaseColumnPickerList>
            <SortDropdown
              :items="sortValues"
              class="x-dropdown--round x-dropdown--right x-dropdown--l"
              :animation="sortDropdownAnimation"
            >
              <template #toggle="{ item }">
                <span data-test="sort-dropdown-toggle">{{ item || 'default' }}</span>
                <ChevronTinyDown />
              </template>
              <template #item="{ item, isSelected }">
                <ChevronTinyRight />
                <span>{{ item || 'default' }}</span>
                <CheckTiny v-if="isSelected" />
              </template>
            </SortDropdown>

            <RenderlessExtraParams #default="{ value, updateValue }" name="store">
              <BaseDropdown
                @change="updateValue"
                class="x-dropdown x-dropdown--round x-dropdown--right x-dropdown--l"
                data-test="store-selector"
                :value="value"
                :items="stores"
              />
            </RenderlessExtraParams>
          </div>
        </template>

        <template #main-aside>
          <div
            v-if="$x.totalResults > 0"
            class="
              x-list
              x-list--padding-05
              x-list--padding-top
              x-list--gap-06
              x-list--border
              x-list--border-top
            "
          >
            <FacetsProvider :facets="staticFacets" />
            <ClearFilters />
            <SelectedFiltersList>
              <template #default="{ filter }">
                <SimpleFilter :filter="filter" class="x-tag" />
              </template>
            </SelectedFiltersList>

            <!-- Facets -->
            <Facets class="x-list--gap-06" renderable-facets="!rootCategories_facet">
              <!--  Hierarchical Facet    -->
              <template #hierarchical-category="{ facet }">
                <BaseHeaderTogglePanel class="x-facet">
                  <template #header-content>
                    <span class="x-ellipsis">{{ facet.label }}</span>
                    <ChevronDown />
                  </template>
                  <!-- Filters -->
                  <SlicedFilters max="4" :filters="facet.filters">
                    <FiltersList v-slot="{ filter }">
                      <HierarchicalFilter :filter="filter" :data-test="`${facet.label}-filter`" />
                    </FiltersList>
                  </SlicedFilters>
                </BaseHeaderTogglePanel>
              </template>

              <!--  Brand Facet    -->
              <template #brand-facet="{ facet }">
                <BaseHeaderTogglePanel class="x-facet">
                  <template #header-content>
                    <span :data-test="facet.label" class="x-ellipsis">{{ facet.label }}</span>
                    <span data-test="total-filters">{{ facet.filters.length }}</span>
                    <ChevronDown />
                  </template>

                  <!-- Filters -->
                  <ExcludeFiltersWithNoResults :filters="facet.filters">
                    <SortedFilters>
                      <FiltersSearch>
                        <SlicedFilters
                          :max="controls.slicedFilters.max"
                          :data-test="`${facet.label}-sliced-filters`"
                        >
                          <FiltersList
                            v-slot="{
                              // eslint-disable-next-line vue/no-unused-vars
                              filter
                            }"
                          >
                            <SimpleFilter
                              #label="{ filter }"
                              :filter="filter"
                              :data-test="`${facet.label}-filter`"
                            >
                              {{ filter.label }}
                              <span data-test="brand-filter-total-results">
                                {{ filter.totalResults }}
                              </span>
                            </SimpleFilter>
                          </FiltersList>
                        </SlicedFilters>
                      </FiltersSearch>
                    </SortedFilters>
                  </ExcludeFiltersWithNoResults>
                </BaseHeaderTogglePanel>
              </template>

              <!--  Default Facet    -->
              <template #default="{ facet }">
                <BaseHeaderTogglePanel class="x-facet">
                  <template #header-content>
                    <span :data-test="facet.label" class="x-ellipsis">{{ facet.label }}</span>
                    <ChevronDown />
                  </template>

                  <!-- Filters -->
                  <ExcludeFiltersWithNoResults :filters="facet.filters">
                    <SortedFilters>
                      <SlicedFilters
                        :max="controls.slicedFilters.max"
                        :data-test="`${facet.label}-sliced-filters`"
                      >
                        <SelectedFilters #default="{ selectedFilters }" :facetsIds="[facet.id]">
                          <span :data-test="`${facet.label}-selected-filters`">
                            {{ selectedFilters.length }}
                          </span>
                        </SelectedFilters>
                        <FiltersList v-slot="{ filter }">
                          <SimpleFilter
                            #label
                            :filter="filter"
                            :data-test="`${facet.label}-filter`"
                          >
                            <BasePriceFilterLabel
                              v-if="facet.id === 'price'"
                              :filter="filter"
                              class="x-filter__label"
                              format="ii.dd €"
                              lessThan="Less than {max}"
                              fromTo="From {min} to {max}"
                              from="More than {min}"
                            />
                          </SimpleFilter>
                        </FiltersList>
                      </SlicedFilters>
                    </SortedFilters>
                  </ExcludeFiltersWithNoResults>
                </BaseHeaderTogglePanel>
              </template>
            </Facets>
          </div>
        </template>

        <template #main-body>
          <!--  Redirection  -->
          <Redirection
            #default="{ redirection, redirect, abortRedirect, isRedirecting, delayInSeconds }"
            class="x-margin--top-03 x-margin--bottom-03"
            :delayInSeconds="5"
          >
            <p>Your search matches a special place in our website. You are being redirected to:</p>
            <a @click="redirect" :href="redirection.url" data-test="redirection-link">
              {{ redirection.url }}
            </a>
            <div class="x-list x-list--horizontal x-list--gap-07">
              <button
                @click="abortRedirect"
                class="x-button x-button--ghost x-font-color--neutral-70"
              >
                No, I'll stay here
              </button>
              <button @click="redirect" class="x-button x-button--ghost x-font-color--neutral-10">
                Yes, redirect me
              </button>
            </div>
            <AutoProgressBar :isLoading="isRedirecting" :durationInSeconds="delayInSeconds" />
          </Redirection>

          <template v-if="!$x.redirections.length">
            <!--  No Results Message  -->
            <div v-if="$x.noResults" class="x-message x-margin--top-03 x-margin--bottom-03">
              <p>
                There are no results for
                <span class="x-font-weight--bold">{{ $x.query.search }}</span>
              </p>
              <p>You may be interested in these:</p>
            </div>

            <!-- Results -->
            <LocationProvider location="results">
              <ResultsList v-infinite-scroll:main-scroll>
                <BannersList>
                  <PromotedsList>
                    <NextQueriesList>
                      <BaseVariableColumnGrid :animation="resultsAnimation">
                        <template #result="{ item: result }">
                          <MainScrollItem :item="result">
                            <Result :result="result" data-test="search-result" />
                          </MainScrollItem>
                        </template>

                        <template #banner="{ item: banner }">
                          <Banner :banner="banner" />
                        </template>

                        <template #promoted="{ item: promoted }">
                          <Promoted :promoted="promoted" />
                        </template>

                        <template #next-queries-group="{ item: { nextQueries } }">
                          <div class="x-list x-padding--06 x-background--neutral-95 x-list--gap-06">
                            <div class="x-list x-list--gap-03">
                              <h1 class="x-title2 x-text--bold">You may be interested</h1>
                              <p class="x-text x-font-size--05">
                                This is what other shoppers searched after
                                <span class="x-font-weight--bold">"{{ $x.query.search }}"</span>
                              </p>
                            </div>
                            <NextQueries
                              #suggestion="{ suggestion }"
                              :suggestions="nextQueries"
                              class="x-list--gap-06"
                              :max-items-to-render="3"
                            >
                              <NextQuery
                                #default="{ suggestion: nextQuery }"
                                :suggestion="suggestion"
                                class="x-tag x-tag--card"
                              >
                                <LightBulbOn class="x-icon--l" />
                                <span class="x-flex-auto">{{ nextQuery.query }}</span>
                                <ArrowRight class="x-icon--l" />
                              </NextQuery>
                            </NextQueries>
                          </div>
                        </template>
                      </BaseVariableColumnGrid>
                    </NextQueriesList>
                  </PromotedsList>
                </BannersList>
              </ResultsList>
            </LocationProvider>

            <!-- Partials -->
            <PartialResultsList :animation="resultsAnimation">
              <template #default="{ partialResult }">
                <span data-test="partial-query">{{ partialResult.query }}</span>
                <BaseGrid
                  #result="{ item }"
                  :animation="resultsAnimation"
                  :columns="4"
                  :items="partialResult.results"
                >
                  <Result :result="item" data-test="partial-result-item" />
                </BaseGrid>
                <PartialQueryButton :query="partialResult.query">
                  <template #default="{ query }">Ver todos {{ query }}</template>
                </PartialQueryButton>
              </template>
            </PartialResultsList>

            <!-- Recommendations -->
            <Recommendations v-if="!$x.query.search || $x.noResults" #layout="{ recommendations }">
              <BaseVariableColumnGrid
                #default="{ item: result }"
                :animation="resultsAnimation"
                :items="recommendations"
              >
                <Result :result="result" data-test="recommendation-item" />
              </BaseVariableColumnGrid>
            </Recommendations>
          </template>
        </template>

        <template #scroll-to-top>
          <ScrollToTop :threshold-px="500" class="x-button--round" scroll-id="main-scroll">
            <ChevronUp />
          </ScrollToTop>
        </template>
      </MultiColumnMaxWidthLayout>
    </BaseEventsModal>
  </div>
</template>

<script lang="ts">
  import { Facet, SimpleFilter as SimpleFilterModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  // eslint-disable-next-line max-len
  import { animateClipPath } from '../../components/animations/animate-clip-path/animate-clip-path.factory';
  import CollapseHeight from '../../components/animations/collapse-height.vue';
  import StaggeredFadeAndSlide from '../../components/animations/staggered-fade-and-slide.vue';
  import AutoProgressBar from '../../components/auto-progress-bar.vue';
  import BaseDropdown from '../../components/base-dropdown.vue';
  import BaseGrid from '../../components/base-grid.vue';
  import BaseVariableColumnGrid from '../../components/base-variable-column-grid.vue';
  import BaseColumnPickerList from '../../components/column-picker/base-column-picker-list.vue';
  import BasePriceFilterLabel from '../../components/filters/labels/base-price-filter-label.vue';
  import ArrowRight from '../../components/icons/arrow-right.vue';
  import CheckTiny from '../../components/icons/check-tiny.vue';
  import ChevronDown from '../../components/icons/chevron-down.vue';
  import ChevronLeft from '../../components/icons/chevron-left.vue';
  import ChevronRight from '../../components/icons/chevron-right.vue';
  import ChevronTinyDown from '../../components/icons/chevron-tiny-down.vue';
  import ChevronTinyLeft from '../../components/icons/chevron-tiny-left.vue';
  import ChevronTinyRight from '../../components/icons/chevron-tiny-right.vue';
  import ChevronUp from '../../components/icons/chevron-up.vue';
  import CrossIcon from '../../components/icons/cross.vue';
  import Grid1Col from '../../components/icons/grid-1-col.vue';
  import Grid2Col from '../../components/icons/grid-2-col.vue';
  import LightBulbOn from '../../components/icons/light-bulb-on.vue';
  import Nq1 from '../../components/icons/nq-1.vue';
  import SearchIcon from '../../components/icons/search.vue';
  import BaseEventButton from '../../components/base-event-button.vue';
  import { BaseKeyboardNavigation } from '../../components/index';
  // eslint-disable-next-line max-len
  import MultiColumnMaxWidthLayout from '../../components/layouts/multi-column-max-width-layout.vue';
  import LocationProvider from '../../components/location-provider.vue';
  import BaseEventsModalClose from '../../components/modals/base-events-modal-close.vue';
  import BaseEventsModalOpen from '../../components/modals/base-events-modal-open.vue';
  import BaseEventsModal from '../../components/modals/base-events-modal.vue';
  import BaseHeaderTogglePanel from '../../components/panels/base-header-toggle-panel.vue';
  import BaseIdTogglePanelButton from '../../components/panels/base-id-toggle-panel-button.vue';
  import BaseIdTogglePanel from '../../components/panels/base-id-toggle-panel.vue';
  import PreselectedFilters from '../../x-modules/facets/components/preselected-filters.vue';
  import BaseResultImage from '../../components/result/base-result-image.vue';
  import SlidingPanel from '../../components/sliding-panel.vue';
  import SnippetCallbacks from '../../components/snippet-callbacks.vue';
  import BaseSuggestions from '../../components/suggestions/base-suggestions.vue';
  import { infiniteScroll } from '../../directives/infinite-scroll/infinite-scroll';
  import { XEvent, XEventsTypes } from '../../wiring/index';
  // eslint-disable-next-line max-len
  import RenderlessExtraParams from '../../x-modules/extra-params/components/renderless-extra-param.vue';
  // eslint-disable-next-line max-len
  import SnippetConfigExtraParams from '../../x-modules/extra-params/components/snippet-config-extra-params.vue';
  import ClearFilters from '../../x-modules/facets/components/clear-filters.vue';
  import FacetsProvider from '../../x-modules/facets/components/facets/facets-provider.vue';
  import Facets from '../../x-modules/facets/components/facets/facets.vue';
  // eslint-disable-next-line max-len
  import HierarchicalFilter from '../../x-modules/facets/components/filters/hierarchical-filter.vue';
  import SimpleFilter from '../../x-modules/facets/components/filters/simple-filter.vue';
  // eslint-disable-next-line max-len
  import ExcludeFiltersWithNoResults from '../../x-modules/facets/components/lists/exclude-filters-with-no-results.vue';
  import FiltersList from '../../x-modules/facets/components/lists/filters-list.vue';
  import FiltersSearch from '../../x-modules/facets/components/lists/filters-search.vue';
  // eslint-disable-next-line max-len
  import SelectedFiltersList from '../../x-modules/facets/components/lists/selected-filters-list.vue';
  import SelectedFilters from '../../x-modules/facets/components/lists/selected-filters.vue';
  import SlicedFilters from '../../x-modules/facets/components/lists/sliced-filters.vue';
  import SortedFilters from '../../x-modules/facets/components/lists/sorted-filters.vue';
  import NextQueriesList from '../../x-modules/next-queries/components/next-queries-list.vue';
  import NextQueries from '../../x-modules/next-queries/components/next-queries.vue';
  import { NextQuery } from '../../x-modules/next-queries/index';
  import Recommendations from '../../x-modules/recommendations/components/recommendations.vue';
  import RelatedTags from '../../x-modules/related-tags/components/related-tags.vue';
  import MainScrollItem from '../../x-modules/scroll/components/main-scroll-item.vue';
  import ScrollToTop from '../../x-modules/scroll/components/scroll-to-top.vue';
  import ClearSearchInput from '../../x-modules/search-box/components/clear-search-input.vue';
  import SearchButton from '../../x-modules/search-box/components/search-button.vue';
  import SearchInput from '../../x-modules/search-box/components/search-input.vue';
  import Banner from '../../x-modules/search/components/banner.vue';
  import BannersList from '../../x-modules/search/components/banners-list.vue';
  import PartialQueryButton from '../../x-modules/search/components/partial-query-button.vue';
  import PartialResultsList from '../../x-modules/search/components/partial-results-list.vue';
  import Promoted from '../../x-modules/search/components/promoted.vue';
  import PromotedsList from '../../x-modules/search/components/promoteds-list.vue';
  import Redirection from '../../x-modules/search/components/redirection.vue';
  import ResultsList from '../../x-modules/search/components/results-list.vue';
  import SortDropdown from '../../x-modules/search/components/sort-dropdown.vue';
  import SortList from '../../x-modules/search/components/sort-list.vue';
  import SpellcheckButton from '../../x-modules/search/components/spellcheck-button.vue';
  import Spellcheck from '../../x-modules/search/components/spellcheck.vue';
  import Tagging from '../../x-modules/tagging/components/tagging.vue';
  import UrlHandler from '../../x-modules/url/components/url-handler.vue';
  import PredictiveLayer from './predictive-layer.vue';
  import Result from './result.vue';

  @Component({
    directives: {
      infiniteScroll
    },
    components: {
      BaseEventButton,
      PreselectedFilters,
      ArrowRight,
      AutoProgressBar,
      Banner,
      BannersList,
      BaseColumnPickerList,
      BaseDropdown,
      BaseEventsModal,
      BaseEventsModalClose,
      BaseEventsModalOpen,
      BaseGrid,
      BaseHeaderTogglePanel,
      BaseIdTogglePanel,
      BaseIdTogglePanelButton,
      BaseKeyboardNavigation,
      BasePriceFilterLabel,
      BaseResultImage,
      BaseSuggestions,
      BaseVariableColumnGrid,
      CheckTiny,
      ChevronDown,
      ChevronLeft,
      ChevronRight,
      ChevronTinyDown,
      ChevronTinyLeft,
      ChevronTinyRight,
      ChevronUp,
      ClearFilters,
      ClearSearchInput,
      CrossIcon,
      ExcludeFiltersWithNoResults,
      Facets,
      FacetsProvider,
      FiltersList,
      FiltersSearch,
      Grid1Col,
      Grid2Col,
      HierarchicalFilter,
      LightBulbOn,
      LocationProvider,
      MainScrollItem,
      MultiColumnMaxWidthLayout,
      NextQueries,
      NextQueriesList,
      NextQuery,
      Nq1,
      PartialQueryButton,
      PartialResultsList,
      PredictiveLayer,
      Promoted,
      PromotedsList,
      Recommendations,
      Redirection,
      RelatedTags,
      RenderlessExtraParams,
      Result,
      ResultsList,
      ScrollToTop,
      SearchButton,
      SearchIcon,
      SearchInput,
      SelectedFilters,
      SelectedFiltersList,
      SimpleFilter,
      SlicedFilters,
      SlidingPanel,
      SnippetCallbacks,
      SnippetConfigExtraParams,
      SortDropdown,
      SortList,
      SortedFilters,
      Spellcheck,
      SpellcheckButton,
      Tagging,
      UrlHandler
    }
  })
  export default class App extends Vue {
    protected stores = ['Spain', 'Portugal', 'Italy'];
    protected initialExtraParams = { store: 'Portugal' };
    protected columnPickerValues = [0, 4, 6];
    protected resultsAnimation = StaggeredFadeAndSlide;
    protected modalAnimation = animateClipPath();
    protected sortDropdownAnimation = CollapseHeight;
    protected selectedColumns = 4;
    protected sortValues = ['', 'price asc', 'price desc'];
    protected controls = {
      searchInput: {
        instant: true,
        instantDebounceInMs: 500 // default
      },
      popularSearches: {
        maxItemsToRender: 10
      },
      slicedFilters: {
        max: 4
      },
      historyQueries: {
        maxItemsToRender: 5
      }
    };

    protected eventsToOpenX: Partial<XEventsTypes> = {
      UserClickedOpenX: undefined,
      UserClickedOpenEventsModal: undefined
    };
    protected eventsToCloseX: Partial<XEventsTypes> = {
      UserClickedCloseX: undefined,
      UserClickedCloseEventsModal: undefined
    };

    protected eventsToOpenModal: XEvent[] = [
      'UserClickedOpenEventsModal',
      'UserOpenXProgrammatically',
      'UserClickedOpenX'
    ];
    protected staticFacets: Facet[] = [
      {
        modelName: 'SimpleFacet',
        label: 'offer',
        id: 'offer',
        filters: [
          {
            facetId: 'offer',
            modelName: 'SimpleFilter',
            id: 'price:[0 TO 10]',
            selected: false,
            label: 'In Offer'
          } as SimpleFilterModel
        ]
      }
    ];
  }
</script>

<style lang="scss" scoped>
  .x-modal::v-deep .x-modal__content {
    overflow: hidden;
    // Following is needed for closing the modal in base-events-modal.feature
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    margin: 10px;
  }
</style>
