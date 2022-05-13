import { renderConditionPanel, renderEmptyNode, renderRelationPanel } from './view';

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

export interface NodeRelationShipOptions {
  from: StatementNode;
  to: StatementNode;
  lineDom: HTMLElement;
}

export class NodeRelationShip {
  from: StatementNode;
  to: StatementNode;
  lineDom: HTMLElement;

  constructor(options: NodeRelationShipOptions) {
    this.from = options.from;
    this.to = options.to;
    this.lineDom = options.lineDom;
  }
}

export class StatementNode {
  type: StatementNodeType;
  readonly dom: HTMLElement;
  children?: NodeRelationShip[];
  parent?: NodeRelationShip;

  constructor(options) {
    this.type = options.type;
    this.dom = options.dom;
    this.dom.__condition__ = this;
  }
}

interface StatementTypeOptions {
  type: StatementNodeType;
}

export class StatementNodeWithPanel extends StatementNode {
  panelDom?: HTMLElement;
  getPanelDom: () => HTMLElement;

  constructor(options: StatementTypeOptions) {
    const dom = renderEmptyNode();
    if (options.type === StatementNodeType.condition) {
      dom.classList.add('condition-node');
    } else if (options.type === StatementNodeType.relation) {
      dom.classList.add('relation-node');
    }

    super({
      dom,
      type: options.type
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
  }
}
