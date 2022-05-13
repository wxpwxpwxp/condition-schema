import { addElementMoveListener, addStatementSelectListner } from './listener';
import { KeyValue } from './types';
import { renderConditionPanel, renderEmptyNode, renderRelationPanel } from './view';
import { ConditionSchemaWebWindow, ConditionSchemaWindow, WorkspaceMode } from './window';

/**
 * @example
 * eg..
 *
 * condition => a in [xxxx] or a === c
 *
 * relation => a || b or c || d
 */
export enum StatementNodeType {
  condition = 1,
  relation = 2
}

export const StatementNodeButtonText = {
  [StatementNodeType.condition]: '新增条件语块',
  [StatementNodeType.relation]: '新增关系语块'
};

export interface NodeRelationShipOptions<T extends KeyValue> {
  from: StatementNode<T>;
  to: StatementNode<T>;
  lineDom: HTMLElement;
}

export class Position {
  position: {x: number; y: number}
  moveDom: HTMLElement;

  constructor() {
    this.position = {
      x: 0,
      y: 0
    };
  }

  move(x: number, y: number) {
    this.moveDom.style.transform = `translate(${this.position.x + x}px, ${this.position.y + y}px)`;
  }
}

export class NodeRelationShip<T extends KeyValue> extends Position {
  from: StatementNode<T>;
  to: StatementNode<T>;
  lineDom: HTMLElement;

  constructor(options: NodeRelationShipOptions<T>) {
    super();
    this.from = options.from;
    this.to = options.to;
    this.lineDom = options.lineDom;
    this.moveDom = this.lineDom;
  }
}

export class StatementNode<T extends KeyValue> extends Position {
  type: StatementNodeType;
  readonly dom: HTMLElement;
  children: NodeRelationShip<T>[];
  parent?: NodeRelationShip<T>;
  window: ConditionSchemaWebWindow<T>;

  constructor(options) {
    super();
    this.type = options.type;
    this.dom = options.dom;
    this.dom.__condition__ = this;
    this.moveDom = this.dom;
    this.window = options.window;
    this.children = [];
  }
}

interface StatementTypeOptions<T extends KeyValue> {
  type: StatementNodeType;
  window: ConditionSchemaWindow<T>;
}

export class StatementNodeWithPanel<T extends KeyValue> extends StatementNode<T> {
  panelDom?: HTMLElement;
  getPanelDom: () => HTMLElement;

  constructor(options: StatementTypeOptions<T>) {
    const dom = renderEmptyNode();
    if (options.type === StatementNodeType.condition) {
      dom.classList.add('condition-node');
    } else if (options.type === StatementNodeType.relation) {
      dom.classList.add('relation-node');
    }

    super({
      dom,
      type: options.type,
      window: options.window,
    });

    this.panelDom = undefined;
    this.getPanelDom = () => {
      if (!this.panelDom) {
        if (options.type === StatementNodeType.condition) {
          this.panelDom = renderConditionPanel();
        } else if (options.type === StatementNodeType.relation) {
          this.panelDom = renderRelationPanel();
        }
      }
      return this.panelDom;
    };

    addStatementSelectListner(this.dom);

    addElementMoveListener(this, {
      mousedownCallback: () => {
        return this.window.mode !== WorkspaceMode.line;
      }
    });
  }
}
