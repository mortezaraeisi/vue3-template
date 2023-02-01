<template>
  <div class="column base-input">
    <label v-if="hasLabel">
      {{ label }}
    </label>
    <q-input
      :inputmode="inputMode"
      :readonly="readonly"
      :model-value="modelValue"
      v-bind="$attrs"
      :rules="accRules"
      @update:model-value="changed"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ValidationRule } from 'quasar';
import { useRules } from 'src/compositions/use-rules';

const emit = defineEmits(['update:model-value']);
const rules = useRules();

interface IProps {
  modelValue: string | number;
  label?: string,
  readonly?: boolean;
  required?: boolean;
  numeric?: 'decimal' | 'numeric';
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' | 'none',
  rules?: Array<ValidationRule>,
}

const props = withDefaults(defineProps<IProps>(), {
  readonly: false,
  required: false,
});

const hasLabel = computed(() => !!props.label);
const inputMode = computed(() => {
  if (props.inputMode) {
    return props.inputMode;
  }
  if (props.numeric) {
    return props.numeric;
  }
  return 'text';
});
const accRules = computed(() => {
  const lst = props.rules ?? [];
  if (props.required) {
    lst.unshift(rules.required);
  }
  return lst;
});

function changed(val: string) {
  const returnee = props.numeric ? Number(val) : val;
  emit('update:model-value', returnee);
}
</script>
