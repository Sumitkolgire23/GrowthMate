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
          stat_points: number
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
          stat_points?: number
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
          stat_points?: number
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
          effort_level: string | null
          completion_notes: string | null
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
          effort_level?: string | null
          completion_notes?: string | null
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
          effort_level?: string | null
          completion_notes?: string | null
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
      unlocked_skills: {
        Row: {
          id: string
          profile_id: string
          skill_name: string
          progress: number
          unlocked_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          skill_name: string
          progress?: number
          unlocked_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          skill_name?: string
          progress?: number
          unlocked_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unlocked_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_achievements: {
        Row: {
          id: string
          profile_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          achievement_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          achievement_id?: string
          unlocked_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      purchased_rewards: {
        Row: {
          id: string
          profile_id: string
          item_id: string
          item_name: string
          item_category: string
          cost: number
          purchased_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          item_id: string
          item_name: string
          item_category: string
          cost: number
          purchased_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          item_id?: string
          item_name?: string
          item_category?: string
          cost?: number
          purchased_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchased_rewards_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
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
