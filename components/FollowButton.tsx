"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'

interface FollowButtonProps {
  userId: string
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    checkFollowStatus()
  }, [userId])

  const checkFollowStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('ユーザーが認証されていません')

      const { data, error } = await supabase
        .from('follows')
        .select()
        .match({ follower_id: user.id, followed_id: userId })

      if (error) throw error

      setIsFollowing(data.length > 0)
    } catch (error) {
      console.error('Error checking follow status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollow = async () => {
    try {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('ユーザーが認証されていません')

      if (isFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .match({ follower_id: user.id, followed_id: userId })

        if (error) throw error

        setIsFollowing(false)
        toast({
          title: "フォロー解除しました",
        })
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({ follower_id: user.id, followed_id: userId })

        if (error) throw error

        setIsFollowing(true)
        toast({
          title: "フォローしました",
        })
      }
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Button disabled>読み込み中...</Button>
  }

  return (
    <Button onClick={handleFollow} variant={isFollowing ? "outline" : "default"}>
      {isFollowing ? 'フォロー中' : 'フォローする'}
    </Button>
  )
}