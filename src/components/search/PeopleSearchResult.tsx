'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { UserPlus, UserCheck, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { ROUTES } from '@/lib/constants/routes'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

type ProfileResult = {
  id: string | null
  username: string | null
  display_name: string | null
  avatar_source: string | null
  avatar_placeholder_key: string | null
  avatar_custom_path: string | null
  bio: string | null
  is_founding_cook: boolean | null
  is_premium: boolean | null
}

interface PeopleSearchResultProps {
  profile: ProfileResult
  currentUserId: string | null
  className?: string
}

export function PeopleSearchResult({ profile, currentUserId, className }: PeopleSearchResultProps) {
  const [following, setFollowing] = useState(false)
  const [loadingFollow, setLoadingFollow] = useState(false)
  const supabase = getSupabaseBrowserClient()

  const isOwnProfile = profile.id && currentUserId && profile.id === currentUserId

  const handleFollow = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      if (!currentUserId || !profile.id || loadingFollow) return

      setLoadingFollow(true)
      try {
        if (following) {
          await supabase
            .from('follows')
            .delete()
            .eq('follower_id', currentUserId)
            .eq('followed_id', profile.id)
          setFollowing(false)
        } else {
          await supabase.from('follows').insert({
            follower_id: currentUserId,
            followed_id: profile.id,
          })
          setFollowing(true)
        }
      } finally {
        setLoadingFollow(false)
      }
    },
    [currentUserId, profile.id, following, loadingFollow, supabase]
  )

  const profilePath = profile.username ? ROUTES.PROFILE(profile.username) : '#'

  return (
    <Link
      href={profilePath}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm hover:bg-accent/5 transition-all',
        className
      )}
    >
      {/* Avatar */}
      <UserAvatar profile={profile} size="md" className="flex-shrink-0" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm truncate">
            {profile.display_name || profile.username}
          </span>
          {profile.is_founding_cook && (
            <span className="text-blue-500 flex-shrink-0" title="Founding Cook">
              ✓
            </span>
          )}
          {profile.is_premium && (
            <span title="Premium"><Star className="h-3 w-3 text-amber-400 fill-amber-400 flex-shrink-0" /></span>
          )}
        </div>
        {profile.username && (
          <p className="text-xs text-muted-foreground">@{profile.username}</p>
        )}
        {profile.bio && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{profile.bio}</p>
        )}
      </div>

      {/* Follow button */}
      {currentUserId && !isOwnProfile && (
        <Button
          variant={following ? 'outline' : 'default'}
          size="sm"
          onClick={handleFollow}
          disabled={loadingFollow}
          className="flex-shrink-0"
        >
          {following ? (
            <>
              <UserCheck className="h-3.5 w-3.5 mr-1" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              Follow
            </>
          )}
        </Button>
      )}
    </Link>
  )
}
