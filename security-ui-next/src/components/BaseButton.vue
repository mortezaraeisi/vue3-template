<template>
  <button
    class="flex items-center justify-center border rounded text-sm p-1 transition-all h-9"
    :class="btnClass"
    :type="type"
    :disabled="disabled"
    @click.stop="clicked"
  >
    <base-icon v-if="hasIcon" :name="icon" class="m-2"/>
    <base-loading v-if="loading"/>
    <template v-else>
      {{ labelInAction }}
    </template>
  </button>
</template>

<script setup lang="ts">

import { computed } from 'vue';

const emit = defineEmits([ 'click' ]);

const props = withDefaults(defineProps<{
  label?: string,
  icon?: string,
  disabled?: boolean,
  loading?: boolean,
  negative?: boolean,
  primary?: boolean,
  secondary?: boolean,
  type?: 'submit' | 'reset' | undefined,
}>(), {});

const labelInAction = computed(() => {
  if (props.loading) {
    return 'loading';
  }
  return props.label;
});

const hasIcon = computed(() => !!props.icon);

const btnClass = computed(() => {
  const defClass = !props.primary && !props.negative && !props.secondary;
  return {
    'bg-blue-500 text-white dark:bg-red-500 dark:border-red-600': props.primary,
    'over:bg-blue-600 dark:hover:bg-red-600': !props.disabled && props.primary,
    'bg-red-500 text-white hover:bg-red-600 dark:bg-blue-500 dark:border-blue-600': props.negative,
    'hover:bg-red-600 dark:hover:bg-blue-600': !props.disabled && props.negative,
    'dark:text-red-500 dark:border-red-500': props.secondary,
    'dark:hover:bg-red-300 dark:hover:text-black': !props.disabled && props.secondary,
    'dark:border-red-500': defClass,
    'hover:border-blue-300 dark:hover:bg-red-300 ': !props.disabled && defClass,
    'opacity-60': props.disabled,
  };
});

function clicked() {
  if (props.disabled || props.loading) {
    return;
  }
  emit('click');
}
</script>
