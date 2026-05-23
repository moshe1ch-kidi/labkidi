import { useState, useCallback, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, RefreshCcw, Info, Maximize2, Minimize2, Save, FolderOpen, X, Code, Trophy, Sparkles, Lightbulb, CheckCircle2, ChevronRight, ChevronLeft, Award, Smartphone, Monitor } from 'lucide-react';
import { INITIAL_COMPONENTS } from './constants';
import { ComponentInstance, ComponentType } from './types';
import Board from './components/Board';
import BlocklyEditor, { BlocklyEditorRef } from './components/BlocklyEditor';
import smartGateBarrierImg from './assets/images/smart_gate_barrier_1779353380715.png';
import colorSorterImg from './assets/images/color_sorter_img_1779355927492.png';
import pirSlidingDoorImg from './assets/images/pir_sliding_door_1779367483266.png';
import noHonkingStreetImg from './assets/images/no_honking_street_1779475543747.png';
import smartGreenhouseImg from './assets/images/smart_greenhouse_1779512790896.png';

export interface LearningTask {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  emoji: string;
  objective: string;
  hints: string[];
  image?: string;
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
      'נשתמש בלבנה המעולה "Analog Write Pin" (מקטגוריית Output) - היא יכולה לשלוח עוצמות רכות ולא רק הדלקה/כיבוי! נכוון את הלבנה ללד האדום או הצהוב שלנו.',
      'למקום של הערך (To), נחבר את הלבנה העגולה "Potentiometer" מקטגוריית החיישנים.',
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
         return { success: false, feedback: 'שכחתם להשתמש בלבנת כתיבה אנלוגית (Analog Write Pin) השולטת בלדים, שמאפשרת עוצמות אור משתנות!' };
      }
      if (!hasPot) {
         return { success: false, feedback: 'שכחתם לקרוא את המצב של ה-Potentiometer כדי לשמוע כמה סובבנו את החוגה!' };
      }
      if (!hasLoop) {
         return { success: false, feedback: 'כדי שהעמעום יעבוד כל הזמן בכיף, ודאו שכל הלבנות שלכם נמצאות בתוך המלבן של forever!' };
      }
      
      return { success: true, feedback: 'פשוט וואו! לקחתם שליטה מלאה על עוצמת האור ובניתם עמעם תאורה מושלם כמו בבית חכם אמיתי! גאים בכם! 🏆🌟😎' };
    }
  },
  {
    id: 5,
    title: '💡 פנס רחוב חכם (משימה 5)',
    description: 'בשיעור זה, תלמדו כיצד לקבל מידע על עוצמת האור ממודול חיישן האור וכיצד לשלוט בתאורת ה-LED על סמך נתונים אלה. על ידי קביעת רמות בהירות שונות, תוכלו להשיג שליטה חכמה במצב הדלקה/כיבוי של נורת ה-LED.',
    difficulty: 'מדען צעיר 🧪',
    emoji: '💡',
    objective: 'לשלוט בנורת הלד הצהובה (Yellow LED) על סמך נתוני חיישן האור (LDR) - כשיש חושך הדליקו את האור, וכשיש אור שמש כבו אותו!',
    hints: [
      'נשתמש בלבנת "לעולמים" (forever) כדי שהמערכת תקשיב לחיישן ותגיב לשינויים ללא הפסקה.',
      'ניעזר בלבנת תנאי "אם ... אחרת" (if ... else) מקטגוריית הלוגיקה.',
      'נבדוק האם הערך שמתקבל מלבנת "Light Sensor(LDR)" קטן מ-300 (או מספר קטן אחר שמסמל חושך).',
      'אם התנאי מתקיים (כלומר חשוך) - נדליק את הלד הצהוב (Yellow Led ON), ואחרת (כלומר מואר) - נכבה אותו (Yellow Led OFF)!'
    ],
    testCode: (jsCode: string) => {
      const cleaned = jsCode.replace(/\s+/g, '');
      const hasLdr = cleaned.includes("analogRead('P1')") || cleaned.includes('analogRead("P1")');
      const hasYellowOn = cleaned.includes("setLedState('yellow',1)") || cleaned.includes('setLedState("yellow",1)');
      const hasYellowOff = cleaned.includes("setLedState('yellow',0)") || cleaned.includes('setLedState("yellow",0)');
      const hasIf = cleaned.includes('if(') || cleaned.includes('if ');
      const hasLoop = cleaned.includes('while(') || cleaned.includes('while ') || cleaned.includes('setTimeout') || cleaned.includes('Promise');
      
      if (!jsCode || jsCode.trim() === '') {
        return { success: false, feedback: 'סביבת העבודה ריקה! גררו לבנים כדי לבנות את הקוד.' };
      }
      if (!hasLdr) {
        return { success: false, feedback: 'אופס! שכחתם לקרוא את רמות האור מחיישן האור (Light Sensor LDR). גררו את הלבנה "Light Sensor(LDR)" לקוד.' };
      }
      if (!hasIf) {
        return { success: false, feedback: 'צריך לבצע בדיקה לוגית - האם חשוך עכשיו? השתמשו בלבנת "אם... אחרת" (if... else) או "אם" (if) מקטגוריית לוגיקה!' };
      }
      if (!hasYellowOn) {
        return { success: false, feedback: 'ודאו שאתם מדליקים (ON) את נורת הלד הצהובה (Yellow Led) כשיורד החושך!' };
      }
      if (!hasYellowOff) {
        return { success: false, feedback: 'שכחתם לכבות (OFF) את הלד הצהוב (Yellow Led) כשיש מספיק אור שמש!' };
      }
      if (!hasLoop) {
        return { success: false, feedback: 'כדי שפנס הרחוב יתעדכן כל הזמן ובאופן אוטומטי, ודאו שעטפתם את כל הלבנות בתוך לולאת forever!' };
      }
      
      return { success: true, feedback: 'כל הכבוד! בניתם מערכת פנס רחוב חכם לתפארת! האור נדלק אוטומטית כשחשוך וכבה ביום! 💡🤖🌟' };
    }
  },
  {
    id: 6,
    title: '🚨 אזעקת מכשול חכמה (משימה 6)',
    description: 'בשיעור זה, נחקור את מודול חיישן המרחק האולטרה-סוני (Ultrasonic Sensor) ונלמד כיצד לשלב אותו עם הזמזם (Buzzer) ונורת ה-LED כדי ליצור מערכת התרעה למניעת תאונות!',
    difficulty: 'קוסם חיישנים 🧙‍♂️',
    emoji: '🚨',
    objective: 'ליצור מערכת אזעקת קרבה: כאשר חיישן המרחק מזהה מכשול קרוב (מרחק קטן מ-20 ס״מ), נורת הלד האדומה תידלק והזמזם ישמיע צליל אזהרה. כשהמכשול מתרחק - האזעקה והנורה יכבו!',
    hints: [
      'נתחיל עם לבנת "לעולמים" (forever) כדי להאזין לחיישן המרחק ברציפות.',
      'נגרור לבנת "אם... אחרת" (if... else) מקטגוריית לוגיקה.',
      'נבדוק בתוך התנאי האם הערך המוחזר מלבנת "Ultrasonic" קטן מ-20.',
      'במקרה של קירבה (בתוך ה-"אם"): נפעיל את הלד האדום (Red Led ON) ונוריד קצת רעש אזהרה בעזרת לבנת "Buzzer" (playTone).',
      'במקרה הרגיל (בתוך ה-"אחרת"): נכבה את הלד האדום (Red Led OFF) כדי לסמן שהכול תקין!'
    ],
    testCode: (jsCode: string) => {
      const cleaned = jsCode.replace(/\s+/g, '');
      const hasUltrasonic = cleaned.includes("ultrasonicRead(") || cleaned.includes("ultrasonicRead");
      const hasBuzzer = cleaned.includes("playTone");
      const hasLedOn = cleaned.includes("setLedState('red',1)") || cleaned.includes('setLedState("red",1)') || cleaned.includes("setLedState('yellow',1)") || cleaned.includes('setLedState("yellow",1)');
      const hasLedOff = cleaned.includes("setLedState('red',0)") || cleaned.includes('setLedState("red",0)') || cleaned.includes("setLedState('yellow',0)") || cleaned.includes('setLedState("yellow",0)');
      const hasIf = cleaned.includes('if(') || cleaned.includes('if ');
      const hasLoop = cleaned.includes('while(') || cleaned.includes('while ') || cleaned.includes('setTimeout') || cleaned.includes('Promise');
      
      if (!jsCode || jsCode.trim() === '') {
        return { success: false, feedback: 'סביבת העבודה ריקה! גררו לבנים כדי לבנות את הקוד.' };
      }
      if (!hasUltrasonic) {
        return { success: false, feedback: 'אופס! שכחתם לקרוא את המרחק מחיישן המרחק האולטרה-סוני (Ultrasonic Sensor). גררו את לבנת "Ultrasonic" לקוד.' };
      }
      if (!hasIf) {
        return { success: false, feedback: 'צריך לבצע בדיקה לוגית - האם יש מכשול קרוב? השתמשו בלבנת "אם... אחרת" (if... else) או "אם" (if) מקטגוריית לוגיקה!' };
      }
      if (!hasBuzzer) {
        return { success: false, feedback: 'איפה קול האזהרה? שכחתם להפעיל את הזמזם (Buzzer) כדי להשמיע התרעה קולית כשהמכשול קרוב!' };
      }
      if (!hasLedOn) {
        return { success: false, feedback: 'ודאו שאתם מדליקים (ON) את נורת הלד האדומה או הצהובה כסימן אזהרה ויזואלי להתקרבות המכשול!' };
      }
      if (!hasLedOff) {
        return { success: false, feedback: 'שכחתם לכבות (OFF) את נורת הלד כאשר המכשול מתרחק ואינו מסוכן עוד!' };
      }
      if (!hasLoop) {
        return { success: false, feedback: 'כדי שהאזעקה תמשיך לנטר את השטח כל הזמן בשידור חי, ודאו שעטפתם את כל הלבנות בתוך לולאת forever!' };
      }
      
      return { success: true, feedback: 'יוצא מן הכלל! בניתם מערכת אזעקת מרחק מונעת תאונות חכמה ומשוכללת! כבוד גדול! 🚨🔊🤖🏆' };
    }
  },
  {
    id: 7,
    title: '🚧 מחסום כביש חשמלי חכם (משימה 7)',
    description: 'בשיעור זה נבנה דגם של מחסום כביש חשמלי / שער חניה חכם הבנוי על מנוע סרוו (Servo Motor). נלמד כיצד להרים ולהוריד את זרוע המחסום באופן אוטומטי ומבוקר!',
    difficulty: 'מהנדס רובוטיקה 🤖',
    emoji: '🚧',
    objective: 'לתכנת את מנוע הסרוו כך שיפתח ויסגור את זרוע המחסום אוטומטית שוב ושוב: זווית 0 מעלות מסמלת שהמחסום סגור, וזווית 180 מעלות מסמלת שהמחסום פתוח לרווחה, עם השהיית מעבר של שנייה שלמה.',
    hints: [
      'נזדקק ללבנת "לעולמים" (forever) כדי להריץ את מחזור פתיחת וסגירת השער באופן קבוע וחלק.',
      'נגרור לבנת "Servo Angle" ונקבע את הזווית ל-0 מעלות כדי לסגור את המחסום.',
      'נגרור לבנת המתנה "Wait 1 Sec" כדי לדמות את עצירת המכוניות הממתינות לפני המחסום.',
      'נגרור לבנת "Servo Angle" נוספת ונקבע אותה ל-180 מעלות כדי להרים את המחסום ולפתוח את השער.',
      'נוסיף לבנת המתנה נוספת "Wait 1 Sec" כדי לתת למכוניות לעבור בבטחה לפני שהמחסום נסגר בשנית!'
    ],
    image: smartGateBarrierImg,
    testCode: (jsCode: string) => {
      const cleaned = jsCode.replace(/\s+/g, '');
      const hasServo0 = cleaned.includes("setServoAngle(0)") || cleaned.includes("setServoAngle('0')") || cleaned.includes('setServoAngle("0")');
      const hasServo180 = cleaned.includes("setServoAngle(180)") || cleaned.includes("setServoAngle('180')") || cleaned.includes('setServoAngle("180")');
      const hasWait = cleaned.includes("setTimeout") || cleaned.includes("Promise");
      const hasLoop = cleaned.includes('while(') || cleaned.includes('while ') || cleaned.includes('setTimeout') || cleaned.includes('Promise');
      const hasServoAny = cleaned.includes("setServoAngle");

      if (!jsCode || jsCode.trim() === '') {
        return { success: false, feedback: 'סביבת העבודה ריקה! גררו לבנים כדי לבנות את הקוד.' };
      }
      if (!hasServoAny) {
        return { success: false, feedback: 'אופס! שכחתם להשתמש בלבנת קביעת זווית מנוע הסרוו. גררו את לבנת "Servo Angle" לקוד.' };
      }
      if (!hasServo0 && !hasServo180) {
        return { success: false, feedback: 'ודאו שאתם מגדירים את זווית מנוע הסרוו ל-0 מעלות (סגור) וגם ל-180 מעלות (פתוח) כדי ליצור מחזור פתיחה וסגירה שלם!' };
      }
      if (!hasServo0) {
        return { success: false, feedback: 'מצוין, אך שכחתם להוסיף קביעת זווית סרוו ל-0 מעלות כדי להוריד את המחסום לאחר שהרכבים עברו!' };
      }
      if (!hasServo180) {
        return { success: false, feedback: 'מצוין, אך שכחתם להוסיף קביעת זווית סרוו ל-180 מעלות כדי להרים את המחסום לפתיחת השער!' };
      }
      if (!hasWait) {
        return { success: false, feedback: 'שכחתם להוסיף השהייה! השתמשו בלבנת "Wait" (המתנה) של שנייה אחת לפחות בין פתיחה וסגירה, כדי שהמנוע יספיק לזוז והמכוניות יספיקו לעבור בבטחה!' };
      }
      if (!hasLoop) {
        return { success: false, feedback: 'כדי שמחסום הכביש ימשיך לעבוד שוב ושוב עבור כל המכוניות הבאות, ודאו שעטפתם את כל הלבנות בתוך לולאת forever!' };
      }
      
      return { success: true, feedback: 'מדהים ומבריק! זרוע המחסום החשמלי הווירטואלי שלכם עולה ויורדת ללא הפסקה ובדיוק מושלם בין 0 ל-180 מעלות! אתם פשוט מהנדסי רובוטיקה מומחים! 🚧⚙️🦾🤖🏆' };
    }
  },
  {
    id: 8,
    title: '🌈 מיון צבעים אוטומטי (משימה 8)',
    description: 'בשיעור זה נחקור את חיישן זיהוי הצבעים (RGB Color Sensor). נלמד כיצד לזהות את צבע הפריטים שעוברים על פני החיישן ולהדליק בהתאם נורות לד מתאימות!',
    difficulty: 'מומחה קוד וצבע 🌈',
    emoji: '🌈',
    objective: 'לתכנת את המערכת כך שאם חיישן הצבע מזהה אדום (ערך 0), נורת הלד האדומה תידלק והצהובה תכבה. וכאשר החיישן מזהה צהוב (ערך 3), נורת הלד הצהובה תידלק והאדומה תכבה!',
    hints: [
      'נעטוף הכל בלבנת "לעולמים" (forever) כדי לבצע בדיקה קבועה של הצבע ברקע.',
      'נשתמש בלבנת תנאי "אם... אחרת" (if... else if) לבדיקה לוגית.',
      'נבדוק בתוך התנאי הראשון אם "Color Sensor" שווה ל-0 (אדום), ונדליק את הלד האדום (Red Led to 1) ונכבה את הלד הצהוב (Yellow Led to 0).',
      'נבדוק בתנאי השני אם "Color Sensor" שווה ל-3 (צהוב), ונדליק את הלד הצהוב (Yellow Led to 1) ונכבה את האדום (Red Led to 0)!'
    ],
    image: colorSorterImg,
    testCode: (jsCode: string) => {
      const cleaned = jsCode.replace(/\s+/g, '');
      const hasColorSensor = cleaned.includes("readColorSensor(") || cleaned.includes("readColorSensor");
      const hasIf = cleaned.includes('if(') || cleaned.includes('if ');
      const hasRedOn = cleaned.includes("setLedState('red',1)") || cleaned.includes('setLedState("red",1)');
      const hasYellowOn = cleaned.includes("setLedState('yellow',1)") || cleaned.includes('setLedState("yellow",1)');
      const hasLoop = cleaned.includes('while(') || cleaned.includes('while ') || cleaned.includes('setTimeout') || cleaned.includes('Promise');
      
      if (!jsCode || jsCode.trim() === '') {
        return { success: false, feedback: 'סביבת העבודה ריקה! גררו לבנים כדי לבנות את הקוד.' };
      }
      if (!hasColorSensor) {
        return { success: false, feedback: 'שכחתם לקרוא את הערך מחיישן הצבע! גררו את לבנת "Color Sensor (RGB)" למשטח העבודה.' };
      }
      if (!hasIf) {
        return { success: false, feedback: 'השתמשו בלבנת תנאי "אם... אחרת" (if... else if) מקטגוריית לוגיקה כדי לבדוק איזה צבע זוהה!' };
      }
      if (!hasRedOn) {
        return { success: false, feedback: 'ודאו שאתם מדליקים (ON) את נורת הלד האדומה (Red Led) כאשר החיישן מזהה את הצבע האדום (ערך 0)!' };
      }
      if (!hasYellowOn) {
        return { success: false, feedback: 'ודאו שאתם מדליקים (ON) את נורת הלד הצהובה (Yellow Led) כאשר החיישן מזהה את הצבע הצהוב (ערך 3)!' };
      }
      if (!hasLoop) {
        return { success: false, feedback: 'כדי שהמערכת תמשיך למיין פריטים בשידור חי וללא הפסקה, ודאו שעטפתם הכול בתוך לולאת forever!' };
      }
      
      return { success: true, feedback: 'מדהים ביותר! בניתם קוד מיון מושלם וחכם בעזרת חיישן הצבע החדש. הלדים נדלקים בתיאום מושלם לפי זיהוי הצבע! אתם גאונים! 🌈🤖🔮🏆' };
    }
  },
  {
    id: 9,
    title: '🚶‍♂️ גלאי תנועה ודלת אוטומטית (משימה 9)',
    description: 'בשיעור זה נשתמש בחיישן PIR, שיכול לזהות קרינה אינפרא אדומה מבני אדם. כאשר אדם או בעל חיים נכנסים לטווח הגילוי, חיישן ה-PIR ישלח אות לזיהוי תנועה, ויפתח דלת הזזה בעזרת מנוע צעד (בסימולציה נשתמש במנוע הקיים שמסתובב כשיש תנועה ועוצר כשאין קרינה).',
    difficulty: 'בלש קוד מתקדם 🤖',
    emoji: '🚶‍♂️',
    objective: 'לתכנת את המערכת כך שאם חיישן ה-PIR מזהה תנועה (ערך 1), המנוע יתחיל להסתובב במהירות של 50 כדי לפתוח את הדלת ההזזה, וכאשר אין זיהוי תנועה (ערך 0) המנוע יעצור מיד!',
    hints: [
      'נעטוף הכל בלבנת "לעולמים" (forever) כדי לבצע בדיקה קבועה של זיהוי תנועה ברקע.',
      'נשתמש בלבנת תנאי "אם... אחרת" (if ... else) מקטגוריית לוגיקה.',
      'נבדוק בתנאי אם הערך מחיישן התנועה "PIR Motion Sensor" שווה ל-1 (תנועה זוהתה).',
      'אם יש תנועה - נפעיל את המנוע במהירות 50 בעזרת לבנת "Motor Speed" מקטגוריית Output.',
      'אחרת (אין תנועה) - נעצור את המנוע לחלוטין בעזרת הלבנה "Stop Motor"!'
    ],
    image: pirSlidingDoorImg,
    testCode: (jsCode: string) => {
      const cleaned = jsCode.replace(/\s+/g, '');
      const hasPir = cleaned.includes("readPIRSensor") || cleaned.includes("readPIRSensor('P2')");
      const hasIf = cleaned.includes('if(') || cleaned.includes('if ');
      const hasMotorOn = cleaned.includes("setMotorSpeed(") && !cleaned.includes("setMotorSpeed(0)");
      const hasMotorOff = cleaned.includes("setMotorSpeed(0)");
      const hasLoop = cleaned.includes('while(') || cleaned.includes('while ') || cleaned.includes('setTimeout') || cleaned.includes('Promise');
      
      if (!jsCode || jsCode.trim() === '') {
        return { success: false, feedback: 'סביבת העבודה ריקה! גררו לבנים כדי לבנות את הקוד.' };
      }
      if (!hasPir) {
        return { success: false, feedback: 'שכחתם לקרוא את הערך מחיישן התנועה! גררו את לבנת "PIR Motion Sensor" למשטח העבודה.' };
      }
      if (!hasIf) {
        return { success: false, feedback: 'השתמשו בלבנת תנאי "אם... אחרת" (if... else) מקטגוריית לוגיקה כדי לבדוק אם יש תנועה!' };
      }
      if (!hasMotorOn) {
        return { success: false, feedback: 'ודאו שאתם מפעילים את המנוע למהירות כלשהי (למשל של 50, בעזרת Motor Speed) כאשר החיישן מזהה תנועה (ערך 1)!' };
      }
      if (!hasMotorOff) {
        return { success: false, feedback: 'ודאו שאתם עוצרים את המנוע (בעזרת Stop Motor או מהירות 0) כאשר אין זיהוי תנועה!' };
      }
      if (!hasLoop) {
        return { success: false, feedback: 'כדי שהמערכת תמשיך לזהות תנועה בשידור חי וללא הפסקה, ודאו שעטפתם הכול בתוך לולאת forever!' };
      }
      
      return { success: true, feedback: 'מדהים ביותר! בניתם מערכת דלת אוטומטית חכמה המבוססת על גלאי תנועה PIR ומנוע! אתם גאוני רובוטיקה אמיתיים! 🚶‍♂️🚪⚙️🏆' };
    }
  },
  {
    id: 10,
    title: '🔇 רחוב שקט - שלט "אסור לצפור" (משימה 10)',
    description: 'בשיעור זה נתכנת שלט חכם למניעת רעש ברחוב עירוני! ברחוב מותקנות שתי נורות (צהובה ואדומה) ושלט "אסור לצפור". ברגע שרמת הרעש שקטה (מתחת ל-100 dBA), הנורה הצהובה תדלק ברחוב בנחת. ברגע שמתרחש רעש חריג או צפירה (החיישן עובר את ה-100 dBA), הנורה האדומה תתחיל להבהב במהירות כדי להזהיר!',
    difficulty: 'מומחה חכם 🏆',
    emoji: '🔇',
    objective: 'לתכנת את המערכת כך שאם חיישן הרעש (Noise level) קטן מ-100 dBA, נורת הלד הצהובה תידלק והאדומה תכבה. וכאשר עוצמת הרעש היא 100 dBA ומעלה, הנורה האדומה תהבהב (הדלקה, המתנה, כיבוי, המתנה) והצהובה תכבה לחלוטין!',
    hints: [
      'נעטוף את כל הקוד בתוך לולאת "לעולמים" (forever) כדי שהמערכת תקשיב לרחוב כל הזמן.',
      'נגרור לבנת "אם... אחרת" (if... else) מקטגוריית לוגיקה.',
      'בתוך התנאי ("אם"): נבדוק האם ערך הלבנה "Noise level" (חיישן הרעש) קטן מ-100.',
      'במידה ופחות מ-100 (שקט ברחוב): נכבה את האדום (Red Led OFF) ונדליק את הצהוב (Yellow Led ON).',
      'במידה ו-100 ומעלה (רעש חזק): נכבה מיד את הצהוב (Yellow Led OFF) ולאחר מכן נרשום את קוד ההבהוב של ה-Red Led: נפעיל אותו (Red Led ON), נמתין חצי שנייה או שנייה (Wait), נכבה אותו (Red Led OFF), ונמתין שוב!'
    ],
    image: noHonkingStreetImg,
    testCode: (jsCode: string) => {
      const cleaned = jsCode.replace(/\s+/g, '');
      const hasSoundSensor = cleaned.includes("soundLevel()");
      const hasIf = cleaned.includes('if(') || cleaned.includes('if ');
      const hasYellow = cleaned.includes("setLedState('yellow',") || cleaned.includes('setLedState("yellow",');
      const hasRed = cleaned.includes("setLedState('red',") || cleaned.includes('setLedState("red",');
      const hasLoop = cleaned.includes('while(') || cleaned.includes('while ') || cleaned.includes('setTimeout') || cleaned.includes('Promise');
      
      if (!jsCode || jsCode.trim() === '') {
        return { success: false, feedback: 'סביבת העבודה ריקה! גררו לבנים כדי לבנות את הקוד.' };
      }
      if (!hasSoundSensor) {
        return { success: false, feedback: 'אופס! שכחתם לקרוא את רמת הרעש מחיישן הרעש (Noise level). גררו את הלבנה "Noise level" מקטגוריית החיישנים למשטח העבודה.' };
      }
      if (!hasIf) {
        return { success: false, feedback: 'השתמשו בלוגיקת תנאי "אם... אחרת" (if... else) כדי לבדוק האם עוצמת הרעש היא מתחת ל-100 dBA או מעל!' };
      }
      if (!hasYellow) {
        return { success: false, feedback: 'ודאו שאתם שולטים בנורת הלד הצהובה (Yellow LED) בהתאם לתנאי הרעש!' };
      }
      if (!hasRed) {
        return { success: false, feedback: 'אל תשכחו לשלוט בנורת הלד האדומה (Red LED) כדי שהיא תוכל להבהב בהתאם כשמזהים רעש חריג!' };
      }
      
      const hasYellowOn = cleaned.includes("setLedState('yellow',1)") || cleaned.includes('setLedState("yellow",1)');
      const hasYellowOff = cleaned.includes("setLedState('yellow',0)") || cleaned.includes('setLedState("yellow",0)');
      const hasRedOn = cleaned.includes("setLedState('red',1)") || cleaned.includes('setLedState("red",1)');
      const hasRedOff = cleaned.includes("setLedState('red',0)") || cleaned.includes('setLedState("red",0)');

      if (!hasYellowOn) {
        return { success: false, feedback: 'זכרו להדליק (ON) את נורת הלד הצהובה (Yellow LED) כשעוצמת הרעש שקטה (מתחת ל-100 dBA).' };
      }
      if (!hasYellowOff) {
        return { success: false, feedback: 'ודאו שאתם מכבים (OFF) את הלד הצהוב (Yellow LED) כאשר מתחיל רעש חזק או צפירות (100 ומעלה).' };
      }
      if (!hasRedOn || !hasRedOff) {
        return { success: false, feedback: 'כדי שהנורה האדומה תוכל להבהב כשרעש עובר את ה-100 dBA, עליכם להדליק (ON) ולכבות (OFF) אותה, בתוספת לבנת המתנה ביניהן!' };
      }
      if (!hasLoop) {
        return { success: false, feedback: 'כדי שהבדיקה תעבוד ברציפות וללא הפסקה עבור כל רכב שנוסע ברחוב, עטפו את כל הלבנות שלכם בלולאת forever!' };
      }
      
      return { success: true, feedback: 'כל הכבוד! בניתם מערכת בטיחות ואיכות סביבה מופלאה למניעת רעש ברחוב שקט! השלט מנצנץ, הרעש מנוטר והלדים מתריעים בדיוק לפי ההנחיות! אתם פשוט אלופי קוד ומהנדסי רובוטיקה מומחים! 🔇🚗🚦🏆🌟' };
    }
  },
  {
    id: 11,
    title: '🌿 חממה חכמה - בקרת אקלים ואיוורור (משימה 11)',
    description: 'בחממות מודרניות מגדלים צמחים רגישים הדורשים אקלים מושלם. במשימה הזו נבנה מערכת בקרת אקלים חכמה: כאשר הטמפרטורה והלחות עולות מעבר לערכים הרצויים, המערכת תפתח את החלון באמצעות מנוע הסרוו ותפעיל את המאוורר כדי לאוורר את החממה!',
    difficulty: 'מהנדס על 🏆🌿',
    emoji: '🌿',
    objective: 'לתכנת את המערכת כך שרק אם רמת הלחות (Moisture) גבוהה מ-60% וגם הטמפרטורה (Temperature) גבוהה מ-30 מעלות צלזיוס, השער/חלון ייפתחו (מנוע סרוו לזווית 180 מעלות) והמאוורר יופעל במהירות 100! אחרת, השער ייסגר (מנוע סרוו לזווית 0 מעלות) והמאוורר ייעצר (מהירות 0 מעלות/Stop)!',
    hints: [
      'נעטוף את כל הקוד בתוך לולאת "לעולמים" (forever) כדי שהמערכת תקשיב למתרחש בחממה כל הזמן ברקע.',
      'נגרור לבנת "אם... אחרת" (if... else) מקטגוריית לוגיקה.',
      'בתוך תנאי ה-"אם", נגרור לבנה לוגית של "וגם" (and) כדי לשלב את שני התנאים.',
      'בתנאי הראשון של ה-"וגם", נבדוק אם "Moisture" גדול מ-60.',
      'בתנאי השני של ה-"וגם", נבדוק אם "Temperature" גדול מ-30 מעלות.',
      'אם שני התנאים מתקיימים יחדיו: נפתח את החלון (Servo Angle ל-180 מעלות) ונפעיל את המאוורר (Motor Speed ל-100).',
      'אחרת (אם אחד התנאים לפחות לא מתקיים): נסגור את החלון (Servo Angle ל-0 מעלות) ונכבה את המאוורר (Stop Motor או Motor Speed ל-0)!'
    ],
    image: smartGreenhouseImg,
    testCode: (jsCode: string) => {
      const cleaned = jsCode.replace(/\s+/g, '');
      const hasMoisture = cleaned.includes("analogRead('P0')") || cleaned.includes('analogRead("P0")');
      const hasTemp = cleaned.includes("temperature()");
      const hasIf = cleaned.includes('if(') || cleaned.includes('if ');
      const hasServoOn = cleaned.includes("setServoAngle(180)") || cleaned.includes("setServoAngle('180')") || cleaned.includes('setServoAngle("180")');
      const hasServoOff = cleaned.includes("setServoAngle(0)") || cleaned.includes("setServoAngle('0')") || cleaned.includes('setServoAngle("0")');
      const hasMotorOn = (cleaned.includes("setMotorSpeed(100)") || cleaned.includes("setMotorSpeed('100')") || cleaned.includes('setMotorSpeed("100")') || (cleaned.includes("setMotorSpeed(") && !cleaned.includes("setMotorSpeed(0)")));
      const hasMotorOff = cleaned.includes("setMotorSpeed(0)");
      const hasLoop = cleaned.includes('while(') || cleaned.includes('while ') || cleaned.includes('setTimeout') || cleaned.includes('Promise');

      if (!jsCode || jsCode.trim() === '') {
        return { success: false, feedback: 'סביבת העבודה ריקה! גררו לבנים כדי לבנות את הקוד.' };
      }
      if (!hasMoisture) {
        return { success: false, feedback: 'אופס! שכחתם לקרוא את הלחות מחיישן הלחות (Moisture). גררו את הלבנה "Moisture" לקוד.' };
      }
      if (!hasTemp) {
        return { success: false, feedback: 'אופס! שכחתם לקרוא את הטמפרטורה מחיישן הטמפרטורה (Temperature). גררו את הלבנה "Temperature" לקוד.' };
      }
      if (!hasIf) {
        return { success: false, feedback: 'השתמשו בלבנת תנאי "אם... אחרת" (if... else) מקטגוריית לוגיקה כדי לבדוק האם התנאים מתקיימים!' };
      }
      if (!hasServoOn) {
        return { success: false, feedback: 'אל תשכחו לכוון את מנוע הסרוו ל-180 מעלות כדי לפתוח את החלון/דלת של החממה כשהתנאים מתקיימים!' };
      }
      if (!hasServoOff) {
        return { success: false, feedback: 'ודאו שאתם סוגרים את חלון הסרוו (0 מעלות) כאשר לפחות אחד מהערכים (טמפרטורה או לחות) תקין ואין צורך באיוורור!' };
      }
      if (!hasMotorOn) {
        return { success: false, feedback: 'שכחתם להפעיל את המאוורר (מנוע) כדי לאוורר את החממה כשהוא חם או לח מדי!' };
      }
      if (!hasMotorOff) {
        return { success: false, feedback: 'ודאו שאתם מכבים את המאוורר (מהירות 0 או עצירת מנוע) כאשר התנאים לא מתקיימים!' };
      }
      if (!hasLoop) {
        return { success: false, feedback: 'כדי שהבדיקה והאוורור יבוצעו כל הזמן ובאופן אוטומטית, ודאו שעטפתם את כל הלבנות בתוך לולאת forever!' };
      }

      return { success: true, feedback: 'מדהים להפליא! הצלחתם לתכנת חממה חכמה ואקולוגית שמבצעת בקרת אקלים ואיוורור אוטומטי בצורה מושלמת! אתם פשוט אלופי קוד ורובוטיקה ברמה הגבוהה ביותר! 🌿🤖⚙️💨🏆' };
    }
  }
];

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const isNarrow = window.innerWidth < 1024;
      setIsMobile(isTouch || isNarrow);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  useEffect(() => {
    const activeTask = LEARNING_TASKS[currentTaskIndex];
    if (activeTask) {
      prepareBoardForTask(activeTask.id);
    }
  }, [currentTaskIndex]);
  
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
      case 'color_sensor':
        name = 'Color Sensor';
        value = 0; // Default: Red
        break;
      case 'sound_sensor':
        name = 'Sound Level Sensor';
        value = 45;
        break;
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

  const prepareBoardForTask = (taskId: number) => {
    let newComponents = JSON.parse(JSON.stringify(INITIAL_COMPONENTS)) as ComponentInstance[];
    
    if (taskId === 8) {
      newComponents = newComponents.map(c => 
        c.port === 'P0' && c.type === 'humidity_sensor'
          ? { ...c, id: 'color-1', type: 'color_sensor', name: 'Color Sensor', value: 0 }
          : c
      );
    } else if (taskId === 9) {
      newComponents = newComponents.map(c => 
        c.port === 'P0' && c.type === 'humidity_sensor'
          ? { ...c, id: 'pir-1', type: 'pir_sensor', name: 'PIR Motion Sensor', value: 0 }
          : c
      );
    } else if (taskId === 10) {
      newComponents = newComponents.map(c => 
        c.port === 'P0' && c.type === 'humidity_sensor'
          ? { ...c, id: 'sound-1', type: 'sound_sensor', name: 'Sound Level Sensor', value: 45 }
          : c
      );
    } else if (taskId === 11) {
      newComponents = newComponents.map(c => {
        if (c.port === 'P0' && c.type === 'humidity_sensor') {
          return { ...c, id: 'hum-1', type: 'humidity_sensor', name: 'Humidity Sensor', value: 75 };
        }
        if (c.port === 'P1' && c.type === 'light_sensor') {
          return { ...c, id: 'temp-1', type: 'temp_sensor', name: 'Temperature Sensor', value: 35 };
        }
        if (c.port === 'P7' && c.type === 'servo') {
          return { ...c, value: 0 };
        }
        return c;
      });
    }
    
    setComponents(newComponents);
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
      readColorSensor: (port: string) => {
        const comp = componentsRef.current.find(c => c.type === 'color_sensor');
        return comp ? comp.value : 0;
      },
      readPIRSensor: (port: string) => {
        const comp = componentsRef.current.find(c => c.type === 'pir_sensor');
        return comp ? comp.value : 0;
      },
      temperature: () => {
        const comp = componentsRef.current.find(c => c.type === 'temp_sensor');
        return comp ? comp.value : 25; // Default temp
      },
      soundLevel: () => {
        const comp = componentsRef.current.find(c => c.type === 'sound_sensor');
        return comp ? comp.value : 50; // Default sound level
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

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#f3f7ff] flex flex-col items-center justify-center p-6 text-center select-none font-sans" dir="ltr">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-md w-full bg-white rounded-3xl border-4 border-amber-400 p-8 shadow-[0_8px_0_#f59e0b] flex flex-col items-center gap-6"
        >
          {/* Animated Illustration: Smartphone / Monitor Switcher */}
          <div className="relative w-32 h-32 flex items-center justify-center bg-amber-50 rounded-full border-2 border-amber-200">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 4, -4, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-amber-500"
            >
              <Monitor className="w-16 h-16 stroke-[2]" />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, -6, 0],
                x: [0, 6, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-4 right-4 bg-red-500 text-white p-2.5 rounded-2xl border-4 border-white shadow-lg"
            >
              <Smartphone className="w-6 h-6 stroke-[2.5]" />
            </motion.div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-normal">
              Screen is too small! 🖥️⚡
            </h1>
            <p className="text-slate-600 text-sm font-bold leading-relaxed px-2">
              The <span className="text-[#ff9f1c] font-black">microbit simlab</span> simulator and Blockly editor require a larger screen and keyboard for the optimal learning, programming, and circuit-building experience.
            </p>
          </div>

          <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex flex-col gap-1.5 text-xs text-slate-500 font-bold">
            <div className="flex items-center justify-center gap-1.5 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Recommended Setup:</span>
            </div>
            <p>Please open this application on a Laptop, Desktop computer, or Tablet in landscape mode.</p>
          </div>

          <p className="text-[11px] text-slate-400 font-semibold tracking-wide">
            Minimum required screen width: 1024px
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f3f7ff] text-slate-800 font-sans">
      <header className="h-20 bg-white border-b-4 border-[#e2e8f0] flex items-center justify-between px-8 shrink-0 z-30 shadow-sm relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-[#4ade80] rounded-2xl flex items-center justify-center text-white shadow-[0_4px_0_#16a34a] border-2 border-white">
               <RefreshCcw className="w-7 h-7" />
             </div>
             <div>
               <h1 className="text-2xl font-black tracking-tight text-[#1e293b] leading-none">microbit <span className="text-[#ff9f1c]">simlab</span></h1>
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
                className="bg-white rounded-[2.5rem] border-4 border-amber-400 shadow-2xl relative w-full h-[85vh] max-w-2xl overflow-hidden flex flex-col z-[100]"
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

                    {LEARNING_TASKS[currentTaskIndex].image && (
                      <div className="w-full h-48 rounded-2xl overflow-hidden border-4 border-slate-100 shadow-sm bg-white relative flex items-center justify-center">
                        <img 
                          src={LEARNING_TASKS[currentTaskIndex].image} 
                          alt={LEARNING_TASKS[currentTaskIndex].title}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Objective (Target) */}
                    <div className="bg-[#f0f9ff] text-sky-800 p-4 rounded-2xl border-2 border-[#bae6fd] flex flex-col gap-1 shadow-sm font-sans">
                      <span className="text-[11px] font-black text-sky-600 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-sky-500" /> המטרה שלכם:
                      </span>
                      <p className="text-xs font-bold leading-relaxed">{LEARNING_TASKS[currentTaskIndex].objective}</p>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          prepareBoardForTask(LEARNING_TASKS[currentTaskIndex].id);
                          showToast('הרכיבים על הלוח סודרו והותאמו למשימה בהצלחה! 🔌', 'success');
                        }}
                        className="mt-3 w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer border border-blue-500"
                      >
                        <span>סדר עבורי את רכיבי הלוח למשימה 🔌</span>
                      </motion.button>
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

                  {/* Back and Next tasks selection with direct number buttons */}
                  <div className="flex flex-col gap-3 shrink-0 bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm mt-auto">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-xs font-black text-slate-700 flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        מעבר מהיר בין משימות:
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          disabled={currentTaskIndex === 0}
                          onClick={() => {
                            setCurrentTaskIndex(prev => prev - 1);
                            setTaskFeedback({ type: null, message: '' });
                          }}
                          className="p-1.5 bg-slate-50 hover:bg-slate-150 disabled:opacity-40 text-slate-800 rounded-lg transition-all cursor-pointer border-2 border-slate-200 disabled:cursor-not-allowed"
                          title="משימה קודמת"
                        >
                          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <button
                          disabled={currentTaskIndex === LEARNING_TASKS.length - 1}
                          onClick={() => {
                            setCurrentTaskIndex(prev => prev + 1);
                            setTaskFeedback({ type: null, message: '' });
                          }}
                          className="p-1.5 bg-slate-50 hover:bg-slate-150 disabled:opacity-40 text-slate-800 rounded-lg transition-all cursor-pointer border-2 border-slate-200 disabled:cursor-not-allowed"
                          title="משימה הבאה"
                        >
                          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {LEARNING_TASKS.map((task, idx) => {
                        const isSelected = currentTaskIndex === idx;
                        const isCompleted = completedTasks.includes(task.id);
                        return (
                          <motion.button
                            key={task.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setCurrentTaskIndex(idx);
                              setTaskFeedback({ type: null, message: '' });
                            }}
                            className={`h-9 w-9 text-xs font-black rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer relative
                              ${isSelected 
                                ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-[0_2.5px_0_#d97706]' 
                                : isCompleted
                                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-[0_2.5px_0_#10b981]'
                                  : 'bg-slate-50 border-slate-250 text-slate-700 hover:bg-slate-100 shadow-[0_2.5px_0_#cbd5e1]'
                              }
                            `}
                          >
                            <span>{task.id}</span>
                            {isCompleted && !isSelected && (
                              <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-emerald-400 border border-white animate-pulse" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
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
