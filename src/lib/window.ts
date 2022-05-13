import { StatementNodeType, StatementNodeWithPanel } from './node';
import { KeyValue } from './types';
import { renderChildren, renderEmptyNode, renderWindowPanel, renderWindowWorkspace } from './view';

export abstract class ConditionSchemaWindow<T extends KeyValue> {
  context: T
}

export class ConditionSchemaWebWindow<T extends KeyValue> extends ConditionSchemaWindow<T> {
  dom: HTMLElement
  panel: HTMLElement
  workspace: HTMLElement
  panelContainer: HTMLElement

  constructor() {
    super();
    this.renderPanel();
    this.renderWorkspace();
    this.dom = renderEmptyNode();

    renderChildren(this.dom, [this.workspace, this.panelContainer]);
    this.mountPanel(this.panel);
  }

  renderPanel() {
    this.panelContainer = renderEmptyNode();
    this.panel = renderWindowPanel({
      relationAddCallback: () => {
        const node = new StatementNodeWithPanel({
          type: StatementNodeType.relation
        });
        this.workspace.appendChild(node.dom);
      },
      conditionAddCallback: () => {
        const node = new StatementNodeWithPanel({
          type: StatementNodeType.condition
        });
        this.workspace.appendChild(node.dom);
      }
    });
  }

  renderWorkspace() {
    this.workspace = renderWindowWorkspace();
  }

  mountPanel(dom: HTMLElement) {
    if (this.panelContainer.lastChild) {
      this.panelContainer.removeChild(this.panelContainer.lastChild);
    }
    this.panelContainer.appendChild(dom);
  }
}
