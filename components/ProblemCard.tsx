"use client"

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { ThumbsUp, MessageCircle } from 'lucide-react'
import TileButton from './TileButton'
import { TileKey } from '@/lib/mahjong-utils'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

interface ProblemCardProps {
  problem: {
    id: string;
    user_id: string;
    hand: string;
    description: string;
    round: string;
    turn: string;
    scores: string[];
    profiles: { full_name: string; avatar_url: string };
    likes: { count: number }[];
  }
}

export default function ProblemCard({ problem }: ProblemCardProps) {
  const [likes, setLikes] = useState(problem.likes[0]?.count || 0)
  const [liked, setLiked] = useState(false)
  const { toast } = useToast()

  const handleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('ユーザーが認証されていません')

      if (liked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({ user_id: user.id, problem_id: problem.id })

        if (error) throw error

        setLikes(likes - 1)
        setLiked(false)
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: user.id, problem_id: problem.id })

        if (error) throw error

        setLikes(likes + 1)
        setLiked(true)
      }
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={problem.profiles.avatar_url} />
          <AvatarFallback>{problem.profiles.full_name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{problem.profiles.full_name}</h3>
          <p className="text-sm text-muted-foreground">新しい問題を投稿しました</p>
        </div>
      </CardHeader>
      <CardContent>
        {/* 残りの内容は変更なし */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={handleLike}>
          <ThumbsUp className={`mr-2 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          {likes}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="mr-2 h-4 w-4" />
          0
        </Button>
      </CardFooter>
    </Card>
  )
}