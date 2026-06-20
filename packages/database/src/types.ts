export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      assessment_responses: {
        Row: {
          computed_stats: Json
          created_at: string
          id: string
          profile_id: string
          raw_answers: Json
        }
        Insert: {
          computed_stats: Json
          created_at?: string
          id?: string
          profile_id: uuid
          raw_answers: Json
        }
        Update: {
          computed_stats?: Json
          created_at?: string
          id?: string
          profile_id?: uuid
          raw_answers?: Json
        }
        Relationships: [
          {
            foreignKeyName: "assessment_responses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          energy: number
          engagement: number
          gold: number
          id: string
          level: number
          name: string | null
          xp: number
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          energy?: number
          engagement?: number
          gold?: number
          id: string
          level?: number
          name?: string | null
          xp?: number
        }
        Update: {
          avatar?: string | null
          created_at?: string
          energy?: number
          engagement?: number
          gold?: number
          id?: string
          level?: number
          name?: string | null
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      quests: {
        Row: {
          category: string
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string
          gold_reward: number
          id: string
          profile_id: string
          rank: string
          stats_affected: string[]
          title: string
          xp_reward: number
        }
        Insert: {
          category: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description: string
          gold_reward: number
          id?: string
          profile_id: string
          rank: string
          stats_affected: string[]
          title: string
          xp_reward: number
        }
        Update: {
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string
          gold_reward?: number
          id?: string
          profile_id?: string
          rank?: string
          stats_affected?: string[]
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "quests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      stats: {
        Row: {
          creativity: number
          experience: number
          intelligence: number
          knowledge: number
          productivity: number
          profile_id: string
          resilience: number
          updated_at: string
        }
        Insert: {
          creativity?: number
          experience?: number
          intelligence?: number
          knowledge?: number
          productivity?: number
          profile_id: string
          resilience?: number
          updated_at?: string
        }
        Update: {
          creativity?: number
          experience?: number
          intelligence?: number
          knowledge?: number
          productivity?: number
          profile_id?: string
          resilience?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stats_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type uuid = string
