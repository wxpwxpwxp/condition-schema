import { NodeRelationShip, StatementNode } from './node';
import { KeyValue } from './types';
import { nextTick } from './utils';
import { renderEmptyNode } from './view';

const MOVE_THRESHOLD = 5;

let currentStatementNode: StatementNode<KeyValue> | undefined;

export function setCurrentStatementNode<T extends KeyValue>(node: StatementNode<T>) {
  currentStatementNode = node;
}

export function getCurrentStatementNode() {
  return currentStatementNode;
}

export function clearCurrentStatementNode() {
  setCurrentStatementNode(undefined);
}

export function addStatementSelectListner(dom: HTMLElement ) {
  dom.addEventListener('mouseenter', function() {
    setCurrentStatementNode(dom.__condition__);
  });
}

export interface AddElementMoveListenerOptions<T extends KeyValue> {
  mousedownCallback?: (e: Event, node: StatementNode<T> | NodeRelationShip<T>) => Boolean;
  mousemoveCallback?: (e: Event, node: StatementNode<T> | NodeRelationShip<T>) => void;
  mouseupCallback?: (e: Event, node: StatementNode<T> | NodeRelationShip<T>) => void;
}

export function addElementMoveListener<T extends KeyValue>(node: StatementNode<T> | NodeRelationShip<T>, options?: AddElementMoveListenerOptions<T> ) {
  const dom = node.moveDom;
  const {
    mousedownCallback,
    mousemoveCallback,
    mouseupCallback,
  } = options;

  const mousedown = function(e) {
    const startX = e.clientX;
    const startY = e.clientY;
    let hasMoved = false;

    if (mousedownCallback && !mousedownCallback(e, node)) {
      return;
    }

    const mousemove = function(e) {
      const diffX = e.clientX - startX;
      const diffY = e.clientY - startY;

      node.move(diffX, diffY);

      mousemoveCallback?.(e, node);

      if (Math.abs(diffX) > MOVE_THRESHOLD && Math.abs(diffY) > MOVE_THRESHOLD) {
        hasMoved = true;
      } else {
        return;
      }
    };

    const mouseup = function(e) {
      dom.removeEventListener('mousemove', mousemove);
      dom.removeEventListener('mouseup', mouseup);

      if (!hasMoved) {
        node.move(0, 0);
        return;
      }

      const diffX = e.clientX - startX;
      const diffY = e.clientY - startY;

      node.position.x += diffX;
      node.position.y += diffY;

      mouseupCallback?.(e, node);
    };

    dom.addEventListener('mousemove', mousemove);
    dom.addEventListener('mouseup', mouseup);
  };

  dom.addEventListener('mousedown', mousedown);
}

export function clearRelationListener<T extends KeyValue>(ship: NodeRelationShip<T>) {
  addElementMoveListener(ship, {
    mouseupCallback() {
      const idx = ship.from.children.findIndex(i => i === ship);
      ship.from.children.splice(idx, 1);
      ship.to.parent = null;
      ship.lineDom.remove();
    }
  });
}

export function addRenderLineListner(dom: HTMLElement) {
  const onmousedown = async function(e) {
    const startNode = getCurrentStatementNode();
    clearCurrentStatementNode();

    if (!startNode) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const lineDom = renderEmptyNode();
    const arrowDom = renderEmptyNode();
    lineDom.classList.add('line');
    arrowDom.classList.add('line-arrow');
    lineDom.appendChild(arrowDom);
    lineDom.style.top = `${e.clientY - dom.getBoundingClientRect().top}px`;
    lineDom.style.left = `${e.clientX - dom.getBoundingClientRect().left}px`;
    let hasMoved = false;

    const onmousemove = function(e) {
      const diffX = e.clientX - startX;
      const diffY = e.clientY - startY;
      if (Math.abs(diffX) > MOVE_THRESHOLD && Math.abs(diffY) > MOVE_THRESHOLD) {
        if (!hasMoved) dom.appendChild(lineDom);
        hasMoved = true;
      } else {
        return;
      }
      const length = Math.sqrt(diffX * diffX + diffY * diffY);
      lineDom.style.height = `${length}px`;
      arrowDom.style.top = `${length}px`;

      let y, x = diffX / diffY, rad;

      if (diffX > 0 && diffY < 0) {
        y = 180;
        if (-x > 1) {
          x = diffY / diffX;
          rad = Math.PI / 2 - Math.tanh(-x);
        } else {
          rad = Math.tanh(-x);
        }
      }

      if (diffX > 0 && diffY > 0) {
        y = -90;
        if (x > 1) {
          x = diffY / diffX;
          rad = Math.tanh(x);
        } else {
          rad = Math.PI / 2 - Math.tanh(x);
        }
      }

      if (diffX < 0 && diffY > 0) {
        y = 0;
        if (-x > 1) {
          x = diffY / diffX;
          rad = Math.PI / 2 - Math.tanh(-x);
        } else {
          rad = Math.tanh(-x);
        }
      }

      if (diffX < 0 && diffY < 0) {
        y = 90;
        if (x > 1) {
          x = diffY / diffX;
          rad = Math.tanh(x);
        } else {
          rad = Math.PI / 2 - Math.tanh(x);
        }
      }

      lineDom.style.transform = `rotate(${( rad / Math.PI * 180) + y }deg)`;
    };

    const onmouseup = async function() {
      dom.removeEventListener('mousemove', onmousemove);
      dom.removeEventListener('mouseup', onmouseup);
      if (!hasMoved) {
        return;
      }

      lineDom.remove();

      await nextTick();

      const endpointNode = getCurrentStatementNode();
      clearCurrentStatementNode();

      console.log('startNode endpointNode', startNode, endpointNode);
      if (endpointNode && startNode !== endpointNode) {
        const relation = new NodeRelationShip({
          from: startNode,
          to: endpointNode,
          lineDom,
        });
        startNode.children.push(relation);
        endpointNode.parent = relation;
        clearRelationListener(relation);
        dom.appendChild(lineDom);
        return;
      }
    };

    dom.addEventListener('mousemove', onmousemove);
    dom.addEventListener('mouseup', onmouseup);
  };

  dom.addEventListener('mousedown', onmousedown);
}
