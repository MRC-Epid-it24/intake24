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

    this.addProperty('includeAll', 'all', 'string');
    this.addWidget('combo', 'Multiple values', this.properties.includeAll, 'includeAll', { values: ['all', 'any'] });
    this.addInput('Value', 'any');
    this.addInput('List', 'array');
    this.addOutput('Is in list', 'boolean');
    this.setSize([200, 80]);
  }

  onExecute() {
    const value = this.getInputData<any | undefined>(0);
    const array = this.getInputData<Array<string> | undefined>(1);

    if (value === undefined || array === undefined) {
      this.setOutputData(0, undefined);
    }
    else {
      if (Array.isArray(value)) {
        if (this.properties.includeAll === 'all')
          this.setOutputData(0, value.every(el => array.includes(el)));
        else
          this.setOutputData(0, value.some(el => array.includes(el)));
      }
      else {
        this.setOutputData(0, array.includes(value.toString()));
      }
    }
  }
}
