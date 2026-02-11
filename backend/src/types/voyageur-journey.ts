// Voyageur Journey Simulator Types
// These types can be shared with the frontend for end-to-end type safety

// Choice within a journey node
export interface JourneyChoice {
  id: string;
  text: string;
  nextNodeId: string;
  consequence?: string;
  pointsChange?: number;
}

// A single node in the journey (story point, choice, or ending)
export interface JourneyNode {
  id: string;
  journeyId: string;
  nodeType: "story" | "choice" | "challenge" | "ending";
  orderIndex: number;
  title: string | null;
  narrative: string;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  choices: JourneyChoice[] | null;
  challengeQuestion: string | null;
  challengeAnswer: string | null;
  historicalFact: string | null;
  audioUrl: string | null;
  songLyrics: string | null;
  isEnding: boolean;
  endingType: "success" | "partial" | "retry" | null;
  createdAt: string;
}

// Journey summary for list view
export interface VoyageurJourneySummary {
  id: string;
  title: string;
  description: string;
  gradeLevel: string;
  difficulty: string;
  estimatedMinutes: number;
  coverImageUrl: string | null;
  startingLocation: string;
  endingLocation: string;
  historicalYear: number | null;
  createdAt: string;
  nodeCount: number;
}

// Full journey with all nodes
export interface VoyageurJourney {
  id: string;
  title: string;
  description: string;
  gradeLevel: string;
  difficulty: string;
  estimatedMinutes: number;
  coverImageUrl: string | null;
  startingLocation: string;
  endingLocation: string;
  historicalYear: number | null;
  isPublished: boolean;
  nodes: JourneyNode[];
  createdAt: string;
  updatedAt: string;
}

// User's progress through a journey
export interface UserJourneyProgress {
  id: string;
  currentNodeId: string | null;
  choicesMade: string[];
  score: number;
  status: "in_progress" | "completed" | "abandoned";
  startedAt: string;
  completedAt: string | null;
}

// Journey info (subset of VoyageurJourney)
export interface JourneyInfo {
  id: string;
  title: string;
  description: string;
  startingLocation: string;
  endingLocation: string;
  historicalYear: number | null;
}

// Response types for API endpoints

// GET /api/voyageur-journeys
export interface ListJourneysResponse {
  data: VoyageurJourneySummary[];
}

// GET /api/voyageur-journeys/:id
export interface GetJourneyResponse {
  data: VoyageurJourney;
}

// GET /api/voyageur-journeys/:id/start
export interface StartJourneyResponse {
  data: {
    progress: UserJourneyProgress;
    currentNode: JourneyNode;
    journey: JourneyInfo;
  };
}

// POST /api/voyageur-journeys/:id/choice
export interface MakeChoiceRequest {
  userId: string;
  nodeId: string;
  choiceId: string;
}

export interface ChoiceMadeInfo {
  choiceId: string;
  text: string;
  consequence?: string;
  pointsChange: number;
}

export interface MakeChoiceResponse {
  data: {
    choiceMade: ChoiceMadeInfo;
    progress: UserJourneyProgress;
    currentNode: JourneyNode;
    isEnding: boolean;
    endingType: "success" | "partial" | "retry" | null;
  };
}

// GET /api/voyageur-journeys/:id/progress
export interface GetProgressResponse {
  data: {
    hasProgress: boolean;
    progress: UserJourneyProgress | null;
    currentNode: JourneyNode | null;
    journey?: JourneyInfo;
  };
}
