export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_dictation_cache: {
        Row: {
          created_at: string | null
          input_hash: string
          mode: string
          result: Json
        }
        Insert: {
          created_at?: string | null
          input_hash: string
          mode: string
          result: Json
        }
        Update: {
          created_at?: string | null
          input_hash?: string
          mode?: string
          result?: Json
        }
        Relationships: []
      }
      ai_dictation_usage: {
        Row: {
          count: number
          used_on: string
          user_id: string
        }
        Insert: {
          count?: number
          used_on: string
          user_id: string
        }
        Update: {
          count?: number
          used_on?: string
          user_id?: string
        }
        Relationships: []
      }
      app_config: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      avatar_placeholders: {
        Row: {
          id: number
          path: string
        }
        Insert: {
          id?: number
          path: string
        }
        Update: {
          id?: number
          path?: string
        }
        Relationships: []
      }
      blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string | null
          recipe_id: string
          saved_from_user_id: string | null
          saved_source: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          recipe_id: string
          saved_from_user_id?: string | null
          saved_source?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          recipe_id?: string
          saved_from_user_id?: string | null
          saved_source?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "bookmarks_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_saved_from_user_id_fkey"
            columns: ["saved_from_user_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookmarks_saved_from_user_id_fkey"
            columns: ["saved_from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_saved_from_user_id_fkey"
            columns: ["saved_from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author: string | null
          body: string
          created_at: string | null
          id: string
          recipe_id: string | null
        }
        Insert: {
          author?: string | null
          body: string
          created_at?: string | null
          id?: string
          recipe_id?: string | null
        }
        Update: {
          author?: string | null
          body?: string
          created_at?: string | null
          id?: string
          recipe_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comments_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "comments_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reports: {
        Row: {
          context_recipe_id: string | null
          created_at: string
          id: string
          note: string | null
          reason: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          target_id: string
          target_type: string
        }
        Insert: {
          context_recipe_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          reason: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          target_id: string
          target_type: string
        }
        Update: {
          context_recipe_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          reason?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      cooked_recipe_events: {
        Row: {
          cooked_at: string
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          cooked_at?: string
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          cooked_at?: string
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cooked_recipe_events_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cooked_recipe_events_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "cooked_recipe_events_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cooked_recipe_events_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cooked_recipe_events_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      cooked_recipes: {
        Row: {
          cooked_at: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          cooked_at?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          cooked_at?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cooked_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cooked_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "cooked_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cooked_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cooked_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          followed_id: string
          follower_id: string
        }
        Insert: {
          created_at?: string | null
          followed_id: string
          follower_id: string
        }
        Update: {
          created_at?: string | null
          followed_id?: string
          follower_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "follows_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
        ]
      }
      force_update_users: {
        Row: {
          created_at: string
          reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "likes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_delivery_log: {
        Row: {
          created_at: string
          id: string
          idempotency_key: string | null
          notification_id: string | null
          notification_type: string
          sent_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idempotency_key?: string | null
          notification_id?: string | null
          notification_type: string
          sent_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idempotency_key?: string | null
          notification_id?: string | null
          notification_type?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_delivery_log_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_delivery_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notification_delivery_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_delivery_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_milestones: {
        Row: {
          id: string
          milestone_type: string
          notified_at: string
          recipe_id: string
          threshold: number
        }
        Insert: {
          id?: string
          milestone_type: string
          notified_at?: string
          recipe_id: string
          threshold: number
        }
        Update: {
          id?: string
          milestone_type?: string
          notified_at?: string
          recipe_id?: string
          threshold?: number
        }
        Relationships: [
          {
            foreignKeyName: "notification_milestones_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_milestones_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "notification_milestones_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_milestones_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_milestones_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          cooked_your_recipe: boolean
          friday_inspiration: boolean
          milestone_cooked: boolean
          milestone_likes: boolean
          new_from_followed: boolean
          re_engagement: boolean
          trending: boolean
          updated_at: string
          user_id: string
          weekly_digest: boolean
          weekly_saves_digest: boolean
          welcome: boolean
        }
        Insert: {
          cooked_your_recipe?: boolean
          friday_inspiration?: boolean
          milestone_cooked?: boolean
          milestone_likes?: boolean
          new_from_followed?: boolean
          re_engagement?: boolean
          trending?: boolean
          updated_at?: string
          user_id: string
          weekly_digest?: boolean
          weekly_saves_digest?: boolean
          welcome?: boolean
        }
        Update: {
          cooked_your_recipe?: boolean
          friday_inspiration?: boolean
          milestone_cooked?: boolean
          milestone_likes?: boolean
          new_from_followed?: boolean
          re_engagement?: boolean
          trending?: boolean
          updated_at?: string
          user_id?: string
          weekly_digest?: boolean
          weekly_saves_digest?: boolean
          welcome?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          payload: Json | null
          read_at: string | null
          recipe_id: string | null
          recipient_id: string
          type: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          read_at?: string | null
          recipe_id?: string | null
          recipient_id: string
          type: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          read_at?: string | null
          recipe_id?: string | null
          recipient_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "notifications_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_access_grants: {
        Row: {
          expires_at: string | null
          granted_at: string
          id: string
          source: string
          source_id: string | null
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          id?: string
          source: string
          source_id?: string | null
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          id?: string
          source?: string
          source_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_custom_path: string | null
          avatar_placeholder_key: string | null
          avatar_source: Database["public"]["Enums"]["avatar_source"]
          bio: string | null
          created_at: string | null
          deleted_at: string | null
          display_name: string | null
          id: string
          is_founding_cook: boolean
          is_premium: boolean
          last_opened_at: string | null
          pinned_recipe_id: string | null
          privacy: string | null
          referral_code: string | null
          updated_at: string | null
          username: string | null
          vibe_phrases: string[] | null
        }
        Insert: {
          avatar_custom_path?: string | null
          avatar_placeholder_key?: string | null
          avatar_source?: Database["public"]["Enums"]["avatar_source"]
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_name?: string | null
          id: string
          is_founding_cook?: boolean
          is_premium?: boolean
          last_opened_at?: string | null
          pinned_recipe_id?: string | null
          privacy?: string | null
          referral_code?: string | null
          updated_at?: string | null
          username?: string | null
          vibe_phrases?: string[] | null
        }
        Update: {
          avatar_custom_path?: string | null
          avatar_placeholder_key?: string | null
          avatar_source?: Database["public"]["Enums"]["avatar_source"]
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_name?: string | null
          id?: string
          is_founding_cook?: boolean
          is_premium?: boolean
          last_opened_at?: string | null
          pinned_recipe_id?: string | null
          privacy?: string | null
          referral_code?: string | null
          updated_at?: string | null
          username?: string | null
          vibe_phrases?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_pinned_recipe_fk"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_fk"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_fk"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_fk"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_fk"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_id_fkey"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_id_fkey"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_id_fkey"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_id_fkey"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_id_fkey"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_code_redemptions: {
        Row: {
          id: string
          promo_code_id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          id?: string
          promo_code_id: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          id?: string
          promo_code_id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_redemptions_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          current_uses: number
          description: string | null
          expires_at: string | null
          grant_duration_days: number | null
          id: string
          is_active: boolean
          max_uses: number | null
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number
          description?: string | null
          expires_at?: string | null
          grant_duration_days?: number | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number
          description?: string | null
          expires_at?: string | null
          grant_duration_days?: number | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
        }
        Relationships: []
      }
      push_tokens: {
        Row: {
          created_at: string
          id: string
          platform: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "push_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_photos: {
        Row: {
          created_at: string
          id: string
          position: number
          recipe_id: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          position?: number
          recipe_id: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: number
          recipe_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_photos_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_photos_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_photos_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_photos_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_photos_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ratings: {
        Row: {
          rating: number
          recipe_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          rating: number
          recipe_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          rating?: number
          recipe_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ratings_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ratings_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_ratings_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ratings_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ratings_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_reactions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_reactions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_reactions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_reactions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_reactions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recipe_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_smart_tags: {
        Row: {
          created_at: string
          recipe_id: string
          tag_key: string
        }
        Insert: {
          created_at?: string
          recipe_id: string
          tag_key: string
        }
        Update: {
          created_at?: string
          recipe_id?: string
          tag_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_smart_tags_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_smart_tags_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_smart_tags_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_smart_tags_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_smart_tags_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_smart_tags_tag_key_fkey"
            columns: ["tag_key"]
            isOneToOne: false
            referencedRelation: "smart_tags"
            referencedColumns: ["key"]
          },
        ]
      }
      recipe_stats: {
        Row: {
          average_rating: number | null
          bookmarks_count: number
          cooked_count: number
          likes_count: number
          ratings_count: number
          recipe_id: string
          remixes_count: number
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          bookmarks_count?: number
          cooked_count?: number
          likes_count?: number
          ratings_count?: number
          recipe_id: string
          remixes_count?: number
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          bookmarks_count?: number
          cooked_count?: number
          likes_count?: number
          ratings_count?: number
          recipe_id?: string
          remixes_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_stats_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: true
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_stats_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: true
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_stats_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: true
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_stats_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: true
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_stats_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: true
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          author: string | null
          author_id: string | null
          contains_allergens: string[]
          cook_time_minutes: number | null
          created_at: string | null
          cuisine_primary: string | null
          cuisine_secondary: string[]
          deleted_at: string | null
          deleted_reason: string | null
          dietary: string[]
          difficulty: string | null
          dish_types: string[]
          flavor_notes: string[]
          id: string
          ingredients: string
          instructions: string | null
          is_private: boolean
          main_ingredients: string[]
          meal_types: string[]
          methods: string[]
          moderated_at: string | null
          moderated_by: string | null
          moderation_reason: string | null
          moderation_status: string
          occasions: string[]
          parent_id: string | null
          photos: string[] | null
          prep_time_minutes: number | null
          search_tsv: unknown
          search_vec: unknown
          servings: number | null
          smart_tags_confirmed: boolean
          spice_level: string | null
          steps: string
          tags: string[] | null
          title: string
          total_time_minutes: number | null
          updated_at: string | null
          visibility: string
        }
        Insert: {
          author?: string | null
          author_id?: string | null
          contains_allergens?: string[]
          cook_time_minutes?: number | null
          created_at?: string | null
          cuisine_primary?: string | null
          cuisine_secondary?: string[]
          deleted_at?: string | null
          deleted_reason?: string | null
          dietary?: string[]
          difficulty?: string | null
          dish_types?: string[]
          flavor_notes?: string[]
          id?: string
          ingredients: string
          instructions?: string | null
          is_private?: boolean
          main_ingredients?: string[]
          meal_types?: string[]
          methods?: string[]
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_status?: string
          occasions?: string[]
          parent_id?: string | null
          photos?: string[] | null
          prep_time_minutes?: number | null
          search_tsv?: unknown
          search_vec?: unknown
          servings?: number | null
          smart_tags_confirmed?: boolean
          spice_level?: string | null
          steps: string
          tags?: string[] | null
          title: string
          total_time_minutes?: number | null
          updated_at?: string | null
          visibility?: string
        }
        Update: {
          author?: string | null
          author_id?: string | null
          contains_allergens?: string[]
          cook_time_minutes?: number | null
          created_at?: string | null
          cuisine_primary?: string | null
          cuisine_secondary?: string[]
          deleted_at?: string | null
          deleted_reason?: string | null
          dietary?: string[]
          difficulty?: string | null
          dish_types?: string[]
          flavor_notes?: string[]
          id?: string
          ingredients?: string
          instructions?: string | null
          is_private?: boolean
          main_ingredients?: string[]
          meal_types?: string[]
          methods?: string[]
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_status?: string
          occasions?: string[]
          parent_id?: string | null
          photos?: string[] | null
          prep_time_minutes?: number | null
          search_tsv?: unknown
          search_vec?: unknown
          servings?: number | null
          smart_tags_confirmed?: boolean
          spice_level?: string | null
          steps?: string
          tags?: string[] | null
          title?: string
          total_time_minutes?: number | null
          updated_at?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_author_fk"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recipes_author_fk"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_fk"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recipes_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recipes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_redemptions: {
        Row: {
          id: string
          redeemed_at: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          id?: string
          redeemed_at?: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          id?: string
          redeemed_at?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: []
      }
      saved_recipes: {
        Row: {
          created_at: string
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "saved_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "saved_recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_tags: {
        Row: {
          created_at: string
          group_key: string
          is_active: boolean
          key: string
          label: string
          sort_order: number
          value: string
        }
        Insert: {
          created_at?: string
          group_key: string
          is_active?: boolean
          key: string
          label: string
          sort_order?: number
          value: string
        }
        Update: {
          created_at?: string
          group_key?: string
          is_active?: boolean
          key?: string
          label?: string
          sort_order?: number
          value?: string
        }
        Relationships: []
      }
      smart_tags_ai_cache: {
        Row: {
          created_at: string
          input_hash: string
          response: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          input_hash: string
          response: Json
          user_id: string
        }
        Update: {
          created_at?: string
          input_hash?: string
          response?: Json
          user_id?: string
        }
        Relationships: []
      }
      smart_tags_ai_usage: {
        Row: {
          count: number
          used_on: string
          user_id: string
        }
        Insert: {
          count?: number
          used_on: string
          user_id: string
        }
        Update: {
          count?: number
          used_on?: string
          user_id?: string
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
        }
        Relationships: []
      }
      user_entitlements: {
        Row: {
          dictation: boolean
          is_premium: boolean
          private_recipes: boolean
          surprise_me_last_used_at: string | null
          surprise_me_use_count: number
          trial_active: boolean
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          dictation?: boolean
          is_premium?: boolean
          private_recipes?: boolean
          surprise_me_last_used_at?: string | null
          surprise_me_use_count?: number
          trial_active?: boolean
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          dictation?: boolean
          is_premium?: boolean
          private_recipes?: boolean
          surprise_me_last_used_at?: string | null
          surprise_me_use_count?: number
          trial_active?: boolean
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      following_recipes: {
        Row: {
          author: string | null
          created_at: string | null
          follower_id: string | null
          id: string | null
          ingredients: string | null
          instructions: string | null
          parent_id: string | null
          photos: string[] | null
          steps: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_fk"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recipes_author_fk"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_fk"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recipes_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_counters: {
        Row: {
          followers_count: number | null
          following_count: number | null
          recipes_count: number | null
          user_id: string | null
        }
        Relationships: []
      }
      profiles_visible: {
        Row: {
          avatar_custom_path: string | null
          avatar_placeholder_key: string | null
          avatar_source: Database["public"]["Enums"]["avatar_source"] | null
          bio: string | null
          created_at: string | null
          deleted_at: string | null
          display_name: string | null
          id: string | null
          is_founding_cook: boolean | null
          is_premium: boolean | null
          pinned_recipe_id: string | null
          privacy: string | null
          referral_code: string | null
          updated_at: string | null
          username: string | null
          vibe_phrases: string[] | null
        }
        Insert: {
          avatar_custom_path?: string | null
          avatar_placeholder_key?: string | null
          avatar_source?: Database["public"]["Enums"]["avatar_source"] | null
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_name?: string | null
          id?: string | null
          is_founding_cook?: boolean | null
          is_premium?: boolean | null
          pinned_recipe_id?: string | null
          privacy?: string | null
          referral_code?: string | null
          updated_at?: string | null
          username?: string | null
          vibe_phrases?: string[] | null
        }
        Update: {
          avatar_custom_path?: string | null
          avatar_placeholder_key?: string | null
          avatar_source?: Database["public"]["Enums"]["avatar_source"] | null
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_name?: string | null
          id?: string | null
          is_founding_cook?: boolean | null
          is_premium?: boolean | null
          pinned_recipe_id?: string | null
          privacy?: string | null
          referral_code?: string | null
          updated_at?: string | null
          username?: string | null
          vibe_phrases?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_pinned_recipe_fk"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_fk"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_fk"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_fk"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_fk"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_id_fkey"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_id_fkey"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_id_fkey"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_id_fkey"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_pinned_recipe_id_fkey"
            columns: ["pinned_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_reaction_counts: {
        Row: {
          count: number | null
          emoji: string | null
          recipe_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_reactions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_reactions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_reactions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_reactions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_reactions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_stats_view: {
        Row: {
          reaction_count: number | null
          recipe_id: string | null
          save_count: number | null
          version_count: number | null
        }
        Relationships: []
      }
      recipes_visible: {
        Row: {
          author: string | null
          author_id: string | null
          author_uid: string | null
          contains_allergens: string[] | null
          created_at: string | null
          cuisine_primary: string | null
          cuisine_secondary: string[] | null
          deleted_at: string | null
          deleted_reason: string | null
          dietary: string[] | null
          difficulty: string | null
          dish_types: string[] | null
          flavor_notes: string[] | null
          id: string | null
          ingredients: string | null
          instructions: string | null
          is_private: boolean | null
          main_ingredients: string[] | null
          meal_types: string[] | null
          methods: string[] | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_reason: string | null
          moderation_status: string | null
          occasions: string[] | null
          parent_id: string | null
          photos: string[] | null
          search_tsv: unknown
          search_vec: unknown
          servings: number | null
          smart_tags_confirmed: boolean | null
          spice_level: string | null
          steps: string | null
          tags: string[] | null
          title: string | null
          total_time_minutes: number | null
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          author?: string | null
          author_id?: string | null
          author_uid?: never
          contains_allergens?: string[] | null
          created_at?: string | null
          cuisine_primary?: string | null
          cuisine_secondary?: string[] | null
          deleted_at?: string | null
          deleted_reason?: string | null
          dietary?: string[] | null
          difficulty?: string | null
          dish_types?: string[] | null
          flavor_notes?: string[] | null
          id?: string | null
          ingredients?: string | null
          instructions?: string | null
          is_private?: boolean | null
          main_ingredients?: string[] | null
          meal_types?: string[] | null
          methods?: string[] | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_status?: string | null
          occasions?: string[] | null
          parent_id?: string | null
          photos?: string[] | null
          search_tsv?: unknown
          search_vec?: unknown
          servings?: number | null
          smart_tags_confirmed?: boolean | null
          spice_level?: string | null
          steps?: string | null
          tags?: string[] | null
          title?: string | null
          total_time_minutes?: number | null
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          author?: string | null
          author_id?: string | null
          author_uid?: never
          contains_allergens?: string[] | null
          created_at?: string | null
          cuisine_primary?: string | null
          cuisine_secondary?: string[] | null
          deleted_at?: string | null
          deleted_reason?: string | null
          dietary?: string[] | null
          difficulty?: string | null
          dish_types?: string[] | null
          flavor_notes?: string[] | null
          id?: string | null
          ingredients?: string | null
          instructions?: string | null
          is_private?: boolean | null
          main_ingredients?: string[] | null
          meal_types?: string[] | null
          methods?: string[] | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          moderation_status?: string | null
          occasions?: string[] | null
          parent_id?: string | null
          photos?: string[] | null
          search_tsv?: unknown
          search_vec?: unknown
          servings?: number | null
          smart_tags_confirmed?: boolean | null
          spice_level?: string | null
          steps?: string | null
          tags?: string[] | null
          title?: string | null
          total_time_minutes?: number | null
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_author_fk"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recipes_author_fk"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_fk"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recipes_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recipes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "following_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "recipe_stats_view"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "recipes_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "recipes_with_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes_with_meta: {
        Row: {
          author: string | null
          author_profile: Json | null
          created_at: string | null
          id: string | null
          photos: string[] | null
          remix_count: number | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_author_fk"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recipes_author_fk"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_fk"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profile_counters"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recipes_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles_visible"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _smart_tag_label: {
        Args: { group_key: string; value: string }
        Returns: string
      }
      _upsert_smart_tag: {
        Args: { _group: string; _sort?: number; _value: string }
        Returns: undefined
      }
      array_no_empty_strings: { Args: { arr: string[] }; Returns: boolean }
      block_user: { Args: { p_blocked: string }; Returns: undefined }
      claim_profile: {
        Args: { new_display_name: string; new_username: string }
        Returns: {
          avatar_custom_path: string | null
          avatar_placeholder_key: string | null
          avatar_source: Database["public"]["Enums"]["avatar_source"]
          bio: string | null
          created_at: string | null
          deleted_at: string | null
          display_name: string | null
          id: string
          is_founding_cook: boolean
          is_premium: boolean
          last_opened_at: string | null
          pinned_recipe_id: string | null
          privacy: string | null
          referral_code: string | null
          updated_at: string | null
          username: string | null
          vibe_phrases: string[] | null
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_notification: {
        Args: {
          p_actor: string
          p_recipe: string
          p_recipient: string
          p_type: string
        }
        Returns: undefined
      }
      cuisine_regions_for_cuisine: {
        Args: { cuisine: string }
        Returns: string[]
      }
      delete_user_data: { Args: { target_user: string }; Returns: undefined }
      ensure_recipe_stats_row: {
        Args: { p_recipe_id: string }
        Returns: undefined
      }
      expand_cuisine_filter_values: {
        Args: { vals: string[] }
        Returns: string[]
      }
      generate_referral_code: { Args: never; Returns: string }
      get_all_recipe_ids: {
        Args: { lim: number; off: number }
        Returns: {
          recipe_id: string
        }[]
      }
      get_app_limits: { Args: never; Returns: Json }
      get_cook_percentile: { Args: { p_user_id: string }; Returns: number }
      get_creator_stats: { Args: { p_user_id: string }; Returns: Json }
      get_creator_stats_full: { Args: { p_user_id: string }; Returns: Json }
      get_friday_inspiration_eligible_recipients: {
        Args: never
        Returns: {
          user_id: string
        }[]
      }
      get_liked_by_following_recipe_count: {
        Args: { days?: number; p_user: string }
        Returns: {
          total_count: number
        }[]
      }
      get_liked_by_following_recipe_ids: {
        Args: { days?: number; lim?: number; off?: number; p_user: string }
        Returns: {
          recipe_id: string
        }[]
      }
      get_my_entitlements: { Args: never; Returns: Json }
      get_new_this_week_recipe_count: {
        Args: { p_user?: string }
        Returns: {
          total_count: number
        }[]
      }
      get_new_this_week_recipe_ids: {
        Args: { p_limit?: number; p_offset?: number; p_user?: string }
        Returns: {
          recipe_id: string
        }[]
      }
      get_onboarding_suggestions: {
        Args: { p_limit?: number; p_user_id: string }
        Returns: {
          avatar_custom_path: string
          avatar_placeholder_key: string
          avatar_source: string
          display_name: string
          is_founding_cook: boolean
          user_id: string
          username: string
        }[]
      }
      get_popular_tags: {
        Args: { limit_count?: number }
        Returns: {
          count: number
          tag: string
        }[]
      }
      get_profile_stats: {
        Args: { p_user_id: string }
        Returns: {
          followers_count: number
          following_count: number
          likes_received_count: number
          recipes_count: number
          remixes_count: number
          saved_count: number
          user_id: string
        }[]
      }
      get_recipe_stats_batch: {
        Args: { p_recipe_ids: string[] }
        Returns: {
          average_rating: number
          bookmarks_count: number
          cooked_count: number
          likes_count: number
          ratings_count: number
          recipe_id: string
          remixes_count: number
        }[]
      }
      get_smart_tags_catalog: {
        Args: never
        Returns: {
          group_key: string
          key: string
          label: string
          sort_order: number
        }[]
      }
      get_surprise_me_recipe: {
        Args: {
          p_difficulties?: string[]
          p_exclude_ids?: string[]
          p_main_ingredients?: string[]
          p_max_total_minutes?: number
          p_meal_types?: string[]
        }
        Returns: Json
      }
      get_top_cook_suggestions: {
        Args: {
          p_exclude_ids: string[]
          p_limit: number
          p_percentile_max: number
          p_user_id: string
        }
        Returns: {
          avatar_custom_path: string
          avatar_placeholder_key: string
          avatar_source: string
          display_name: string
          id: string
          username: string
        }[]
      }
      get_trending_recipe_count: {
        Args: { days?: number }
        Returns: {
          total_count: number
        }[]
      }
      get_trending_recipe_ids: {
        Args: { days?: number; lim?: number; off?: number }
        Returns: {
          recipe_id: string
        }[]
      }
      get_trending_smart_tags: {
        Args: { days_back?: number; limit_per_group?: number }
        Returns: {
          count: number
          group_key: string
          is_primary: boolean
          label: string
          tag_key: string
        }[]
      }
      get_weekly_digest_eligible_recipients: {
        Args: never
        Returns: {
          from_followed_count: number
          total_count: number
          user_id: string
        }[]
      }
      is_blocked: { Args: { a: string; b: string }; Returns: boolean }
      pick_placeholder_path: { Args: { uid: string }; Returns: string }
      recompute_bookmarks_count: {
        Args: { p_recipe_id: string }
        Returns: undefined
      }
      recompute_cooked_count: {
        Args: { p_recipe_id: string }
        Returns: undefined
      }
      recompute_likes_count: {
        Args: { p_recipe_id: string }
        Returns: undefined
      }
      recompute_ratings_for_recipe: {
        Args: { p_recipe_id: string }
        Returns: undefined
      }
      recompute_remixes_count: {
        Args: { p_recipe_id: string }
        Returns: undefined
      }
      redeem_promo_code: { Args: { p_code: string }; Returns: Json }
      run_friday_notifications: { Args: never; Returns: undefined }
      run_lapsed_re_engagement: { Args: never; Returns: undefined }
      run_re_engagement_notifications: { Args: never; Returns: undefined }
      run_weekly_saves_digest: { Args: never; Returns: undefined }
      run_welcome_notifications: { Args: never; Returns: undefined }
      search_recipes:
        | {
            Args: { lim?: number; off?: number; q: string; sort?: string }
            Returns: {
              author: string
              bookmarks_count: number
              cooked_count: number
              created_at: string
              id: string
              ingredients: string
              likes_count: number
              photo_url: string
              remixes_count: number
              steps: string
              tags: string[]
              title: string
              visibility: string
            }[]
          }
        | {
            Args: {
              limit_count?: number
              offset_count?: number
              term: string
              viewer: string
            }
            Returns: {
              author: string
              created_at: string
              id: string
              ingredients: string
              photos: string[]
              tags: string[]
              title: string
            }[]
          }
      search_recipes_v2: {
        Args: {
          filters?: Json
          limit_count?: number
          offset_count?: number
          term: string
          viewer: string
        }
        Returns: {
          author: string
          author_profile: Json
          bookmark_count: number
          created_at: string
          group_key: string
          id: string
          ingredients: string
          like_count: number
          matched_in: string[]
          reason_label: string
          remix_count: number
          steps: string
          tags: string[]
          title: string
          total_count: number
          viewer_bookmarked: boolean
          viewer_liked: boolean
        }[]
      }
      search_recipes_v3: {
        Args: {
          cuisine_values?: string[]
          exclude_smart_tag_keys?: string[]
          filters?: Json
          limit_count?: number
          offset_count?: number
          smart_tag_keys?: string[]
          sort_mode?: string
          term: string
          viewer: string
        }
        Returns: {
          author: string
          author_profile: Json
          bookmark_count: number
          cover_photo_path: string
          created_at: string
          group_key: string
          id: string
          ingredients: string
          like_count: number
          matched_in: string[]
          reason_label: string
          remix_count: number
          steps: string
          tags: string[]
          title: string
          total_count: number
          viewer_bookmarked: boolean
          viewer_liked: boolean
        }[]
      }
      search_tags: {
        Args: { limit_count?: number; offset_count?: number; term: string }
        Returns: {
          count: number
          tag: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      sync_my_entitlements: {
        Args: { p_is_premium: boolean; p_private_recipes?: boolean }
        Returns: undefined
      }
      sync_profile_premium_for_user: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      unblock_user: { Args: { p_blocked: string }; Returns: undefined }
      update_last_opened_at: { Args: never; Returns: undefined }
    }
    Enums: {
      avatar_source: "placeholder" | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      avatar_source: ["placeholder", "custom"],
    },
  },
} as const
