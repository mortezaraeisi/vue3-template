import { ref, getCurrentInstance, computed, inject, onMounted } from 'vue';
import * as rules from '../utils/validation-rule';

export function useValidation(refName: string) {
  const { props, vnode } = getCurrentInstance() ?? {};
  if (!props || !vnode) {
    throw new Error('Cannot access to the current instance values')
  }

  const validationRules = ref([] as Array<Function>);
  const validationErrorMsg = ref('');
  const hasValidationError = computed(() => !!validationErrorMsg.value);

  if (Array.isArray(props.rules)) {
    validationRules.value = validationRules.value.concat(props.rules);
  }
  if (props.required) {
    validationRules.value.unshift(rules.required);
  }

  function setValidationError(msg: string) {
    validationErrorMsg.value = msg;
  }

  function resetValidationError() {
    validationErrorMsg.value = '';
  }

  function checkValidation() {
    if (!validationRules.value.length) {
      return true;
    }
    for (const validate of validationRules.value) {
      const res = validate(props?.modelValue);
      if (typeof res === 'string') {
        return res;
      }
      if (typeof res === 'boolean' && res === false) {
        return 'مقدار معتبر نیست.';
      }
    }
    return true;
  }

  function focus() {
    const target: any = vnode?.component?.refs[refName];
    if (typeof target?.focus === 'function') {
      target.focus();
    }
  }

  const registerInForm = inject('registerChildren', (opt: any) => opt);
  onMounted(() => registerInForm({
    focus,
    checkValidation,
    setValidationError,
    resetValidationError,
  }));

  return {
    validationRules,
    checkValidation,
    hasValidationError,
    validationErrorMsg,
    setValidationError,
    resetValidationError,
  };
}
