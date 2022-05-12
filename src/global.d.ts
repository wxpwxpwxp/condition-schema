import { StatementNode } from "./core/node"

declare global {
  export interface HTMLElement {
    __condition__?: StatementNode
  }
}

export {}
