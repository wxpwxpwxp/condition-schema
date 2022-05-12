export class ConditionSchema<T extends Record<string, unknown>> {
  dom: HTMLElement
  context: T
  export: () => Object
}
