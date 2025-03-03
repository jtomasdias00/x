<template>
  <div v-if="isLoading" class="x-progress-bar" data-test="progress-bar" role="progressbar">
    <div class="x-progress-bar__line" :style="cssStyles" data-test="progress-bar-line"></div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  /**
   * An auto progress bar component.
   *
   * @public
   */
  @Component
  export default class AutoProgressBar extends Vue {
    /**
     * A boolean flag indicating if the bar is loading.
     *
     * @public
     */
    @Prop({ default: true })
    public isLoading!: boolean;

    /**
     * The duration in seconds of the progress bar.
     *
     * @public
     */
    @Prop({ default: 5 })
    public durationInSeconds!: number;

    /**
     * Computed property to calculate the animation's duration.
     *
     * @returns The CSS styles of the animation.
     *
     * @internal
     */
    protected get cssStyles(): Partial<CSSStyleDeclaration> {
      return { animationDuration: `${this.durationInSeconds}s` };
    }
  }
</script>

<style lang="scss">
  .x-progress-bar {
    display: inline-block;
    overflow: hidden;
    background-color: var(--x-color-background-progress-bar-default, #b3b3b3);
    border-radius: var(--x-size-border-radius-progress-bar-default, 24px);

    &__line {
      height: var(--x-size-height-progress-bar-line-default, 4px);
      width: var(--x-size-width-progress-bar-line-default, 272px);
      background-color: var(--x-color-background-progress-bar-line-default, #1a1a1a);
      border-radius: var(--x-size-border-radius-progress-bar-default, 24px);
      animation: slide linear;
      transform-origin: left;
    }
  }
  @keyframes slide {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }
  }
</style>

<docs lang="mdx">
## See it in action

Here you have a basic example of how the auto progress bar is rendered.

```vue
<template>
  <AutoProgressBar :isLoading="isLoading" :durationInSeconds="delayInSeconds" />
</template>

<script>
  export default {
    name: 'AutoProgressBarDemo',
    data() {
      return {
        isLoading: true,
        durationInSeconds: 100
      };
    }
  };
</script>
```

### Play with props

In this example, the auto progress bar has been set to do an animation for 5 seconds. There is a way
to cancel the animation by sending the isLoading prop to false.

```vue
<template>
  <AutoProgressBar :durationInSeconds="5" :isLoading="true" />
</template>

<script>
  export default {
    name: 'AutoProgressBarDemo'
  };
</script>
```

## Events

This component emits the following events:

- `UserClickedARedirection` after the user clicks the redirection button.
- `UserClickedAbortARedirection` after the user clicks the abort redirection button.
</docs>
