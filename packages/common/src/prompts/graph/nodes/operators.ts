import { type INodeInputSlot, type INodeOutputSlot, LGraphNode, LLink } from 'litegraph.js';

export class LogicalAndNode extends LGraphNode {
  static title = 'Logical And';

  constructor() {
    super();

    this.title = 'Logical And';

    this.addInput('Input 1', 'boolean');
    this.addInput('Input 2', 'boolean');

    this.addOutput('All True', 'boolean');
  }

  onConnectionsChange(_type: number, slotIndex: number, isConnected: boolean, _link: LLink, _ioSlot: INodeOutputSlot | INodeInputSlot) {
    if (slotIndex === (this.inputs.length - 1) && isConnected) {
      this.addInput(`Input ${this.inputs.length + 1}`, 'boolean');
    }
    else {
      for (let i = this.inputs.length - 1; i > 1; --i) {
        if (!this.isInputConnected(i - 1))
          this.removeInput(i);
        else
          break;
      }
    }
  }

  onExecute() {
    let output = true;
    let anyInputConnected = false;

    for (let i = 0; i < this.inputs.length; ++i) {
      const inputValue = this.getInputData<boolean | undefined>(i);

      if (inputValue === undefined)
        continue;

      anyInputConnected = true;
      output &&= inputValue;
    }

    return anyInputConnected && output;
  }
}

export class LogicalOrNode extends LGraphNode {
  static title = 'Logical Or';

  constructor() {
    super();

    this.title = 'Logical Or';

    this.addInput('Input 1', 'boolean');
    this.addInput('Input 2', 'boolean');

    this.addOutput('Some True', 'boolean');
  }

  onConnectionsChange(_type: number, slotIndex: number, isConnected: boolean, _link: LLink, _ioSlot: INodeOutputSlot | INodeInputSlot) {
    if (slotIndex === (this.inputs.length - 1) && isConnected) {
      this.addInput(`Input ${this.inputs.length + 1}`, 'boolean');
    }
    else {
      for (let i = this.inputs.length - 1; i > 1; --i) {
        if (!this.isInputConnected(i - 1))
          this.removeInput(i);
        else
          break;
      }
    }
  }

  onExecute() {
    let output = false;
    let anyInputConnected = false;

    for (let i = 0; i < this.inputs.length; ++i) {
      const inputValue = this.getInputData<boolean | undefined>(i);

      if (inputValue === undefined)
        continue;

      anyInputConnected = true;
      output ||= inputValue;
    }

    return anyInputConnected && output;
  }
}

export class EqualsNode extends LGraphNode {
  static title = 'Equals';

  constructor() {
    super();

    this.title = 'Equals';

    this.addInput('A', 'any');
    this.addInput('B', 'any');

    this.addOutput('A=B', 'boolean');
  }

  onExecute() {
    const inputA = this.getInputData<any | undefined>(0);
    const inputB = this.getInputData<any | undefined>(1);

    if (inputA === undefined || inputB === undefined) {
      this.setOutputData(0, undefined);
    }
    else {
      // eslint-disable-next-line eqeqeq
      this.setOutputData(0, inputA == inputB);
    }
  }
}
