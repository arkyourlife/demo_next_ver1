export interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
  type?: 'text' | 'university-recommendation' | 'plan-update'
}

export interface University {
  id: string
  name: string
  nameEn: string
  country: string
  city: string
  ranking: {
    world?: number
    country?: number
    subject?: number
  }
  requirements: {
    gpa: string
    ielts?: string
    toefl?: string
    gre?: string
    gmat?: string
  }
  tuition: {
    local: string
    international: string
  }
  programs: string[]
  description: string
  website: string
  image?: string
  matchScore?: number
}

export interface StudyPlan {
  id: string
  title: string
  targetCountry: string
  targetMajor: string
  targetDegree: string
  timeline: PlanStep[]
  universities: University[]
  requirements: {
    language: string
    standardTest: string
    gpa: string
    experience: string
  }
  progress: number
  createdAt: Date
  updatedAt: Date
}

export interface PlanStep {
  id: string
  title: string
  description: string
  deadline: Date
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  category: 'exam' | 'application' | 'document' | 'other'
}

export interface UserProfile {
  currentEducation: string
  gpa: string
  major: string
  targetCountry: string[]
  targetMajor: string[]
  budget: string
  preferences: {
    location: string[]
    schoolSize: string
    climate: string
  }
} 