import { useState, useCallback, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, RefreshCcw, Info, Maximize2, Minimize2, Save, FolderOpen, X, Code, Trophy, Sparkles, Lightbulb, CheckCircle2, ChevronRight, ChevronLeft, Award } from 'lucide-react';
import { INITIAL_COMPONENTS } from './constants';
import { ComponentInstance, ComponentType } from './types';
import Board from './components/Board';
import BlocklyEditor, { BlocklyEditorRef } from './components/BlocklyEditor';

export interface LearningTask {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  emoji: string;
  objective: string;
  hints: string[];
  testCode: (jsCode: string) => { success: boolean; feedback: string };
}

const LEARNING_TASKS: LearningTask[] = [
  {
    id: 1,
    title: '🚨 חגיגת אורות אדומים (משימה 1)',
    description: 'בואו נגרום לנורה האדומה להבהב כמו צ\'קלקה של רכב כיבוי אש או פנס קסמים!',
    difficulty: 'קל ומתוק 🌟',
    emoji: '🚨',
    objective: 'לגרום לנורה האדומה להידלק לשנייה אחת, לכבות לשנייה אחת, וחוזר חלילה - לנצח!',
    hints: [
      'קודם כל, ניקח את לבנת "לעולמים" (forever) מהספרייה השמחה שלנו.',
      'נכניס לתוכה את הלבנה "הפעל לד אדום" (Red Led ON) כדי להעיר אותה.',
      'נבקש מהמיקרוביט לחכות קצת בעזרת לבנת המתנה (Wait 1 Sec). שהדברים לא ירוצו מהר מדי!',
      'עכשיו נכבה את הלד בעזרת "כבה לד אדום" (Red Led OFF).',
      'אל תשכחו: נוסיף עוד המתנה קטנה של שנייה בסוף כדי שהנורה תספיק "לנוח" לפני שהיא נדלקת שוב!'
    ],
    testCode: (jsCode: string) => {
      const cleaned = jsCode.replace(/\s+/g, '');
      const hasRedOn = cleaned.includes("setLedState('red',1)") || cleaned.includes('setLedState("red",1)');
      const hasRedOff = cleaned.includes("setLedState('red',0)") || cleaned.includes('setLedState("red",0)');
      const hasWait = cleaned.includes('setTimeout') || cleaned.includes('Promise');
      
      if (!jsCode || jsCode.trim() === '') {
        return { success: false, feedback: 'סביבת העבודה ריקה! גררו לבנים כדי לבנות את הקוד.' };
      }
      if (!hasRedOn) {
         return { success: false, feedback: 'אויש! שכחתם להדליק את הלד האדום (Red Led ON)!' };
      }
      if (!hasRedOff) {
         return { success: false, feedback: 'הלד דולק יפה, אבל שכחנו לכבות אותו (Red Led OFF) כדי שהוא יוכל להבהב!' };
      }
      if (!hasWait) {
         return { success: false, feedback: 'וואו, זה רץ מהר מדי! הוסיפו לבנות המתנה (Wait 1 Sec) כדי שהעיניים יספיקו לראות את האור נדלק ונכבה.' };
      }
      
      const waitCount = (jsCode.match(/setTimeout|Promise/g) || []).length;
      if (waitCount < 2) {
         return { success: false, feedback: 'טיפ של אלופים: הוסיפו שתי לבנות המתנה (אחת אחרי ההדלקה ואחת אחרי הכיבוי) כדי לקבל קצב הבהוב מושלם!' };
      }

      return { success: true, feedback: 'כל הכבוד, אתם פשוט אלופי קוד! הלד האדום מהבהב בקצב משגע! 🎉🎈' };
    }
  },
  {
    id: 2,
    title: '🚥 רמזור בלגן (משימה 2)',
    description: 'המשטרה צריכה את עזרתכם! בואו נתקן את הרמזור ונלמד את נורות הלד האדומה והצהובה לרקוד ביחד!',
    difficulty: 'בלש קוד 🕵️‍♂️',
    emoji: '🚥',
    objective: 'ליצור משחק אורות: כשהאדום דולק - הצהוב כבוי, וכשהאדום נכבה - הצהוב נדלק במהירות!',
    hints: [
      'נתחיל עם הלבנה הסופר-חזקה "לעולמים" (forever) שתשמור על הקצב המדויק.',
      'שלב ראשון: נדליק את האדום (Red Led ON) ונוודא שהצהוב כבוי (Yellow Led OFF).',
      'ניתן להם לחכות שנייה אחת (Wait 1 Sec).',
      'שלב שני: נהפוך את התפקידים! נכבה את האדום (Red Led OFF) ונדליק את הצהוב (Yellow Led ON).',
      'נחכה עוד שנייה שלמה (Wait 1 Sec) בסוף כדי שהרמזור שלנו יעבוד בקצב קבוע של החלפות אש.'
    ],
    testCode: (jsCode: string) => {
      const cleaned = jsCode.replace(/\s+/g, '');
      const hasRedOn = cleaned.includes("setLedState('red',1)") || cleaned.includes('setLedState("red",1)');
      const hasRedOff = cleaned.includes("setLedState('red',0)") || cleaned.includes('setLedState("red",0)');
      const hasYellowOn = cleaned.includes("setLedState('yellow',1)") || cleaned.includes('setLedState("yellow",1)');
      const hasYellowOff = cleaned.includes("setLedState('yellow',0)") || cleaned.includes('setLedState("yellow",0)');
      const hasWait = cleaned.includes('setTimeout') || cleaned.includes('Promise');
      
      if (!jsCode || jsCode.trim() === '') {
        return { success: false, feedback: 'סביבת העבודה ריקה! גררו לבנים כדי לבנות את הקוד.' };
      }
      if (!hasRedOn || !hasRedOff) {
         return { success: false, feedback: 'הלד האדום קצת מבולבל! ודאו שאתם גם מדליקים (ON) וגם מכבים (OFF) אותו.' };
      }
      if (!hasYellowOn || !hasYellowOff) {
         return { success: false, feedback: 'הלד הצהוב רוצה להשתתף בחגיגה! ודאו שאתם גם מדליקים (ON) וגם מכבים (OFF) אותו בקוד.' };
      }
      if (!hasWait) {
         return { success: false, feedback: 'האורות מתחלפים כל כך מהר שהם נראים כמו אור אחד! הוסיפו לבנות המתנה (Wait 1 Sec) של שנייה אחרי כל צעד.' };
      }
      
      const waitCount = (jsCode.match(/setTimeout|Promise/g) || []).length;
      if (waitCount < 2) {
         return { success: false, feedback: 'כמעט שם! הוסיפו לפחות שתי לבנות המתנה (אחת לכל מצב) כדי שהריקוד של הרמזור יהיה ברור ויפעל בקצב נכון.' };
      }

      return { success: true, feedback: 'וואו, מדהים! תיקנתם את הרמזור והצלתם את הצומת! האורות רוקדים בצורה מושלמת כל הכבוד! 🚥🏆⚡' };
    }
  },
  {
    id: 3,
    title: '🔵 לחצן הקסם הכחול (משימה 3)',
    description: 'קליק קלאק! בואו נתחבר לכפתור הכחול הפיזי שעל הלוח ונרים מפסק תאורה קסום!',
    difficulty: 'קל ומרתק ✨',
    emoji: '🔵',
    objective: 'ברגע שנניח את האצבע ונלחץ על הכפתור הכחול (Push Button), האור הצהוב החם יידלק מיד!',
    hints: [
      'נשתמש בלולאת "לעולמים" (forever) כדי שהמיקרוביט יקשיב לאצבע שלנו כל הזמן.',
      'נגרור לבנת "אם" (if) מיוחדת מקטגוריית "לוגיקה" - היא יודעת לשאול שאלות חשובות!',
      'נבדוק האם הלבנה "Push Button" (מקטגוריית החיישנים) שווה בדיוק ל-1 (שזה אומר שהכפתור לחוץ!).',
      'אם התנאי מתקיים והכפתור באמת לחוץ - נפעיל את הלד הצהוב (Yellow Led ON) למעלה שמחכה לנו!'
    ],
    testCode: (jsCode: string) => {
      const cleaned = jsCode.replace(/\s+/g, '');
      const hasPushButton = cleaned.includes("digitalRead('P8')") || cleaned.includes('digitalRead("P8")');
      const hasYellowOn = cleaned.includes("setLedState('yellow',1)") || cleaned.includes('setLedState("yellow",1)');
      const hasIf = cleaned.includes('if(') || cleaned.includes('if ');
      const hasLoop = cleaned.includes('while(') || cleaned.includes('while ') || cleaned.includes('setTimeout') || cleaned.includes('Promise');
      
      if (!jsCode || jsCode.trim() === '') {
        return { success: false, feedback: 'סביבת העבודה ריקה! גררו לבנים כדי לבנות את הקוד.' };
      }
      if (!hasPushButton) {
         return { success: false, feedback: 'אופס! שכחתם להקשיב ללחצן הכחול (Push Button) שלנו. גררו אותו לתוך קוד הבדיקה.' };
      }
      if (!hasYellowOn) {
         return { success: false, feedback: 'הכפתור לחוץ אבל נורת הלד הצהובה לא נדלקת! ודאו שיש לכם לבנת Yellow Led ON בתוך התנאי.' };
      }
      if (!hasIf) {
         return { success: false, feedback: 'צריך לשאול שאלה: האם הכפתור לחוץ? השתמשו בלבנת "אם" (if) מקטגוריית לוגיקה!' };
      }
      if (!hasLoop) {
         return { success: false, feedback: 'כדי שהמיקרוביט יוכל לגלות את הלחיצה שלכם בכל פעם שתלחצו, עטפו את הכל בתוך לולאת forever!' };
      }
      
      return { success: true, feedback: 'יששש! הצלחה מטורפת! בניתם מפסק חכם שמדליק אור צהוב חם ברגע שלוחצים על הלחצן הכחול! 💙🎈🌟' };
    }
  },
  {
    id: 4,
    title: '🎚️ עמעם האורות המדליק (משימה 4)',
    description: 'כמו באולם קולנוע! הפכו את הבורר הסיבובי (הפוטנציומטר) לעמעם חכם שקובע בדיוק כמה חזק הלד יאיר!',
    difficulty: 'גיבור קוד על 👑',
    emoji: '🎚️',
    objective: 'ליצור קוד שלוקח את הסיבוב של הבורר (0 עד 1023) ושולח אותו ישירות לעוצמת הלד כדי להחליש או לחזק את האור בהתאמה!',
    hints: [
      'נזדקק ללבנת "לעולמים" (forever) כדי לעדכן את עוצמת האור בכל פעם שמסובבים את החוגה.',
      'נשתמש בלבנה המעולה "Analog Write Pin" (מקטגוריית Output) - היא יכולה לשלוח עוצמות רכות ולא רק הדלקה/כיבוי! נכוון את הפין שלה ללד שלנו (P4 לאדום או P5 לצהוב).',
      'למקום של הערך (To), נחבר את הלבנה העגולה "Potentiometer" (חיישן P3) מקטגוריית החיישנים.',
      'תפעילו את הסימולטור, סובבו את החוגה השמאלית בחצי עיגול וצפו בקסם: האור נחלש ומתחזק בהתאם ליד שלכם!'
    ],
    testCode: (jsCode: string) => {
      const cleaned = jsCode.replace(/\s+/g, '');
      const hasAnalogWrite = cleaned.includes("analogWrite('P4'") || cleaned.includes('analogWrite("P4"') || cleaned.includes("analogWrite('P5'") || cleaned.includes('analogWrite("P5"');
      const hasPot = cleaned.includes("analogRead('P3'") || cleaned.includes('analogRead("P3"');
      const hasLoop = cleaned.includes('while(') || cleaned.includes('while ') || cleaned.includes('setTimeout') || cleaned.includes('Promise');
      
      if (!jsCode || jsCode.trim() === '') {
        return { success: false, feedback: 'סביבת העבודה ריקה! גררו לבנים כדי לבנות את הקוד.' };
      }
      if (!hasAnalogWrite) {
         return { success: false, feedback: 'שכחתם להשתמש בלבנת כתיבה אנלוגית (Analog Write Pin) לפין P4 או P5 (הלדים), שמאפשרת עוצמות אור משתנות!' };
      }
      if (!hasPot) {
         return { success: false, feedback: 'שכחתם לקרוא את המצב של ה-Potentiometer (פין P3) כדי לשמוע כמה סובבנו את החוגה!' };
      }
      if (!hasLoop) {
         return { success: false, feedback: 'כדי שהעמעום יעבוד כל הזמן בכיף, ודאו שכל הלבנות שלכם נמצאות בתוך המלבן של forever!' };
      }
      
      return { success: true, feedback: 'פשוט וואו! לקחתם שליטה מלאה על עוצמת האור ובניתם עמעם תאורה מושלם כמו בבית חכם אמיתי! גאים בכם! 🏆🌟😎' };
    }
  }
];

