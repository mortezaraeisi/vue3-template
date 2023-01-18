<template>
  <button
      class="w-full border rounded text-sm p-1 transition-all"
      style="height: 40px;"
      :class="btnClass"
      :type="type"
      :disabled="disabled"
      @click.stop="clicked"
  >
    <BaseLoading v-if="loading"/>
    <template v-else>
      {{ labelInAction }}
    </template>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import BaseLoading from './BaseLoading.vue';

const emit = defineEmits(['click']);

const props = defineProps({
  disabled: Boolean,
  label: String,
  loading: Boolean,
  negative: Boolean,
  primary: Boolean,
  secondary: Boolean,
  type: String,
});

const labelInAction = computed(() => {
  if (props.loading) {
    return 'loading';
  }
  return props.label;
});
const btnClass = computed(() => {
  if (props.primary) {
    return 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-red-500 dark:border-red-600 dark:hover:bg-red-600';
  }
  if (props.negative) {
    return 'bg-red-500 text-white hover:bg-red-600 dark:bg-blue-500 dark:border-blue-600 dark:hover:bg-blue-600';
  }
  if (props.secondary) {
    return 'dark:text-red-500 dark:border-red-500 dark:hover:bg-red-300 dark:hover:text-black';
  }
  return 'hover:border-blue-300 dark:hover:bg-red-300 dark:border-red-500';
});

function clicked() {
  if (props.disabled || props.loading) {
    return;
  }
  emit('click');
}
</script>
