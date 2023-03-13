export function isEmpty(val: any): boolean {
  if (!val) {
    return true;
  }
  if (typeof val === 'string') {
    return val.trim().length === 0;
  }
  if (typeof val === 'number') {
    return val === 0;
  }
  return false;
}

export function required(val: any): boolean | string {
  if (isEmpty(val)) {
    return 'الزامیست';
  }
  return true;
}
