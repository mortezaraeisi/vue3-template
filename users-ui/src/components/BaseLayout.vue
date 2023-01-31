<template>
  <section class="fit column base-layout">
    <header v-if="hasHeaderSlot" class="col-auto base-layout__header">
      <slot name="header"></slot>
    </header>
    <article class="col base-layout__body">
      <slot>Body</slot>
    </article>
    <footer v-if="hasFooterSlot" class="col-auto base-layout__footer">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

const slots = useSlots();
const hasHeaderSlot = computed(() => !!slots.header);
const hasFooterSlot = computed(() => !!slots.footer);
</script>

<style lang="scss">
.base-layout {
  &__body {
    background-color: var(--q-dark-page);
    transition: background-color .3s ease-in-out;
  }
}
</style>
