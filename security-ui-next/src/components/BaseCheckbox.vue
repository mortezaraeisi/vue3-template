<template>
  <label class="flex items-center">
    <input
      ref="inputRef"
      type="checkbox"
      v-bind="$attrs"
      :checked="modelValue"
      @input="valueChanged"
    >
    <span class="text-normal mr-2">
    {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

const inputRef = ref<HTMLInputElement>();

const emits = defineEmits([ 'update:modelValue' ]);
const props = withDefaults(defineProps<{ modelValue: boolean | null, label?: string }>(), {
  modelValue: null,
  label: undefined,
});

function valueChanged(e: any) {
  emits('update:modelValue', e.target.checked);
}

onMounted(() => {
  nextTick(() => {
    if (props.modelValue == null && inputRef.value) {
      inputRef.value.indeterminate = true;
    }
  });
});
</script>

<style lang="scss">

</style>
