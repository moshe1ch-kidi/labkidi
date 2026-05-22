import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';
import { pythonGenerator, Order as PythonOrder } from 'blockly/python';
import { NumericField } from './NumericField';

export const COLORS = {
  CONTROL: '#FFAB19',
  SENSOR: '#5CB1D6',
  OUTPUT: '#9966FF',
  MATH: '#59C059',
  OPERATORS: '#FFAB19',
};

// Define custom blocks for Micro:bit
export const defineBlocks = (icons: { moisture: string, ultrasonic: string, potentiometer: string, ldr: string, colorSensor: string, pirSensor: string, tempSensor: string, soundSensor: string, push: string, motor: string, servo: string, led: string, buzzer: string, forever: string, wait: string, repeat: string }) => {
  // Buzzer / Play Tone
  Blockly.Blocks['microbit_buzzer'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Buzzer')
          .appendField(new Blockly.FieldDropdown([
            ['C (Middle)', '262'],
            ['D', '294'],
            ['E', '330'],
            ['F', '349'],
            ['G', '392'],
            ['A', '440'],
            ['B', '494'],
            ['C (High)', '523']
          ]), 'NOTE')
          .appendField('For')
          .appendField(new NumericField('1'), 'DURATION')
          .appendField('Sec')
          .appendField(new Blockly.FieldImage(icons.buzzer, 30, 30, 'buzzer'));
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLORS.OUTPUT);
      this.setTooltip('Plays a tone on the buzzer');
    }
  };

  javascriptGenerator.forBlock['microbit_buzzer'] = function(block) {
    const frequency = block.getFieldValue('NOTE');
    const sec = block.getFieldValue('DURATION') || '1';
    const ms = Number(sec) * 1000;
    return `await microbit.playTone(${frequency}, ${ms});\n`;
  };

  pythonGenerator.forBlock['microbit_buzzer'] = function(block) {
    const frequency = block.getFieldValue('NOTE');
    const sec = block.getFieldValue('DURATION') || '1';
    const ms = Math.round(Number(sec) * 1000);
    return `microbit.play_tone(${frequency}, ${ms})\n`;
  };

  // Motor
  Blockly.Blocks['microbit_motor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Motor Speed')
          .appendField(new NumericField('50'), 'SPEED')
          .appendField(new Blockly.FieldImage(icons.motor, 30, 30, 'motor'));
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLORS.OUTPUT);
      this.setTooltip('Sets the motor speed (0-100)');
    }
  };

  javascriptGenerator.forBlock['microbit_motor'] = function(block) {
    const speed = block.getFieldValue('SPEED') || '0';
    return `await microbit.setMotorSpeed(${speed});\n`;
  };

  pythonGenerator.forBlock['microbit_motor'] = function(block) {
    const speed = block.getFieldValue('SPEED') || '0';
    return `microbit.set_motor_speed(${speed})\n`;
  };

  // Stop Motor
  Blockly.Blocks['microbit_stop_motor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Stop Motor')
          .appendField(new Blockly.FieldImage(icons.motor, 30, 30, 'motor'));
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLORS.OUTPUT);
      this.setTooltip('Stops the motor');
    }
  };

  javascriptGenerator.forBlock['microbit_stop_motor'] = function(block) {
    return `await microbit.setMotorSpeed(0);\n`;
  };

  pythonGenerator.forBlock['microbit_stop_motor'] = function(block) {
    return `microbit.set_motor_speed(0)\n`;
  };
  
  // Servo
  Blockly.Blocks['microbit_servo'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Servo Angle')
          .appendField(new NumericField('90'), 'ANGLE')
          .appendField(new Blockly.FieldImage(icons.servo, 30, 30, 'servo'));
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLORS.OUTPUT);
      this.setTooltip('Sets the servo motor angle (0-180)');
    }
  };

  javascriptGenerator.forBlock['microbit_servo'] = function(block) {
    const angle = block.getFieldValue('ANGLE') || '90';
    return `await microbit.setServoAngle(${angle});\n`;
  };

  pythonGenerator.forBlock['microbit_servo'] = function(block) {
    const angle = block.getFieldValue('ANGLE') || '90';
    return `microbit.set_servo_angle(${angle})\n`;
  };

  // Red LED
  Blockly.Blocks['microbit_red_led'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Red Led')
          .appendField(new Blockly.FieldDropdown([['ON', '1'], ['OFF', '0']]), 'STATE')
          .appendField(new Blockly.FieldImage(icons.led, 30, 30, 'led'));
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLORS.OUTPUT);
      this.setTooltip('Turns the red LED ON or OFF');
    }
  };

  javascriptGenerator.forBlock['microbit_red_led'] = function(block) {
    const state = block.getFieldValue('STATE');
    return `await microbit.setLedState('red', ${state});\n`;
  };

  pythonGenerator.forBlock['microbit_red_led'] = function(block) {
    const state = block.getFieldValue('STATE');
    return `microbit.set_led_state('red', ${state})\n`;
  };

  // Yellow LED
  Blockly.Blocks['microbit_yellow_led'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Yellow Led')
          .appendField(new Blockly.FieldDropdown([['ON', '1'], ['OFF', '0']]), 'STATE')
          .appendField(new Blockly.FieldImage(icons.led, 30, 30, 'led'));
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLORS.OUTPUT);
      this.setTooltip('Turns the yellow LED ON or OFF');
    }
  };

  javascriptGenerator.forBlock['microbit_yellow_led'] = function(block) {
    const state = block.getFieldValue('STATE');
    return `await microbit.setLedState('yellow', ${state});\n`;
  };

  pythonGenerator.forBlock['microbit_yellow_led'] = function(block) {
    const state = block.getFieldValue('STATE');
    return `microbit.set_led_state('yellow', ${state})\n`;
  };

  // Show String
  Blockly.Blocks['microbit_show_string'] = {
    init: function() {
      this.appendValueInput('TEXT')
          .setCheck('String')
          .appendField('Show String');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLORS.OUTPUT);
      this.setTooltip('Displays text on the LED matrix');
    }
  };

  javascriptGenerator.forBlock['microbit_show_string'] = function(block, generator) {
    const text = generator.valueToCode(block, 'TEXT', Order.ATOMIC) || "''";
    return `await microbit.showString(${text});\n`;
  };

  pythonGenerator.forBlock['microbit_show_string'] = function(block, generator) {
    const text = generator.valueToCode(block, 'TEXT', PythonOrder.ATOMIC) || "''";
    return `microbit.show_string(${text})\n`;
  };

  // Forever Loop
  Blockly.Blocks['microbit_forever'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('forever')
          .appendField(new Blockly.FieldImage(icons.forever, 30, 30, 'forever'));
      this.appendStatementInput('DO')
          .setCheck(null);
      this.setPreviousStatement(true, null);
      this.setColour(COLORS.CONTROL);
    }
  };

  javascriptGenerator.forBlock['microbit_forever'] = function(block, generator) {
    const statements = generator.statementToCode(block, 'DO');
    // We wrap it in an async IIFE that loops
    return `(async () => { while(true) { ${statements} await new Promise(r => setTimeout(r, 50)); } })();\n`;
  };

  pythonGenerator.forBlock['microbit_forever'] = function(block, generator) {
    const statements = generator.statementToCode(block, 'DO');
    const code = statements || '    pass\n';
    return `while True:\n${code}`;
  };

  // Digital Output (Write)
  Blockly.Blocks['microbit_digital_write'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Digital Write Pin')
          .appendField(new Blockly.FieldDropdown([
            ['P0', 'P0'], ['P1', 'P1'], ['P2', 'P2'], ['P3', 'P3'], ['P4', 'P4'], ['P5', 'P5'], ['P6', 'P6'], ['P7', 'P7'], ['P8', 'P8'], ['P10', 'P10'], ['P16', 'P16']
          ]), 'PIN')
          .appendField('To')
          .appendField(new Blockly.FieldDropdown([['1', '1'], ['0', '0']]), 'VALUE');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLORS.OUTPUT);
    }
  };

  javascriptGenerator.forBlock['microbit_digital_write'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const value = block.getFieldValue('VALUE');
    return `microbit.digitalWrite('${pin}', ${value});\n`;
  };

  pythonGenerator.forBlock['microbit_digital_write'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const value = block.getFieldValue('VALUE');
    return `microbit.digital_write('${pin}', ${value})\n`;
  };

  // Analog Output (Write)
  Blockly.Blocks['microbit_analog_write'] = {
    init: function() {
      this.appendValueInput('VALUE')
          .setCheck('Number')
          .appendField('Analog Write Pin')
          .appendField(new Blockly.FieldDropdown([
            ['P0', 'P0'], ['P1', 'P1'], ['P2', 'P2'], ['P3', 'P3'], ['P4', 'P4'], ['P5', 'P5'], ['P6', 'P6'], ['P7', 'P7'], ['P8', 'P8'], ['P10', 'P10'], ['P16', 'P16']
          ]), 'PIN')
          .appendField('To');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLORS.OUTPUT);
    }
  };

  javascriptGenerator.forBlock['microbit_analog_write'] = function(block, generator) {
    const pin = block.getFieldValue('PIN');
    const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC) || '0';
    return `await microbit.analogWrite('${pin}', ${value});\n`;
  };

  pythonGenerator.forBlock['microbit_analog_write'] = function(block, generator) {
    const pin = block.getFieldValue('PIN');
    const value = generator.valueToCode(block, 'VALUE', PythonOrder.ATOMIC) || '0';
    return `microbit.analog_write('${pin}', ${value})\n`;
  };

  // Analog Read
  Blockly.Blocks['microbit_analog_read'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('analog read pin')
          .appendField(new Blockly.FieldDropdown([
            ['P1', 'P1'], ['P3', 'P3'], ['P10', 'P10']
          ]), 'PIN');
      this.setOutput(true, 'Number');
      this.setColour(COLORS.SENSOR);
    }
  };

  javascriptGenerator.forBlock['microbit_analog_read'] = function(block, generator) {
    const pin = block.getFieldValue('PIN');
    return [`microbit.analogRead('${pin}')`, Order.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_analog_read'] = function(block, generator) {
    const pin = block.getFieldValue('PIN');
    return [`microbit.analog_read('${pin}')`, PythonOrder.FUNCTION_CALL];
  };

  // Temperature
  Blockly.Blocks['microbit_temperature'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Temperature')
          .appendField(new Blockly.FieldImage(icons.tempSensor, 30, 30, 'temperature'));
      this.setOutput(true, 'Number');
      this.setColour(COLORS.SENSOR);
    }
  };
  javascriptGenerator.forBlock['microbit_temperature'] = function() {
    return [`microbit.temperature()`, Order.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_temperature'] = function() {
    return [`microbit.temperature()`, PythonOrder.FUNCTION_CALL];
  };

  // Sound Sensor (Noise level)
  Blockly.Blocks['microbit_sound_sensor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Noise level')
          .appendField(new Blockly.FieldImage(icons.soundSensor, 30, 30, 'sound_sensor'));
      this.setOutput(true, 'Number');
      this.setColour(COLORS.SENSOR);
    }
  };
  javascriptGenerator.forBlock['microbit_sound_sensor'] = function() {
    return [`microbit.soundLevel()`, Order.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_sound_sensor'] = function() {
    return [`microbit.sound_level()`, PythonOrder.FUNCTION_CALL];
  };

  // Light Level
  Blockly.Blocks['microbit_light_level'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('light level');
      this.setOutput(true, 'Number');
      this.setColour(COLORS.SENSOR);
    }
  };
  javascriptGenerator.forBlock['microbit_light_level'] = function() {
    return [`microbit.lightLevel()`, Order.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_light_level'] = function() {
    return [`microbit.light_level()`, PythonOrder.FUNCTION_CALL];
  };

  // Acceleration
  Blockly.Blocks['microbit_acceleration'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('acceleration')
          .appendField(new Blockly.FieldDropdown([['X', 'x'], ['Y', 'y'], ['Z', 'z'], ['strength', 'strength']]), 'DIMENSION');
      this.setOutput(true, 'Number');
      this.setColour(COLORS.SENSOR);
    }
  };
  javascriptGenerator.forBlock['microbit_acceleration'] = function(block) {
    const dim = block.getFieldValue('DIMENSION');
    return [`microbit.acceleration('${dim}')`, Order.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_acceleration'] = function(block) {
    const dim = block.getFieldValue('DIMENSION');
    return [`microbit.acceleration('${dim}')`, PythonOrder.FUNCTION_CALL];
  };

  // Moisture Sensor
  Blockly.Blocks['microbit_moisture_sensor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Moisture')
          .appendField(new Blockly.FieldImage(icons.moisture, 30, 30, 'moisture'));
      this.setOutput(true, 'Number');
      this.setColour(COLORS.SENSOR);
    }
  };
  javascriptGenerator.forBlock['microbit_moisture_sensor'] = function() {
    return [`microbit.analogRead('P0')`, Order.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_moisture_sensor'] = function() {
    return [`microbit.analog_read('P0')`, PythonOrder.FUNCTION_CALL];
  };

  // Ultrasonic Sensor
  Blockly.Blocks['microbit_ultrasonic_sensor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Ultrasonic')
          .appendField(new Blockly.FieldImage(icons.ultrasonic, 30, 30, 'ultrasonic'));
      this.setOutput(true, 'Number');
      this.setColour(COLORS.SENSOR);
    }
  };
  javascriptGenerator.forBlock['microbit_ultrasonic_sensor'] = function() {
    return [`microbit.ultrasonicRead('P0', 'P8')`, Order.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_ultrasonic_sensor'] = function() {
    return [`microbit.ultrasonic_read('P0', 'P8')`, PythonOrder.FUNCTION_CALL];
  };

  // Potentiometer
  Blockly.Blocks['microbit_potentiometer'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Potentiometer')
          .appendField(new Blockly.FieldImage(icons.potentiometer, 30, 30, 'potentiometer'));
      this.setOutput(true, 'Number');
      this.setColour(COLORS.SENSOR);
    }
  };
  javascriptGenerator.forBlock['microbit_potentiometer'] = function() {
    return [`microbit.analogRead('P3')`, Order.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_potentiometer'] = function() {
    return [`microbit.analog_read('P3')`, PythonOrder.FUNCTION_CALL];
  };

  // Light Sensor (External)
  Blockly.Blocks['microbit_light_sensor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Light Sensor(LDR)')
          .appendField(new Blockly.FieldImage(icons.ldr, 30, 30, 'light'));
      this.setOutput(true, 'Number');
      this.setColour(COLORS.SENSOR);
    }
  };
  javascriptGenerator.forBlock['microbit_light_sensor'] = function() {
    return [`microbit.analogRead('P1')`, Order.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_light_sensor'] = function() {
    return [`microbit.analog_read('P1')`, PythonOrder.FUNCTION_CALL];
  };

  // Color Sensor
  Blockly.Blocks['microbit_color_sensor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Color Sensor (RGB)')
          .appendField(new Blockly.FieldImage(icons.colorSensor, 30, 30, 'color_sensor'));
      this.setOutput(true, 'Number');
      this.setColour(COLORS.SENSOR);
    }
  };
  javascriptGenerator.forBlock['microbit_color_sensor'] = function() {
    return [`microbit.readColorSensor('P3')`, Order.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_color_sensor'] = function() {
    return [`microbit.read_color_sensor('P3')`, PythonOrder.FUNCTION_CALL];
  };

  // PIR Motion Sensor
  Blockly.Blocks['microbit_pir_sensor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('PIR Motion Sensor')
          .appendField(new Blockly.FieldImage(icons.pirSensor, 30, 30, 'pir_sensor'));
      this.setOutput(true, 'Number');
      this.setColour(COLORS.SENSOR);
    }
  };
  javascriptGenerator.forBlock['microbit_pir_sensor'] = function() {
    return [`microbit.readPIRSensor('P2')`, Order.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_pir_sensor'] = function() {
    return [`microbit.read_pir_sensor('P2')`, PythonOrder.FUNCTION_CALL];
  };

  // Push Button
  Blockly.Blocks['microbit_push_button'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Push Button')
          .appendField(new Blockly.FieldImage(icons.push, 30, 30, 'push'));
      this.setOutput(true, 'Number');
      this.setColour(COLORS.SENSOR);
    }
  };

  javascriptGenerator.forBlock['microbit_push_button'] = function() {
    return [`(microbit.digitalRead('P8') === 1 ? 1 : 0)`, Order.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['microbit_push_button'] = function() {
    return [`(1 if microbit.digital_read('P8') == 1 else 0)`, PythonOrder.FUNCTION_CALL];
  };

  // On Button Pressed
  Blockly.Blocks['microbit_on_button'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('on button')
          .appendField(new Blockly.FieldDropdown([['A', 'A'], ['B', 'B']]), 'BUTTON')
          .appendField('pressed');
      this.appendStatementInput('DO')
          .setCheck(null);
      this.setColour(COLORS.CONTROL);
    }
  };

  javascriptGenerator.forBlock['microbit_on_button'] = function(block, generator) {
    const button = block.getFieldValue('BUTTON');
    const statements = generator.statementToCode(block, 'DO');
    return `microbit.onButtonPressed('${button}', async () => {\n${statements}});\n`;
  };

  pythonGenerator.forBlock['microbit_on_button'] = function(block, generator) {
    const button = block.getFieldValue('BUTTON');
    const statements = generator.statementToCode(block, 'DO');
    const code = statements || '    pass\n';
    return `def on_button_${button.toLowerCase()}_pressed():\n${code}`;
  };

  // Wait
  Blockly.Blocks['microbit_wait'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Wait')
          .appendField(new NumericField('1'), 'SEC')
          .appendField('Sec')
          .appendField(new Blockly.FieldImage(icons.wait, 30, 30, 'wait'));
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLORS.CONTROL);
    }
  };

  javascriptGenerator.forBlock['microbit_wait'] = function(block) {
    const sec = block.getFieldValue('SEC') || '1';
    const ms = Number(sec) * 1000;
    return `await new Promise(r => setTimeout(r, ${ms}));\n`;
  };

  pythonGenerator.forBlock['microbit_wait'] = function(block) {
    const sec = block.getFieldValue('SEC') || '1';
    return `time.sleep(${sec})\n`;
  };

  // Repeat (Customized)
  Blockly.Blocks['custom_repeat'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('repeat')
          .appendField(new NumericField('10'), 'TIMES')
          .appendField(new Blockly.FieldImage(icons.repeat, 30, 30, 'repeat'));
      this.appendStatementInput('DO')
          .setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLORS.CONTROL);
    }
  };

  javascriptGenerator.forBlock['custom_repeat'] = function(block, generator) {
    const times = block.getFieldValue('TIMES') || '10';
    const statements = generator.statementToCode(block, 'DO');
    return `for (let i = 0; i < ${times}; i++) {\n  await new Promise(r => setTimeout(r, 10));\n${statements}}\n`;
  };

  javascriptGenerator.forBlock['controls_whileUntil'] = function(block, generator) {
    const mode = block.getFieldValue('MODE');
    const order = mode === 'UNTIL' ? Order.LOGICAL_NOT : Order.NONE;
    let argument0 = generator.valueToCode(block, 'BOOL', order) || 'false';
    const statements = generator.statementToCode(block, 'DO');
    
    if (mode === 'UNTIL') {
      argument0 = '!' + argument0;
    }
    
    return `while (${argument0}) {\n  await new Promise(r => setTimeout(r, 10));\n${statements}}\n`;
  };

  pythonGenerator.forBlock['custom_repeat'] = function(block, generator) {
    const times = block.getFieldValue('TIMES') || '10';
    const statements = generator.statementToCode(block, 'DO');
    const code = statements || '    pass\n';
    return `for i in range(${times}):\n${code}`;
  };

  // Math Number (Customized)
  Blockly.Blocks['custom_math_number'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new NumericField('0'), 'NUM');
      this.setOutput(true, 'Number');
      this.setColour(COLORS.MATH);
    }
  };
  javascriptGenerator.forBlock['custom_math_number'] = function(block) {
    return [block.getFieldValue('NUM'), Order.ATOMIC];
  };

  pythonGenerator.forBlock['custom_math_number'] = function(block) {
    return [block.getFieldValue('NUM'), PythonOrder.ATOMIC];
  };

  // Math Round (Customized)
  Blockly.Blocks['custom_math_round'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('round')
          .appendField(new NumericField('0'), 'NUM');
      this.setOutput(true, 'Number');
      this.setColour(COLORS.MATH);
    }
  };
  javascriptGenerator.forBlock['custom_math_round'] = function(block) {
    const num = block.getFieldValue('NUM') || '0';
    return [`Math.round(${num})`, Order.FUNCTION_CALL];
  };

  pythonGenerator.forBlock['custom_math_round'] = function(block) {
    const num = block.getFieldValue('NUM') || '0';
    return [`round(${num})`, PythonOrder.FUNCTION_CALL];
  };

  // Green Flag
  Blockly.Blocks['microbit_green_flag'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldImage('data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" stroke="green" stroke-width="2"><path d="M6 2v20M6 4h12l-4 5 4 5H6"/></svg>'), 30, 30, 'green flag'));
      this.setNextStatement(true, null);
      this.setColour(COLORS.CONTROL);
    }
  };
  javascriptGenerator.forBlock['microbit_green_flag'] = function() {
    return '';
  };

  pythonGenerator.forBlock['microbit_green_flag'] = function() {
    return '';
  };

  // Play Tone
  Blockly.Blocks['microbit_play_tone'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Play Tone')
          .appendField(new Blockly.FieldDropdown([
            ['Middle C', '262'],
            ['Middle D', '294'],
            ['Middle E', '330'],
            ['Middle F', '349'],
            ['Middle G', '392'],
            ['Middle A', '440'],
            ['Middle B', '494'],
            ['High C', '523']
          ]), 'NOTE')
          .appendField('For (ms)')
          .appendField(new NumericField('500'), 'DURATION');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLORS.OUTPUT);
      this.setTooltip('Plays a musical tone for a set duration');
    }
  };

  javascriptGenerator.forBlock['microbit_play_tone'] = function(block) {
    const frequency = block.getFieldValue('NOTE');
    const duration = block.getFieldValue('DURATION');
    return `await microbit.playTone(${frequency}, ${duration});\n`;
  };

  pythonGenerator.forBlock['microbit_play_tone'] = function(block) {
    const frequency = block.getFieldValue('NOTE');
    const duration = block.getFieldValue('DURATION');
    return `microbit.play_tone(${frequency}, ${duration})\n`;
  };
};


