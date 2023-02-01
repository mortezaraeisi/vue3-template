type inputVal = string | number | null
type output = boolean | string;

function isEmpty(val: inputVal): boolean {
  if (!val) {
    return true;
  }
  if (typeof val === 'string' && !val.trim()) {
    return true;
  }
  return false;
}

export function useRules() {
  function required(val: inputVal): output {
    if (isEmpty(val)) {
      return 'Required';
    }
    return true;
  }

  return {
    required,
  };
}
