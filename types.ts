export interface ItineraryActivity {
  time: string;
  activity: string;
  description: string;
  location: string;
  tips?: string;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  activities: ItineraryActivity[];
}

export interface Itinerary {
  destination: string;
  duration: string;
  itinerary: ItineraryDay[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets?: {
            snippet?: string;
            author?: string;
        }[];
    };
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
  groundingChunks?: GroundingChunk[];
}

export enum TripVibe {
  RELAXED = 'Relaxed',
  ADVENTURE = 'Adventure',
  CULTURAL = 'Cultural',
  FOODIE = 'Foodie',
  FAMILY = 'Family',
  LUXURY = 'Luxury'
}