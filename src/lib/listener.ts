import { NodeRelationShip, StatementNode } from './node';
import { nextTick } from './utils';

let currentStatementNode: StatementNode | undefined;

export function setCurrentStatementNode(node:StatementNode) {
  currentStatementNode = node;
}

export function getCurrentStatementNode() {
  return currentStatementNode;
}

export function clearCurrentStatementNode() {
  setCurrentStatementNode(undefined);
}

export function addStatementSelectListner(dom: HTMLElement ) {
  dom.onmousedown = function() {
    setCurrentStatementNode(dom.__condition__);
  };
  dom.onmouseup = function() {
    setCurrentStatementNode(dom.__condition__);
  };
}

export function clearRelationListener(ship: NodeRelationShip) {
  ship.lineDom.onmousedown = function(e) {
    const startX = e.clientX;
    const startY = e.clientY;
    let hasMoved = false;

    ship.lineDom.onmousemove = function(e) {
      if (Math.abs(startX - e.clientX) > 10 && Math.abs(startY - e.clientY) > 10) {
        hasMoved = true;
      } else {
        return;
      }
    };

    ship.lineDom.onmousedown = function() {
      if (!hasMoved) return;
      ship.lineDom.onmousemove = null;
      ship.lineDom.onmousedown = null;
      const idx = ship.from.children.findIndex(i => i === ship);
      ship.from.children.splice(idx, 1);
      ship.to.parent = null;
    };
  };
}

export function addRenderLineListner(dom: HTMLElement) {
  dom.onmousedown = async function(e) {
    await nextTick();
    const startNode = getCurrentStatementNode();
    clearCurrentStatementNode();

    if (!startNode) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const lineDom = document.createElement('div');
    const arrowDom = document.createElement('div');
    lineDom.classList.add('line');
    arrowDom.classList.add('line-arrow');
    lineDom.appendChild(arrowDom);
    lineDom.style.top = `${e.clientY - dom.getBoundingClientRect().top}px`;
    lineDom.style.left = `${e.clientX - dom.getBoundingClientRect().left}px`;
    let hasMoved = false;

    dom.onmousemove = function(e) {
      const diffX = e.clientX - startX;
      const diffY = e.clientY - startY;
      if (Math.abs(diffX) > 10 && Math.abs(diffY) > 10) {
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

    dom.onmouseup = async function() {
      dom.onmousemove = null;
      dom.onmouseup = null;
      if (!hasMoved) {
        return;
      }
      await nextTick();

      const endpointNode = getCurrentStatementNode();
      clearCurrentStatementNode();
      if (endpointNode && startNode !== endpointNode) {
        const relation = new NodeRelationShip({
          from: startNode,
          to: endpointNode,
          lineDom,
        });
        startNode.children.push(relation);
        endpointNode.parent = relation;
        clearRelationListener(relation);
        return;
      } else {
        dom.removeChild(lineDom);
      }
    };
  };
}
