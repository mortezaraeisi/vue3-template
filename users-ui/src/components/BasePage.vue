<template>
  <q-page class="base-page">
    <base-layout style="min-height: inherit">
      <template v-if="hasHeader" #header>
        <div v-if="hasTitle || closable">
          {{ title }}
        </div>
        <slot
          v-if="hasHeaderSlot"
          name="header"
          v-bind="slots.header"
        ></slot>
        <template v-if="closable">
          <div class="q-mx-sm">
            <q-btn
              dense
              round
              flat
              icon="fas fa-close"
              size="10px"
              @click="closePage"
            />
          </div>
        </template>
      </template>

      <slot></slot>

      <template v-if="hasFooterSlot" #footer>
        <slot
          name="footer"
          v-bind="slots.footer"
        ></slot>
      </template>
    </base-layout>
  </q-page>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { useRouter } from 'vue-router';

interface IProps {
  title?: string;
  closable: boolean | string;
}

const slots = useSlots();
const props = withDefaults(defineProps<IProps>(), {
  closable: false,
});

const hasTitle = computed(() => !!props.title);
const hasHeaderSlot = computed(() => !!slots.header);
const hasFooterSlot = computed(() => !!slots.footer);
const hasHeader = computed(() => hasTitle.value || hasHeaderSlot.value || props.closable);

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
  .base-layout {
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 2px;
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
