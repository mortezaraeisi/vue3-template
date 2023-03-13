<template>
  <section class="base-layout">
    <div>
      <div v-if="hasHeaderSlot" class="base-layout__top">
        <slot name="header"></slot>
      </div>
    </div>
    <div class="base-layout__body">
      <slot>Body</slot>
    </div>
    <div v-if="hasFooterSlot" class="base-layout__bottom">
      <slot name="footer"></slot>
    </div>
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
  height: 100%;

  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-gap: 5px;

  &__top {
  }

  &__body {
    overflow: auto;
    transition: background-color .3s ease-in-out;
  }

  &__bottom {
  }

}
</style>
