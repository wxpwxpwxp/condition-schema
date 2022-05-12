import { StatementNode, StatementNodeType } from './node';

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
  const dom = document.createElement('span');
  dom.textContent = text;
  return dom;
}

export function renderInput() {
  return document.createElement('input');
}

export function renderEmptyNode() {
  return document.createElement('div');
}

export function renderSelection() {
  return;
}