export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Control',
      categorystyle: 'logic_category',
      cssConfig: { row: 'cat-bg-control', icon: 'cat-icon-control', container: 'cat-control' },
      contents: [
        { kind: 'block', type: 'microbit_wait' },
        { kind: 'block', type: 'microbit_forever' },
        { kind: 'block', type: 'microbit_green_flag' },
        { kind: 'block', type: 'custom_repeat' },
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'controls_whileUntil' },
      ],
    },
    {
      kind: 'category',
      name: 'Sensors',
      categorystyle: 'sensor_category',
      cssConfig: { row: 'cat-bg-sensor', icon: 'cat-icon-sensor', container: 'cat-sensor' },
      contents: [
        { kind: 'block', type: 'microbit_analog_read' },
        { kind: 'block', type: 'microbit_temperature' },
        { kind: 'block', type: 'microbit_sound_sensor' },
        { kind: 'block', type: 'microbit_moisture_sensor' },
        { kind: 'block', type: 'microbit_ultrasonic_sensor' },
        { kind: 'block', type: 'microbit_potentiometer' },
        { kind: 'block', type: 'microbit_light_sensor' },
        { kind: 'block', type: 'microbit_color_sensor' },
        { kind: 'block', type: 'microbit_pir_sensor' },
        { kind: 'block', type: 'microbit_push_button' },
      ],
    },
    {
      kind: 'category',
      name: 'Output',
      categorystyle: 'output_category',
      cssConfig: { row: 'cat-bg-output', icon: 'cat-icon-output', container: 'cat-output' },
      contents: [
        { kind: 'block', type: 'microbit_show_string' },
        { kind: 'block', type: 'microbit_motor' },
        { kind: 'block', type: 'microbit_stop_motor' },
        { kind: 'block', type: 'microbit_servo' },
        { kind: 'block', type: 'microbit_red_led' },
        { kind: 'block', type: 'microbit_yellow_led' },
        { kind: 'block', type: 'microbit_buzzer' },
        { kind: 'block', type: 'microbit_digital_write' },
        { kind: 'block', type: 'microbit_analog_write' },
      ],
    },
    {
      kind: 'category',
      name: 'Math',
      categorystyle: 'math_category',
      cssConfig: { row: 'cat-bg-math', icon: 'cat-icon-math', container: 'cat-math' },
      contents: [
        { kind: 'block', type: 'custom_math_number' },
        { kind: 'block', type: 'math_arithmetic' },
        { kind: 'block', type: 'custom_math_round' },
      ],
    },
    {
      kind: 'category',
      name: 'Logic',
      categorystyle: 'logic_category',
      cssConfig: { row: 'cat-bg-logic', icon: 'cat-icon-logic', container: 'cat-logic' },
      contents: [
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
      ],
    },
    {
      kind: 'category',
      name: 'Variables',
      custom: 'VARIABLE',
      categorystyle: 'variable_category',
      cssConfig: { row: 'cat-bg-variables', icon: 'cat-icon-variables', container: 'cat-variables' },
    },
  ],
};
