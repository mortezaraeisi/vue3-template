<template>
  <form
    @submit.stop="submit"
    @reset="reset"
  >
    <slot></slot>
  </form>
</template>

<script setup>
import { onMounted, provide } from 'vue';

const emit = defineEmits(['submit', 'reset']);
const props = defineProps({
  autofocus: Boolean,
  greedy: Boolean,
});

const children = [];

function registerChildren({ focus, checkValidation, setValidationError, resetValidationError }) {
  children.push({ focus, checkValidation, setValidationError, resetValidationError });
}

provide('registerChildren', registerChildren);

function submit() {
  console.log('submit');
  children.forEach(x => x.resetValidationError());
  let hasError = false;
  for (const cmp of children) {
    const msg = cmp.checkValidation();
    if (msg !== true) {
      hasError = true;
      cmp.setValidationError(msg);
    }
  }
  if (!hasError) {
    emit('submit');
  }
}

function reset() {
  children.forEach(x => x.resetValidationError());
  emit('reset');
}

onMounted(() => {
  const focus = children[0]?.focus;
  if (props.autofocus && typeof focus === 'function') {
    focus();
  }
});
</script>
