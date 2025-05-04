export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      company_requests: {
        Row: {
          company_name: string
          company_size: string | null
          company_website: string | null
          contact_name: string
          created_at: string
          estimated_duration: string | null
          id: string
          is_asap: boolean | null
          monthly_budget: string | null
          notes: string | null
          profile_id: string | null
          role: string | null
          start_date: string | null
          status: string
          time_zone_overlap: string | null
          time_zone_region: string | null
          updated_at: string
          user_id: string | null
          weekly_hours: string | null
          work_email: string
        }
        Insert: {
          company_name: string
          company_size?: string | null
          company_website?: string | null
          contact_name: string
          created_at?: string
          estimated_duration?: string | null
          id?: string
          is_asap?: boolean | null
          monthly_budget?: string | null
          notes?: string | null
          profile_id?: string | null
          role?: string | null
          start_date?: string | null
          status?: string
          time_zone_overlap?: string | null
          time_zone_region?: string | null
          updated_at?: string
          user_id?: string | null
          weekly_hours?: string | null
          work_email: string
        }
        Update: {
          company_name?: string
          company_size?: string | null
          company_website?: string | null
          contact_name?: string
          created_at?: string
          estimated_duration?: string | null
          id?: string
          is_asap?: boolean | null
          monthly_budget?: string | null
          notes?: string | null
          profile_id?: string | null
          role?: string | null
          start_date?: string | null
          status?: string
          time_zone_overlap?: string | null
          time_zone_region?: string | null
          updated_at?: string
          user_id?: string | null
          weekly_hours?: string | null
          work_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_roles: {
        Row: {
          created_at: string
          id: string
          job_description: string | null
          nice_to_have_skills: string | null
          number_of_developers: number | null
          preferred_languages: Json | null
          request_id: string
          required_tech_stack: Json | null
          role_title: string | null
          seniority_level: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_description?: string | null
          nice_to_have_skills?: string | null
          number_of_developers?: number | null
          preferred_languages?: Json | null
          request_id: string
          required_tech_stack?: Json | null
          role_title?: string | null
          seniority_level?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          job_description?: string | null
          nice_to_have_skills?: string | null
          number_of_developers?: number | null
          preferred_languages?: Json | null
          request_id?: string
          required_tech_stack?: Json | null
          role_title?: string | null
          seniority_level?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_roles_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "company_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      matched_developers: {
        Row: {
          created_at: string
          developer_name: string
          developer_skills: Json | null
          hourly_rate: number | null
          id: string
          notes: string | null
          request_id: string
          role_id: string | null
          seniority_level: string | null
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          developer_name: string
          developer_skills?: Json | null
          hourly_rate?: number | null
          id?: string
          notes?: string | null
          request_id: string
          role_id?: string | null
          seniority_level?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          developer_name?: string
          developer_skills?: Json | null
          hourly_rate?: number | null
          id?: string
          notes?: string | null
          request_id?: string
          role_id?: string | null
          seniority_level?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matched_developers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "company_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matched_developers_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "developer_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: "company" | "candidate" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_type: ["company", "candidate", "admin"],
    },
  },
} as const
