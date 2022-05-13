import { KeyValue } from './types';
import { ConditionSchemaWebWindow } from './window';


export interface ConditionSchemaOptions <T extends KeyValue> {
  dom: HTMLElement;
  context: T;
}

export class ConditionSchema<T extends KeyValue> {
  dom: HTMLElement
  context: T
  export: () => Object
  import: () => void
  destory: () => void
  window: ConditionSchemaWebWindow<T>

  constructor(options: ConditionSchemaOptions<T>) {
    this.context = options.context;
    this.dom = options.dom;
    this.window = new ConditionSchemaWebWindow<T>();
    this.dom.appendChild(this.window.dom);
  }
}
