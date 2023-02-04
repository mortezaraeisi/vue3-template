<template>
  <section class="base-layout">
    <div class="base-layout__top">
      <slot name="top"></slot>
    </div>
    <div class="base-layout__body">
      <slot></slot>
    </div>
    <div class="base-layout__bottom">
      <slot name="bottom"></slot>
    </div>
  </section>
</template>

<style lang="scss">
.base-layout {
  height: 100%;
  background-color: var(--q-color-base-5);

  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-gap: 5px;

  &__top {
  }

  &__body {
    overflow: auto;
    background-color: var(--q-dark-page);
    transition: background-color .3s ease-in-out;
  }

  &__bottom {
  }
}
</style>
