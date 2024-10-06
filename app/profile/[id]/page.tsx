import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import FollowButton from '@/components/FollowButton'
import ProblemCard from '@/components/ProblemCard'

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .eq('id', params.id)
    .single()

  if (!profile) {
    notFound()
  }

  const { data: problems } = await supabase
    .from('problems')
    .select(`
      *,
      profiles(full_name, avatar_url),
      likes(count)
    `)
    .eq('user_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Avatar className="w-20 h-20">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback>{profile.full_name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{profile.full_name}</h1>
          <FollowButton userId={profile.id} />
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">投稿した問題</h2>
      <div className="space-y-6">
        {problems?.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>
    </div>
  )
}