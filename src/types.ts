export type ComponentType = 
  | 'motor' 
  | 'light_sensor' 
  | 'color_sensor'
  | 'button' 
  | 'switch'
  | 'temp_sensor' 
  | 'pir_sensor' 
  | 'servo'
  | 'stepper_motor' 
  | 'potentiometer'
  | 'led'
  | 'oled'
  | 'sonar'
  | 'humidity_sensor'
  | 'lcd_display'
  | 'ultrasonic_sensor'
  | 'red_led'
  | 'yellow_led'
  | 'seven_segment'
  | 'buzzer'
  | 'ultrasonic';

export interface ComponentInstance {
  id: string;
  type: ComponentType;
  name: string;
  sku?: string;
  port: string;
  value: number; // For sensors (input) or actuators (output)
  x: number; // Grid positions for the board layout
  y: number;
}

export interface BoardState {
  leds: boolean[][]; // 5x5 matrix
  components: ComponentInstance[];
}
