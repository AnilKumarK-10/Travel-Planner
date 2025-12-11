import { GoogleGenAI, Type, Schema, FunctionDeclaration } from "@google/genai";
import { Itinerary } from "../types";

// Initialize the client
// Using process.env.API_KEY as strictly required by instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ITINERARY_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING, description: "The destination city or country." },
    duration: { type: Type.STRING, description: "Duration of the trip (e.g., '3 Days')." },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "Day number." },
          theme: { type: Type.STRING, description: "Theme for the day." },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "Suggested time (e.g., '10:00 AM')." },
                activity: { type: Type.STRING, description: "Name of the activity." },
                description: { type: Type.STRING, description: "Brief description of what to do." },
                location: { type: Type.STRING, description: "Name of the location/venue." },
                tips: { type: Type.STRING, description: "Practical travel tip for this activity." }
              },
              required: ["time", "activity", "description", "location"]
            }
          }
        },
        required: ["day", "theme", "activities"]
      }
    }
  },
  required: ["destination", "duration", "itinerary"]
};

export const generateItinerary = async (
  destination: string,
  days: number,
  vibe: string,
  interests: string
): Promise<Itinerary> => {
  const prompt = `Plan a ${days}-day trip to ${destination}. The vibe should be ${vibe}. User interests: ${interests}. 
  Provide a detailed, structured itinerary.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ITINERARY_SCHEMA
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");
    return JSON.parse(text) as Itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};

export const createChatSession = (location?: GeolocationCoordinates) => {
  // Setup tool config if location is available
  const toolConfig = location ? {
    retrievalConfig: {
      latLng: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    }
  } : undefined;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: "You are an expert, friendly travel agent helping users plan trips, find places, and check local information. Be concise but helpful. Use the map tool to find specific locations when asked.",
      tools: [
        { googleSearch: {} },
        { googleMaps: {} }
      ],
      toolConfig: toolConfig
    }
  });
};