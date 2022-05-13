import { addRenderLineListner } from './listener';
import { StatementNodeType, StatementNodeWithPanel } from './node';
import { KeyValue } from './types';
import { renderChildren, renderEmptyNode, renderWindowPanel, renderWindowWorkspace } from './view';

export abstract class ConditionSchemaWindow<T extends KeyValue> {
  context: T
}

export enum WorkspaceMode {
  normal = 0,
  line = 1
}

export class ConditionSchemaWebWindow<T extends KeyValue> extends ConditionSchemaWindow<T> {
  dom: HTMLElement
  panel: HTMLElement
  workspace: HTMLElement
  panelContainer: HTMLElement
  mode: WorkspaceMode

  constructor() {
    super();
    this.renderPanel();
    this.renderWorkspace();
    this.dom = renderEmptyNode();
    this.dom.classList.add('condition-window');
    this.mode = WorkspaceMode.normal;

    renderChildren(this.dom, [this.workspace, this.panelContainer]);
    this.mountPanel(this.panel);
  }

  renderPanel() {
    this.panelContainer = renderEmptyNode();
    this.panelContainer.classList.add('condition-window__panel-container');

    let count = 0;

    this.panel = renderWindowPanel({
      relationAddCallback: () => {
        const node = new StatementNodeWithPanel({
          type: StatementNodeType.relation,
          window: this
        });
        this.workspace.appendChild(node.dom);
      },
      conditionAddCallback: () => {
        const node = new StatementNodeWithPanel({
          type: StatementNodeType.condition,
          window: this
        });
        this.workspace.appendChild(node.dom);
      },
      renderLineCallback: () => {
        count ++;
        if (count % 2) {
          this.mode = WorkspaceMode.line;
          addRenderLineListner(this.workspace);
        } else {
          this.mode = WorkspaceMode.normal;
          this.workspace.onmousedown = null;
        }
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
