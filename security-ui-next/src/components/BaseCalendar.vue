<template>
  <label class="flex-col">
    <span class="text-normal mr-2">
    {{ label }}
    </span>
    <input
      class="w-full"
      type="datetime-local"
      v-bind="$attrs"
      :checked="modelValue"
      @input="valueChanged"
    >
  </label>
</template>

<script setup lang="ts">

const emits = defineEmits([ 'update:modelValue' ]);
const props = withDefaults(defineProps<{ modelValue?: string, label?: string }>(), {
  modelValue: undefined,
  label: undefined,
});

function valueChanged(e: any) {
  // emits('update:modelValue', e.target.checked);
}

</script>
