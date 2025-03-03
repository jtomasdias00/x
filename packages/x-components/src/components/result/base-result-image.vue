<template>
  <picture ref="image" class="x-picture x-result-picture" data-test="result-picture">
    <component
      :is="animation"
      v-if="!hasImageLoaded && !hasAllImagesFailed"
      class="x-picture__image x-picture__image--placeholder"
      data-test="result-picture-placeholder"
    >
      <!-- eslint-disable-next-line max-len -->
      <!-- @slot (Required) Loading image content. It will be rendered while the real image is not loaded -->
      <slot name="placeholder" />
    </component>
    <component :is="animation">
      <img
        v-if="imageSrc"
        v-show="hasImageLoaded"
        @error="flagImageAsFailed"
        @load="flagImageLoaded"
        :alt="result.name"
        :src="imageSrc"
        class="x-picture__image x-result-picture-image"
        data-test="result-picture-image"
      />
      <NoElement v-else-if="hasAllImagesFailed" class="x-picture__image x-picture__image--fallback">
        <!--
        Vue styleguidist doesn't generate slot docs for v-else and v-else-if conditions
        due to a bug https://github.com/vuejs/vue/pull/10286.
        TODO - Bump styleguidist version when the fix branch is merged and a new version released.
        -->
        <!-- eslint-disable-next-line max-len -->
        <!-- @slot (Required) Fallback image content. It will be rendered when all the images failed -->
        <slot name="fallback" />
      </NoElement>
    </component>
  </picture>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { NoElement } from '../no-element';

  /**
   * Component to be reused that renders an `<img>`.
   *
   * @public
   */
  @Component({
    components: {
      NoElement
    }
  })
  export default class BaseResultImage extends Vue {
    /**
     * Animation to use when switching between the placeholder, the loaded image, or the failed
     * image fallback.
     *
     * @public
     */
    @Prop({ default: () => NoElement })
    public animation!: string | typeof Vue;
    /**
     * The image has entered in the port view.
     *
     * @public
     */
    protected hasEnteredView = false;
    /**
     * An array of images that failed to load.
     *
     * @public
     */
    protected failedImages: string[] = [];
    /**
     * HTMLElement that references the picture element.
     *
     * @public
     */
    public $refs!: { image: HTMLElement };
    /**
     * Indicates if the result image is loaded.
     *
     * @public
     */
    protected hasImageLoaded = false;

    /**
     * (Required) The {@link @empathyco/x-types#Result | result} information.
     *
     * @public
     */
    @Prop({ required: true })
    protected result!: Result;

    /**
     * Checks if intersection observer is available in window object.
     *
     * @returns Boolean.
     *
     * @internal
     */
    protected get isIntersectionObserverAvailable(): boolean {
      return 'IntersectionObserver' in window;
    }

    mounted(): void {
      this.hasEnteredView = !this.isIntersectionObserverAvailable;
      if (this.isIntersectionObserverAvailable) {
        this.createObserver();
      }
    }

    /**
     * Gets the src from the result image.
     *
     * @returns The result image src.
     *
     * @internal
     */
    protected get imageSrc(): string {
      if (this.hasEnteredView && this.result.images.length > 0) {
        const image = this.result.images.find(image => !this.failedImages.includes(image));
        return image ?? '';
      }
      return '';
    }

    /**
     * Creates an intersection observer in the image element.
     *
     * @internal
     */
    protected createObserver(): void {
      const image = this.$refs.image as Element;
      const observer = new IntersectionObserver(this.observerHandler.bind(this));
      observer.observe(image);
    }

    /**
     * Observe all the observables items and detects when a element is intersected.
     *
     * @param entries - The observed items.
     * @param observer - The intersection observer object.
     *
     * @internal
     */
    protected observerHandler(
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ): void {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.hasEnteredView = true;
          observer.disconnect();
        }
      });
    }

    /**
     * Sets an image as failed.
     *
     * @internal
     */
    protected flagImageAsFailed(): void {
      this.failedImages.push(this.imageSrc);
    }

    /**
     * Checks if all the images failed.
     *
     * @returns Boolean.
     *
     * @internal
     */
    protected get hasAllImagesFailed(): boolean {
      return this.failedImages.length === this.result.images.length;
    }

    /**
     * Marks an image as loaded.
     *
     * @internal
     */
    protected flagImageLoaded(): void {
      this.hasImageLoaded = true;
    }
  }
</script>

<style lang="scss" scoped>
  .x-result-picture {
    min-width: 1px;
    min-height: 1px;
    position: relative;

    &__image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
</style>

<docs lang="mdx">
## Examples

### Basic example

This component is for the result image. It may be part of the search result page, recommendations or
other section which needs to include results.

The result prop is required. It will render a `<img/>` with the result image:

```vue
<BaseResultImage :result="result" />
```

### Customizing slots content

Fallback and placeholder contents can be customized.

The fallback slot allows you to replace the content of the fallback image.

The other slot is called `placeholder`, and allows you to set the image that its going to be
displayed while the real one is loaded.

```vue
<BaseResultImage :result="result">
  <template #placeholder>
    <img class="x-result-picture-placeholder" src="./placeholder-image.svg"/>
  </template>
  <template #fallback>
    <img class="x-result-picture-fallback" src="./fallback-image.svg"/>
  </template>
</BaseResultImage>
```
</docs>
