<template>
  <div class="dark:bg-black dark:text-white">
    <label v-if="hasLabel" class="text-normal">
      {{ label }}
    </label>
    <div
      class="flex flex-nowrap rounded border dark:border-red-500 transition-all"
      :class="{'border-red-500': hasError, 'opacity-50': readonly}"
    >
      <slot name="prepend"></slot>
      <textarea
        v-if="isTextArea"
        ref="theInput"
        class="basis-full bg-white dark:bg-black dark:text-red-500 text-sm outline-0 border-0 rounded p-1"
        :readonly="readonly"
        :value="modelValue"
        @input="onValue"
      />
      <input
        v-else
        ref="theInput"
        class="w-full bg-white dark:bg-black dark:text-red-500 text-sm outline-0 border-0 rounded p-1"
        v-bind="$attrs"
        :type="type"
        :readonly="readonly"
        :value="modelValue"
        @input="onValue"
      >
      <slot name="append"></slot>
    </div>
    <div
      v-if="hasValidationError"
      class="text-red-500 text-xs"
    >
      {{ validationErrorMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useValidation } from '../composition/use-validation';

const { validationErrorMsg, hasValidationError } = useValidation('theInput');

const emits = defineEmits([ 'update:modelValue' ]);
const props = defineProps({
  debounce: Boolean,
  error: String,
  label: String,
  ltr: Boolean,
  readonly: Boolean,
  required: Boolean,
  type: String,
  modelValue: [ String, Number, Array ],
});

const isTextArea = computed(() => props.type === 'textarea');
const hasLabel = computed(() => !!props.label);
const hasError = computed(() => !!props.error);

let debounceTimeout: number;

function onValue(evt: any) {
  const value = evt.currentTarget.value;
  if (props.debounce) {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      emits('update:modelValue', value);
    }, 500);
  } else {
    emits('update:modelValue', value);
  }
}
</script>

