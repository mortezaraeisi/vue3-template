export type CellType =
  'string'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'user'
  | 'group'
  | 'role'
  | 'mobile'
  | 'domain'
  | 'resource'
  | 'workspace'
  | 'apiKey';

export interface IGridColumn {
  field: string,
  title: string,
  width: number,
  cell?: string,
  props?: object,
  style?: Partial<CSSStyleDeclaration>,
  filter?: string,
  mapper?: string | Function,
  sortable?: boolean,
  type?: CellType
  filterable?: boolean
}
