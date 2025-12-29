
export enum InterviewStatus {
  IDLE = 'IDLE',
  SETUP = 'SETUP',
  INTERVIEWING = 'INTERVIEWING',
  REVIEWING = 'REVIEWING',
  COMPLETED = 'COMPLETED',
  PROFILE = 'PROFILE',
  AUTH = 'AUTH'
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;
  avatarSeed?: string;
}

export interface InterviewSession {
  id: string;
  date: string;
  role: string;
  level: string;
  company: string;
  description: string;
  transcription: string[];
  feedback?: InterviewFeedback;
  proctoringEnabled: boolean;
}

export interface InterviewFeedback {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface AudioConfig {
  sampleRate: number;
  numChannels: number;
}
