
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

// Converts a File object to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export const identifyPlantFromImage = async (imageFile: File): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `You are an expert botanist and gardening assistant named Flora. Identify the plant in this image. Provide its common and scientific names. Then, give detailed, easy-to-understand care instructions. The instructions should cover: 
- **Watering:** Frequency and amount.
- **Sunlight:** Requirements (e.g., direct sun, partial shade).
- **Soil:** Ideal type and pH.
- **Fertilizing:** Schedule and type.
- **Common Pests & Diseases:** What to watch out for and how to treat them.
Format the entire response as a single block of well-structured markdown. Use headings and bullet points for clarity.`;

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [
        { text: prompt },
        imagePart
      ]}
    });
    
    return response.text;
  } catch (error) {
    console.error("Error identifying plant:", error);
    if (error instanceof Error) {
        return `An error occurred while identifying the plant: ${error.message}. Please try again.`;
    }
    return 'An unknown error occurred while identifying the plant. Please try again.';
  }
};
