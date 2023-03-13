<template>
  <section class="base-page relative bg-gray-50">
    <div
      v-if="loading"
      class="absolute inset-0 bg-gray-500 bg-opacity-30 transition-opacity flex justify-center items-center"
    >
      <base-loading style="width: 100px; height: 40px;"/>
    </div>
    <base-layout>
      <template v-if="hasHeader" #header>
        <div v-if="hasTitle">
          {{ title }}
        </div>
        <slot
          v-if="hasHeaderSlot"
          name="header"
          v-bind="slots.header"
        ></slot>
      </template>

      <slot></slot>

      <template v-if="hasFooterSlot" #footer>
        <slot
          name="footer"
          v-bind="slots.footer"
        ></slot>
      </template>
    </base-layout>
  </section>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { useRouter } from 'vue-router';

interface IProps {
  title?: string;
  loading?: boolean;
}

const slots = useSlots();
const props = withDefaults(defineProps<IProps>(), {});

const hasTitle = computed(() => !!props.title);
const hasHeaderSlot = computed(() => !!slots.header);
const hasFooterSlot = computed(() => !!slots.footer);
const hasHeader = computed(() => hasTitle.value || hasHeaderSlot.value);

const router = useRouter();

async function closePage() {
  if (typeof props.closable === 'boolean') {
    if (props.closable) {
      router.back();
    }
  } else {
    await router.push({ name: props.closable });
  }
}
</script>

<style lang="scss">
.base-page {
  height: calc(100vh - 50px);
  padding: 15px;

  .base-layout {
    &__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      height: 38px;

      & > :first-child {
        flex: 0 0 auto;
        font-size: 16px;
        padding: 0 10px 0 5px;
      }
    }
  }
}
</style>
