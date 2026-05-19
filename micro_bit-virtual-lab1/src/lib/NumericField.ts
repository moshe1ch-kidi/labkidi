import * as Blockly from 'blockly';

export class NumericField extends Blockly.FieldTextInput {
  static onTrigger: (field: NumericField, initialValue: string, callback: (value: string) => void) => void;

  showEditor_() {
    // Prevent the default editor from appearing
    if (typeof NumericField.onTrigger === 'function') {
      NumericField.onTrigger(this, this.getValue(), (newValue) => {
        this.setValue(newValue);
      });
    }
  }
}
