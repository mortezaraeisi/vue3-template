<template>
  <div class="dark:bg-black dark:text-white">
    <label v-if="hasLabel" class="text-normal">
      {{ label }}
    </label>
    <div
      class="flex flex-nowrap rounded border dark:border-red-500 transition-all"
      :class="{'border-red-500': hasError, 'opacity-50': readonly}"
      @click="onClick"
    >
      <slot name="prepend"></slot>
      <textarea
        v-if="isTextArea"
        ref="theInput"
        class="basis-full bg-white dark:bg-black dark:text-red-500 text-sm outline-0 border-0 rounded p-1"
        :class="inputClass"
        :readonly="readonly"
        :value="modelValue"
        @input="onValue"
        @click="onClick"
      />
      <input
        v-else
        ref="theInput"
        class="w-full bg-white dark:bg-black dark:text-red-500 text-sm outline-0 border-0 rounded p-1"
        :class="inputClass"
        v-bind="$attrs"
        :type="type"
        :readonly="readonly"
        :value="modelValue"
        @input="onValue"
        @click="onClick"
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

interface IProps {
  debounce?: boolean
  error?: string
  label?: string
  ltr?: boolean
  readonly?: boolean
  required?: boolean,
  type?: string,
  inputClass?: string | object,
  modelValue: string | number | Array<any>,
}

const emits = defineEmits([ 'update:modelValue', 'click' ]);
const props = defineProps<IProps>();

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

function onClick() {
  emits('click');
}
</script>