export default function App() {
  const [components, setComponents] = useState<ComponentInstance[]>(INITIAL_COMPONENTS);
  const [leds, setLeds] = useState<boolean[][]>(Array(5).fill(null).map(() => Array(5).fill(false)));
  const [hoveredSensorId, setHoveredSensorId] = useState<string | null>(null);
  const hoveredSensor = components.find(c => c.id === hoveredSensorId) || null;
  const [isRunning, setIsRunning] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pythonCode, setPythonCode] = useState('');
  const [isPythonModalOpen, setIsPythonModalOpen] = useState(false);

  // States for interactive learning tasks
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [taskFeedback, setTaskFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleShowPythonCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getPythonCode();
      setPythonCode(code || '# אין לבנים בסביבת העבודה.\n# גרור לבנים כדי ליצור קוד!');
      setIsPythonModalOpen(true);
    }
  };

  const handleCopyPythonCode = () => {
    navigator.clipboard.writeText(pythonCode);
    showToast('הקוד הועתק ללוח הגזירים בהצלחה!', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleSaveProject = () => {
    if (!editorRef.current) return;
    try {
      const blocklyState = editorRef.current.getWorkspaceState();
      const projectData = {
        version: 1,
        components: components,
        blockly: blocklyState,
      };
      
      const jsonStr = JSON.stringify(projectData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      showToast('הפרויקט נשמר למחשב בהצלחה!', 'success');
    } catch (err) {
      console.error('Error saving project:', err);
      showToast('שגיאה בשמירת הפרויקט', 'error');
    }
  };

  const handleLoadProjectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonStr = event.target?.result as string;
        const projectData = JSON.parse(jsonStr);

        if (projectData.components && Array.isArray(projectData.components)) {
          setComponents(projectData.components);
        }
        if (projectData.blockly && editorRef.current) {
          editorRef.current.setWorkspaceState(projectData.blockly);
        }
        showToast('הפרויקט נטען בהצלחה!', 'success');
      } catch (err) {
        console.error('Error loading project file:', err);
        showToast('שגיאה בטעינת הקובץ. ודא שהקובץ תקין.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };
  
  const componentsRef = useRef<ComponentInstance[]>(components);
  useEffect(() => {
    componentsRef.current = components;
  }, [components]);
  
  const editorRef = useRef<BlocklyEditorRef>(null);
  const runState = useRef<{ isRunning: boolean }>({ isRunning: false });

  const handleValueChange = (id: string, value: number) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, value } : c));
  };

  const handleSensorHover = (instance: ComponentInstance | null) => {
    setHoveredSensorId(instance ? instance.id : null);
  };

  const handleSwapComponent = (id: string, newType: ComponentType) => {
    // Determine the name and default starting/range values for the swapped type
    let name = '';
    let value = 0;
    
    switch (newType) {
      case 'humidity_sensor':
        name = 'Humidity Sensor';
        value = 45;
        break;
      case 'light_sensor':
        name = 'Light Sensor';
        value = 250;
        break;
      case 'temp_sensor':
        name = 'Temperature Sensor';
        value = 25;
        break;
      case 'potentiometer':
        name = 'Rotary Dial';
        value = 512;
        break;
      case 'button':
        name = 'Push Button';
        value = 0;
        break;
      case 'switch':
        name = 'Switch Toggle';
        value = 0;
        break;
      case 'ultrasonic_sensor':
        name = 'Distance Sensor';
        value = 120;
        break;
      case 'pir_sensor':
        name = 'PIR Motion Sensor';
        value = 0;
        break;
      case 'red_led':
        name = 'Alert LED';
        value = 0;
        break;
      case 'yellow_led':
        name = 'Status LED';
        value = 0;
        break;
      case 'motor':
        name = 'DC Motor Fan';
        value = 0;
        break;
      case 'servo':
        name = 'Micro Servo';
        value = 90;
        break;
      case 'stepper_motor':
        name = 'Stepper Motor';
        value = 0;
        break;
      case 'buzzer':
        name = 'Main Buzzer';
        value = 0;
        break;
      default:
        name = 'Component';
        value = 0;
    }

    setComponents(prev => prev.map(c => c.id === id ? { ...c, type: newType, name, value } : c));
  };

  const stopSimulation = useCallback(() => {
    setIsRunning(false);
    runState.current.isRunning = false;
    // Clear highlight
    editorRef.current?.highlightBlock(null);
    // Clear all intervals/timeouts from eval
    const highestId = window.setTimeout(() => {});
    for (let i = 0; i < highestId; i++) {
      window.clearTimeout(i);
      window.clearInterval(i);
    }
  }, []);

  const runSimulation = useCallback(async () => {
    stopSimulation();
    setIsRunning(true);
    runState.current.isRunning = true;

    // Define the hardware API for the sandboxed simulation
    const microbit = {
      showString: async (text: string) => {
        console.log("Showing string:", text);
        for (const char of String(text)) {
          if (!runState.current.isRunning) break;
          // Simple visualization: light up all LEDs briefly
          setLeds(prev => prev.map(row => row.map(() => true)));
          await new Promise(r => setTimeout(r, 200));
          setLeds(prev => prev.map(row => row.map(() => false)));
          await new Promise(r => setTimeout(r, 100));
        }
      },
      digitalWrite: (port: string, value: number) => {
        setComponents(prev => prev.map(c => c.port === port ? { ...c, value: Number(value) } : c));
      },
      analogWrite: (port: string, value: number) => {
        // We write analog values (0-1023) to outputs
        setComponents(prev => prev.map(c => c.port === port ? { ...c, value: Number(value) } : c));
      },
      analogRead: (port: string) => {
        const comp = componentsRef.current.find(c => c.port === port);
        return comp ? comp.value : 0;
      },
      digitalRead: (port: string) => {
        const comp = componentsRef.current.find(c => c.port === port);
        return comp ? comp.value : 0;
      },
      ultrasonicRead: (triggerPort: string, echoPort: string) => {
        const comp = componentsRef.current.find(c => c.type === 'ultrasonic_sensor');
        return comp ? comp.value : 0;
      },
      temperature: () => {
        const comp = componentsRef.current.find(c => c.type === 'temp_sensor');
        return comp ? comp.value : 25; // Default temp
      },
      lightLevel: () => {
        const comp = componentsRef.current.find(c => c.type === 'light_sensor');
        return comp ? comp.value : 0;
      },
      acceleration: (dim: string) => {
        return 0; // Not currently simulated
      },
      onButtonPressed: (button: string, callback: Function) => {
        console.log(`Subscribed to button ${button}`);
      },
      highlightBlock: (id: string | null) => {
        editorRef.current?.highlightBlock(id);
      },
      playTone: async (frequency: number, duration: number) => {
        console.log(`Playing tone: ${frequency}Hz for ${duration}ms`);
        
        // Use Web Audio API to play a real sound
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const context = new AudioContextClass();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.type = 'square'; // Buzzier sound
            oscillator.frequency.setValueAtTime(frequency, context.currentTime);
            
            gainNode.gain.setValueAtTime(0.1, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration / 1000);

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            oscillator.start();
            oscillator.stop(context.currentTime + duration / 1000);
            
            // Clean up context after sound finishes
            setTimeout(() => {
              context.close();
            }, duration + 100);
          }
        } catch (e) {
          console.error("Audio Context Error:", e);
        }

        // Visual indicator on the buzzer
        setComponents(prev => prev.map(c => c.type === 'buzzer' ? { ...c, value: 1 } : c));
        await new Promise(r => setTimeout(r, duration));
        setComponents(prev => prev.map(c => c.type === 'buzzer' ? { ...c, value: 0 } : c));
      },
      setMotorSpeed: async (speed: number) => {
        console.log(`Setting motor speed to: ${speed}`);
        setComponents(prev => prev.map(c => c.type === 'motor' ? { ...c, value: speed } : c));
      },
      setServoAngle: async (angle: number) => {
        console.log(`Setting servo angle to: ${angle}`);
        setComponents(prev => prev.map(c => c.type === 'servo' ? { ...c, value: angle } : c));
      },
      setLedState: async (color: 'red' | 'yellow', state: number) => {
        console.log(`Setting ${color} LED state to: ${state}`);
        const type = color === 'red' ? 'red_led' : 'yellow_led';
        setComponents(prev => prev.map(c => c.type === type ? { ...c, value: state } : c));
      }
    };

    try {
      // Create a safely wrapped async environment
      const asyncCode = `(async () => { 
        try {
          const highlightBlock = (id) => {
            microbit.highlightBlock(id);
          };
          ${editorRef.current?.getCodeForSimulation()}
        } catch (e) {
          console.error('Execution error:', e);
        }
      })()`;
      
      const fn = new Function('microbit', 'console', asyncCode);
      fn(microbit, console);
    } catch (err) {
      console.error("Simulation Start Error:", err);
      stopSimulation();
    }
  }, [currentCode, components, stopSimulation]);

  const handleButtonPress = (button: 'A' | 'B') => {
    console.log(`Button ${button} pressed`);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f3f7ff] text-slate-800 font-sans">
      <header className="h-20 bg-white border-b-4 border-[#e2e8f0] flex items-center justify-between px-8 shrink-0 z-30 shadow-sm relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-[#4ade80] rounded-2xl flex items-center justify-center text-white shadow-[0_4px_0_#16a34a] border-2 border-white">
               <RefreshCcw className="w-7 h-7" />
             </div>
             <div>
               <h1 className="text-2xl font-black tracking-tight text-[#1e293b] leading-none">STACK<span className="text-[#3b82f6]">KIDI</span> <span className="text-[#f59e0b]">LAB</span></h1>
               <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-[#94a3b8]'}`} />
                  <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-wider">{isRunning ? 'Running...' : 'Ready!'}</p>
               </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-500 hover:bg-blue-100 cursor-pointer shadow-sm transition-all">
            <Info className="w-6 h-6" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
         <section className={`${isEditorExpanded ? 'w-[75%]' : 'w-[45%] lg:w-[42%] xl:w-[40%]'} h-full flex flex-col bg-white border-r-4 border-[#e2e8f0] z-40 transition-all duration-300`}>
          <div className="h-16 border-b-4 border-[#f1f5f9] flex items-center justify-between px-3 sm:px-6 md:px-8 shrink-0 bg-[#f8fafc]">
             <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="w-4 h-4 rounded-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.5)] shrink-0" />
                <span className="hidden sm:inline text-xs sm:text-sm font-black text-[#1e293b] uppercase tracking-wider">סביבת העבודה</span>
             </div>
             <div className="flex gap-1 sm:gap-2 items-center shrink-0">
                {/* RUN / STOP Button container with a unique animated speech bubble */}
                <div className="relative flex flex-col items-center mr-0.5 sm:mr-1 group">
                   {/* Speech bubble */}
                   <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                     <div className={`bg-gradient-to-r ${isRunning ? 'from-rose-500 to-red-600 shadow-[0_4px_10px_rgba(239,68,68,0.3)]' : 'from-emerald-500 to-green-600 shadow-[0_4px_10px_rgba(16,185,129,0.3)]'} text-white text-[11px] sm:text-[12px] font-black py-1.5 px-3 rounded-2xl border-2 border-white flex items-center gap-1 whitespace-nowrap animate-bounce`}>
                       <span>{isRunning ? 'עצור' : 'הפעל'}</span>
                       <span>{isRunning ? '🛑' : '🚩'}</span>
                     </div>
                     <div className={`w-3 h-3 ${isRunning ? 'bg-red-600' : 'bg-green-600'} rotate-45 -mt-1.5 border-r-2 border-b-2 border-white`} />
                   </div>

                   {/* Circular green flag run/stop button */}
                   {isRunning ? (
                     <motion.button
                       whileHover={{ scale: 1.1, translateY: -2 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={stopSimulation}
                       className="w-[41px] h-[41px] sm:w-[51px] sm:h-[51px] shrink-0 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-[0_4px_0_#991b1b] transition-all cursor-pointer"
                       title="עצור פרויקט"
                     >
                       <Square className="w-[18px] h-[18px] sm:w-[23px] sm:h-[23px] fill-current" />
                     </motion.button>
                   ) : (
                     <motion.button
                       whileHover={{ scale: 1.1, translateY: -2 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={runSimulation}
                       className="w-[41px] h-[41px] sm:w-[51px] sm:h-[51px] shrink-0 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-[0_4px_0_#16a34a] transition-all cursor-pointer"
                       title="הפעל פרויקט"
                     >
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] sm:w-[23px] sm:h-[23px]">
                         <path d="M6 3v18h2v-7h10l-2-5 2-5H6z"/>
                       </svg>
                     </motion.button>
                   )}
                </div>

                {/* Save and Load container with a beautiful speech bubble above */}
                <div className="relative flex flex-col items-center mr-0.5 sm:mr-1 group">
                   {/* Speech bubble */}
                   <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                     <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] sm:text-[12px] font-black py-1.5 px-3 rounded-2xl shadow-[0_4px_10px_rgba(37,99,235,0.3)] border-2 border-white flex items-center gap-1 whitespace-nowrap">
                       <span>שמירה וטעינה</span>
                       <span className="text-sm">✨</span>
                     </div>
                     <div className="w-3 h-3 bg-indigo-600 rotate-45 -mt-1.5 border-r-2 border-b-2 border-white" />
                   </div>

                   <div className="flex gap-1 sm:gap-2">
                     {/* Save button */}
                     <motion.button
                       whileHover={{ scale: 1.1, translateY: -2 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={handleSaveProject}
                       className="w-[41px] h-[41px] sm:w-[51px] sm:h-[51px] shrink-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-[0_4px_0_#1d4ed8] transition-all cursor-pointer"
                       title="שמור פרויקט"
                     >
                       <Save className="w-[18px] h-[18px] sm:w-[23px] sm:h-[23px] stroke-[2.5]" />
                     </motion.button>

                     {/* Load button */}
                     <motion.button
                       whileHover={{ scale: 1.1, translateY: -2 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={handleLoadProjectClick}
                       className="w-[41px] h-[41px] sm:w-[51px] sm:h-[51px] shrink-0 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-[0_4px_0_#b45309] transition-all cursor-pointer"
                       title="טען פרויקט"
                     >
                       <FolderOpen className="w-[18px] h-[18px] sm:w-[23px] sm:h-[23px] stroke-[2.5]" />
                     </motion.button>
                   </div>
                </div>

                {/* Python Code viewer container with speech bubble - UPDATED */}
                <div className="relative flex flex-col items-center mr-0.5 sm:mr-1 group">
                   {/* Speech bubble */}
                   <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                     <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[11px] sm:text-[12px] font-black py-1.5 px-3 rounded-2xl shadow-[0_4px_10px_rgba(139,92,246,0.3)] border-2 border-white flex items-center gap-1 whitespace-nowrap">
                       <span>קוד פייתון</span>
                       <span className="text-sm">🐍</span>
                     </div>
                     <div className="w-3 h-3 bg-fuchsia-600 rotate-45 -mt-1.5 border-r-2 border-b-2 border-white" />
                   </div>

                   <div className="flex gap-1 sm:gap-2">
                     <motion.button
                       whileHover={{ scale: 1.1, translateY: -2 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={handleShowPythonCode}
                       className="w-[41px] h-[41px] sm:w-[51px] sm:h-[51px] shrink-0 bg-violet-600 hover:bg-violet-700 text-white rounded-full flex items-center justify-center border-2 border-white shadow-[0_4px_0_#5b21b6] transition-all cursor-pointer"
                       title="הצג קוד פייתון"
                     >
                       <Code className="w-[18px] h-[18px] sm:w-[23px] sm:h-[23px] stroke-[2.5]" />
                     </motion.button>
                   </div>
                </div>

                 {/* Learning Tasks container with speech bubble */}
                 <div className="relative flex flex-col items-center mr-0.5 sm:mr-1 group">
                    {/* Speech bubble */}
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-gradient-to-r from-[#ff9f1c] to-amber-500 text-white text-[11px] sm:text-[12px] font-black py-1.5 px-3 rounded-2xl shadow-[0_4px_10px_rgba(245,158,11,0.3)] border-2 border-white flex items-center gap-1 whitespace-nowrap">
                        <span>כרטיסיות משימה</span>
                        <span className="text-sm">🏆</span>
                      </div>
                      <div className="w-3 h-3 bg-amber-500 rotate-45 -mt-1.5 border-r-2 border-b-2 border-white" />
                    </div>

                    <div className="flex gap-1 sm:gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1, translateY: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsTaskPanelOpen(true)}
                        className="w-[41px] h-[41px] sm:w-[51px] sm:h-[51px] shrink-0 bg-[#ff9f1c] hover:bg-[#ff8f00] text-white rounded-full flex items-center justify-center border-2 border-white shadow-[0_4px_0_#d97706] transition-all cursor-pointer relative"
                        title="כרטיסיות משימה"
                      >
                        <Trophy className="w-[18px] h-[18px] sm:w-[23px] sm:h-[23px] stroke-[2.5] text-white" />
                        {completedTasks.length < LEARNING_TASKS.length && (
                          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-red-500 border-2 border-white"></span>
                          </span>
                        )}
                      </motion.button>
                     </div>
                 </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".json" 
                  className="hidden" 
                />

                <div className="h-6 w-[2px] bg-slate-200 mx-0.5 sm:mx-1 shrink-0" />

                <button 
                  onClick={() => setIsEditorExpanded(!isEditorExpanded)}
                  className="p-2 sm:p-3 bg-[#e2e8f0] hover:bg-slate-300 rounded-2xl text-[#1e293b] transition-all duration-300 cursor-pointer shrink-0"
                  title={isEditorExpanded ? 'Collapse Editor' : 'Expand Editor'}
                >
                  {isEditorExpanded ? <Minimize2 className="w-5 h-5 sm:w-8 sm:h-8" /> : <Maximize2 className="w-5 h-5 sm:w-8 sm:h-8" />}
                </button>
             </div>
          </div>
          <div className="flex-1">
            <BlocklyEditor ref={editorRef} onCodeChange={setCurrentCode} isRunning={isRunning} />
          </div>
         </section>

         <section className={`${isEditorExpanded ? 'hidden' : 'w-[55%] lg:w-[58%] xl:w-[60%]'} h-full px-6 py-4 flex flex-col overflow-y-auto bg-[#f8fafc] relative transition-all duration-300`}>
          {/* Playful environment background */}
          <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
          
          <div className="flex-1 min-h-0 z-10 flex items-center justify-center">
             <div className="w-full h-full max-w-full flex items-center justify-center">
                <Board 
                   leds={leds} 
                   components={components} 
                   onValueChange={handleValueChange} 
                   onButtonPress={handleButtonPress}
                   onSensorHover={handleSensorHover}
                   onSwapComponent={handleSwapComponent}
                />
             </div>
          </div>
          
          <div className="mt-2 grid grid-cols-3 gap-4 shrink-0 z-20">
             <div className="bg-white p-2 rounded-[1.5rem] border-4 border-[#bae6fd] shadow-md">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-6 h-6 rounded-full bg-[#bae6fd] flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                   </div>
                   <h2 className="text-[10px] font-black text-[#0369a1] uppercase tracking-widest font-mono">System</h2>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className={`text-xl font-black ${isRunning ? 'text-[#10b981]' : 'text-slate-300'}`}>
                     {isRunning ? "ACTIVE" : "IDLE"}
                   </span>
                </div>
             </div>

             <div className="bg-white p-2 rounded-[1.5rem] border-4 border-[#fed7aa] shadow-md">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-6 h-6 rounded-full bg-[#fed7aa] flex items-center justify-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full rotate-45" />
                   </div>
                   <h2 className="text-[10px] font-black text-[#9a3412] uppercase tracking-widest font-mono">
                      {hoveredSensor ? 'Sensor Data' : 'Sensors'}
                   </h2>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-xl font-black text-[#f59e0b]">
                     {hoveredSensor ? hoveredSensor.name : components.filter(c => c.value > 0).length}
                   </span>
                   <span className="text-sm font-bold text-slate-300">
                     {hoveredSensor ? `: ${hoveredSensor.value}` : `/ ${components.length}`}
                   </span>
                </div>
             </div>

             <div className="bg-white p-2 rounded-[1.5rem] border-4 border-[#fecdd3] shadow-md">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-6 h-6 rounded-full bg-[#fecdd3] flex items-center justify-center">
                      <div className="w-3 h-3 bg-rose-500 rounded-sm" />
                   </div>
                   <h2 className="text-[10px] font-black text-[#9f1239] uppercase tracking-widest font-mono">Voltage</h2>
                </div>
                <div className="text-2xl font-black text-[#e11d48]">3.3V <span className="text-xs font-bold text-slate-300 ml-1">OK</span></div>
             </div>
          </div>
        </section>

        {/* מגירת כרטיסיות למידה לילדים */}
        <AnimatePresence>
          {isTaskPanelOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Backdrop with a beautiful blur effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsTaskPanelOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="bg-white rounded-[2.5rem] border-4 border-amber-400 shadow-2xl relative w-full h-[85vh] max-w-lg overflow-hidden flex flex-col z-[100]"
                style={{ direction: 'rtl' }}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b-4 border-amber-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                      <Trophy className="w-6 h-6 stroke-[2.5] text-yellow-300 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg tracking-tight">משימות וכרטיסיות למידה 🏆</h3>
                      <p className="text-white/90 text-xs font-bold">השלימו את האתגרים וזכו בגביעים!</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsTaskPanelOpen(false)}
                    className="p-2 hover:bg-black/10 rounded-xl transition-all cursor-pointer text-white"
                  >
                    <X className="w-6 h-6 stroke-[2.5]" />
                  </button>
                </div>

                {/* Scrollable body with custom styles to prevent cutoff */}
                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 bg-[#fafafb] pb-16">
                  
                  {/* Progress bar */}
                  <div className="flex items-center justify-between border-2 border-slate-200 bg-white p-3 rounded-2xl shadow-sm shrink-0">
                    <span className="text-xs font-black text-[#64748b] bg-[#f1f5f9] px-2.5 py-1 rounded-full border border-slate-200">
                      משימה {currentTaskIndex + 1} מתוך {LEARNING_TASKS.length}
                    </span>
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                      completedTasks.includes(LEARNING_TASKS[currentTaskIndex].id) 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-amber-100 text-amber-700 border border-amber-300'
                    }`}>
                      {completedTasks.includes(LEARNING_TASKS[currentTaskIndex].id) ? 'הושלמה בהצלחה! 🎉' : 'בתהליך 🛠️'}
                    </span>
                  </div>

                  {/* Main Task Card */}
                  <div className="bg-white rounded-3xl border-4 border-[#fef08a] p-5 shadow-md relative overflow-hidden flex flex-col gap-3 shrink-0">
                    <div className="absolute top-0 right-0 p-3 text-5xl opacity-10 pointer-events-none font-black select-none">
                      {LEARNING_TASKS[currentTaskIndex].emoji}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{LEARNING_TASKS[currentTaskIndex].emoji}</span>
                      <h3 className="font-black text-slate-800 text-base leading-snug">
                        {LEARNING_TASKS[currentTaskIndex].title}
                      </h3>
                    </div>

                    <div className="text-[11px] font-black text-slate-500 bg-[#fefcbf] border-2 border-[#fef08a] px-3 py-1 rounded-xl self-start">
                      רמת קושי: <span className="text-amber-700">{LEARNING_TASKS[currentTaskIndex].difficulty}</span>
                    </div>

                    <p className="text-slate-600 text-sm font-bold leading-relaxed">
                      {LEARNING_TASKS[currentTaskIndex].description}
                    </p>

                    {/* Objective (Target) */}
                    <div className="bg-[#f0f9ff] text-sky-800 p-4 rounded-2xl border-2 border-[#bae6fd] flex flex-col gap-1 shadow-sm">
                      <span className="text-[11px] font-black text-sky-600 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-sky-500" /> המטרה שלכם:
                      </span>
                      <p className="text-xs font-bold leading-relaxed">{LEARNING_TASKS[currentTaskIndex].objective}</p>
                    </div>

                    {/* Hints step-by-step list */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-black text-slate-500 flex items-center gap-1">
                        <Lightbulb className="w-4 h-4 text-amber-500 animate-pulse" /> כיצד לפתור? שלב אחר שלב:
                      </span>
                      <ul className="flex flex-col gap-2.5 bg-[#f8fafc] border-2 border-[#e2e8f0] p-4 rounded-2xl text-xs font-bold text-slate-600 leading-relaxed list-decimal list-inside">
                        {LEARNING_TASKS[currentTaskIndex].hints.map((hint, idx) => (
                          <li key={idx} className="indent-[-12px] pr-3 select-none">
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Test my Code controls */}
                    <div className="border-t-2 border-slate-100 pt-4 flex flex-col gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const check = LEARNING_TASKS[currentTaskIndex].testCode(currentCode);
                          if (check.success) {
                            setCompletedTasks(prev => [...new Set([...prev, LEARNING_TASKS[currentTaskIndex].id])]);
                            setTaskFeedback({ type: 'success', message: check.feedback });
                            showToast('כל הכבוד! פתרת את המשימה בהצלחה! 🎉', 'success');
                          } else {
                            setTaskFeedback({ type: 'error', message: check.feedback });
                            showToast('עדיין לא מדויק, נסה שוב! ❤️', 'error');
                          }
                        }}
                        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl border-2 border-white shadow-[0_4px_0_#10b981] hover:shadow-[0_2px_0_#10b981] hover:translate-y-[2px] transition-all cursor-pointer font-black text-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                        <span>בדוק את הקוד שלי בסביבה! 🚀</span>
                      </motion.button>

                      {/* Check Feedback container with animations */}
                      <AnimatePresence mode="wait">
                        {taskFeedback.type && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={`p-4 rounded-2xl border-2 text-xs font-bold leading-relaxed flex flex-col gap-1.5 shadow-sm ${
                              taskFeedback.type === 'success' 
                                ? 'bg-green-50 border-green-200 text-green-800' 
                                : 'bg-rose-50 border-rose-200 text-rose-800'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-black text-xs">
                              {taskFeedback.type === 'success' ? '🎯 הצלחה!' : '💡 טיפ קטן להשלמה:'}
                            </div>
                            <p>{taskFeedback.message}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Back and Next tasks selection - grouped styled buttons matching save/load style */}
                  <div className="flex gap-2 shrink-0 justify-between items-center bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-sm mt-auto">
                    <button
                      disabled={currentTaskIndex === 0}
                      onClick={() => {
                        setCurrentTaskIndex(prev => prev - 1);
                        setTaskFeedback({ type: null, message: '' });
                      }}
                      className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 rounded-xl transition-all cursor-pointer border-2 border-slate-200 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <span className="text-xs font-black text-slate-700">בחר משימה</span>
                    <button
                      disabled={currentTaskIndex === LEARNING_TASKS.length - 1}
                      onClick={() => {
                        setCurrentTaskIndex(prev => prev + 1);
                        setTaskFeedback({ type: null, message: '' });
                      }}
                      className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 rounded-xl transition-all cursor-pointer border-2 border-slate-200 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[100] flex items-center gap-3 px-6 py-3 bg-slate-900/95 text-white rounded-2xl shadow-2xl border border-slate-700/50 font-black text-sm"
            style={{ direction: 'rtl' }}
          >
            <div className={`w-3.5 h-3.5 rounded-full ${toast.type === 'success' ? 'bg-[#4ade80]' : 'bg-[#f87171]'}`} />
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)} 
              className="mr-3 p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Python Code Viewer Modal */}
      <AnimatePresence>
        {isPythonModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPythonModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-[2rem] border-4 border-violet-500 shadow-2xl relative w-full max-w-2xl overflow-hidden flex flex-col z-10 max-h-[90vh]"
              style={{ direction: 'rtl' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Code className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg tracking-tight">קוד Python של הלבנים 🐍</h3>
                    <p className="text-white/80 text-xs font-bold">צפייה ובדיקת קוד המיקרוביט שלך</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPythonModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all cursor-pointer text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                <p className="text-sm font-bold text-slate-600 leading-relaxed">
                  קוד ה-Python נוצר אוטומטית מסביבת העבודה שלך. תוכל להעתיק ולבדוק אותו, או להשתמש בו במיקרוביט אמיתי!
                </p>

                {/* Code Window Container */}
                <div className="relative group flex-1 min-h-[250px] flex flex-col">
                  {/* Window Bar */}
                  <div className="bg-slate-900 px-4 py-2 rounded-t-2xl flex items-center justify-between border-b border-slate-800 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-widest leading-none">main.py</span>
                    <span className="text-[10px] font-bold text-[#a78bfa] font-mono select-none">Python 3</span>
                  </div>

                  {/* Code Editor Screen */}
                  <div className="flex-1 bg-slate-950 p-4 rounded-b-2xl overflow-auto max-h-[45vh] border border-slate-900 flex">
                    <pre className="w-full text-left font-mono text-xs md:text-sm text-emerald-400 select-text outline-none whitespace-pre-wrap leading-relaxed overflow-x-auto" style={{ direction: 'ltr' }}>
                      <code>{pythonCode}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setIsPythonModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black rounded-full transition-all cursor-pointer text-sm"
                >
                  סגור
                </button>
                <button
                  onClick={handleCopyPythonCode}
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-full border-2 border-white shadow-[0_3px_0_#5b21b6] hover:shadow-[0_1px_0_#5b21b6] active:translate-y-[2px] transition-all cursor-pointer flex items-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4" />
                  העתק קוד
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
