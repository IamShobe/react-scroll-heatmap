export type MarkerConfig = {
  priority?: number
  color: string
}

type RowTypeName<T extends ReadonlyArray<string>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never;

export type MarkersConfig<T extends ReadonlyArray<string>> = {
  [K in RowTypeName<T>]: MarkerConfig
}

export type Marker<T> = {
  rowIndex: number
  type: keyof T
}