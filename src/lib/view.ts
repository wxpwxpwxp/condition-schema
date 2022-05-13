import { StatementNode, StatementNodeButtonText, StatementNodeType } from './node';

export function renderActionPanel(node: StatementNode) {
  switch (node.type) {
  case StatementNodeType.condition:
    return renderConditionPanel();
  case StatementNodeType.relation:
    return renderRelationPanel();
  default:
    return null;
  }
}

export function renderConditionPanel() {
  return renderChildren(renderEmptyNode(), [
    renderInputItem('')
  ]);
}

export function renderRelationPanel() {
  return renderChildren(renderEmptyNode(), [
    renderInputItem('')
  ]);
}

export function renderChildren(parent: HTMLElement, children: HTMLElement[]) {
  children.forEach(c =>{
    parent.appendChild(c);
  });
  return parent;
}

export function renderInputItem(text:string) {
  return renderChildren(renderEmptyNode(), [
    renderText(text),
    renderInput()
  ]);
}

export function renderText(text:string) {
  const dom = renderEmptyNode('span');
  dom.textContent = text;
  return dom;
}

export function renderInput() {
  return renderEmptyNode('input');
}

export function renderEmptyNode(tagName: keyof HTMLElementTagNameMap = 'div') {
  return document.createElement(tagName);
}

export function renderSelection() {
  return;
}
export function renderButton(text: string, callback: EventListener) {
  const button = renderEmptyNode('button');
  button.textContent = text;
  button.addEventListener('click', callback);
  return button;
}

export interface RenderWindowPanelOptions {
  conditionAddCallback: EventListener;
  relationAddCallback: EventListener;
}

export function renderWindowPanel(options: RenderWindowPanelOptions) {
  const {
    conditionAddCallback,
    relationAddCallback
  } = options;
  return renderChildren(renderEmptyNode(), [
    renderButton(StatementNodeButtonText[StatementNodeType.condition], conditionAddCallback),
    renderButton(StatementNodeButtonText[StatementNodeType.relation], relationAddCallback)
  ]);
}

export function renderWindowWorkspace() {
  const node = renderEmptyNode();
  node.classList.add('workspace');
  return node;
}
