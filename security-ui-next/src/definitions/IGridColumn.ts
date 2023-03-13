export interface IGridColumn {
  field: string,
  title: string,
  width: number,
  cell?: string,
  props?: object,
  style?: Partial<CSSStyleDeclaration>,
  filter?: string,
  mapper?: string | Function,
  sortable?: boolean
}
