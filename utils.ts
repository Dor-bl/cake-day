import { GoogleGenAI, Type } from "@google/genai";
import { Birthday, BirthdayWithCalculations, RelationType } from './types';

export const calculateBirthdayInfo = (birthday: Birthday): BirthdayWithCalculations => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const birthDate = new Date(birthday.dateOfBirth);
  // Need to adjust for timezone issues when parsing "YYYY-MM-DD"
  // Creating date from string parts ensures local time consistency
  const [y, m, d] = birthday.dateOfBirth.split('-').map(Number);
  const birthDateLocal = new Date(y, m - 1, d);

  const currentYear = today.getFullYear();
  let nextBirthday = new Date(currentYear, birthDateLocal.getMonth(), birthDateLocal.getDate());

  if (nextBirthday < today) {
    nextBirthday = new Date(currentYear + 1, birthDateLocal.getMonth(), birthDateLocal.getDate());
  }

  const diffTime = nextBirthday.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const isToday = daysRemaining === 0;
  
  // Calculate age they are turning
  let ageTurning = nextBirthday.getFullYear() - birthDateLocal.getFullYear();

  return {
    ...birthday,
    daysRemaining,
    ageTurning,
    nextBirthdayDate: nextBirthday,
    isToday
  };
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(date);
};

export const getOrdinalSuffix = (i: number): string => {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
};

// Static fallback suggestions
export const getStaticGiftSuggestions = (relation: RelationType, age: number): string[] => {
  // Children
  if (age <= 12) {
    return ['Lego/Building Set', 'Board Game', 'Art Supplies', 'Science Kit'];
  }
  // Teens
  if (age <= 18) {
    return ['Gift Card', 'Headphones', 'Trendy Apparel', 'Video Game'];
  }

  // Adults
  switch (relation) {
    case RelationType.FAMILY:
      return ['Photo Album', 'Home Decor', 'Kitchen Gadget', 'Cozy Blanket'];
    case RelationType.WORK:
      return ['Desk Plant', 'Quality Pen', 'Coffee Voucher', 'Tech Accessory'];
    case RelationType.FRIEND:
    default:
      return ['Concert Tickets', 'Restaurant Voucher', 'Best-selling Book', 'Local Experience'];
  }
};

// AI Powered suggestions
export const generateGiftSuggestions = async (relation: RelationType, age: number, name: string): Promise<string[]> => {
  try {
    // Safe access for browser environment where process might be undefined
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      console.warn("API Key is missing or invalid (placeholder detected). Using static suggestions.");
      return getStaticGiftSuggestions(relation, age);
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // We use gemini-3-flash-preview for fast, creative text generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `List 4 specific, creative, and short gift ideas for a ${age} year old ${relation} named ${name}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.ARRAY,
           items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return getStaticGiftSuggestions(relation, age);

    const ideas = JSON.parse(text);
    if (Array.isArray(ideas) && ideas.length > 0) {
      return ideas;
    }
    
    return getStaticGiftSuggestions(relation, age);
  } catch (error) {
    console.error("Gemini API failed or not configured, using fallback:", error);
    return getStaticGiftSuggestions(relation, age);
  }
};