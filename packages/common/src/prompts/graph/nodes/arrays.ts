import { type IWidget, LGraphNode } from 'litegraph.js';

export class ArrayConstantNode extends LGraphNode {
  static title = 'List of values';

  private value: string[];
  private widget: IWidget<string>;

  constructor() {
    super();
    this.title = 'List of values';

    this.value = [];
    this.addOutput('arrayOut', 'array');
    this.addOutput('length', 'number');
    this.addProperty('value', '', 'array');
    this.widget = this.addWidget('text', 'Values', this.properties.value, 'value');
    this.widgets_up = true;
    this.size = [200, 50];
  }

  onPropertyChanged(name: string, newValue: string | null, _prevValue: any): void | boolean {
    if (newValue === null || newValue === '') {
      return;
    }
    this.value = newValue.split(',').map(v => v.trim());

    this.setSize(this.computeSize());
  }

  onExecute() {
    this.setOutputData(0, this.value);
    this.setOutputData(1, this.value.length);
  }
}

export class IsInArrayNode extends LGraphNode {
  static title = 'Is in list';

  constructor() {
    super();
    this.title = 'Value in list';

    this.addInput('Value', 'any');
    this.addInput('List', 'array');
    this.addOutput('Is in list', 'boolean');
  }

  onExecute() {
    const value = this.getInputData<string | undefined>(0);
    const array = this.getInputData<Array<string> | undefined>(1);

    if (value === undefined || array === undefined) {
      this.setOutputData(0, false); // or undefined?
    }
    else {
      this.setOutputData(0, array.includes(value)); // FIXME: check value type
    }
  }
}
