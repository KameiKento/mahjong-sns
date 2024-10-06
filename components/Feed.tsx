"use client"

import { useState, useEffect } from 'react'
import ProblemCard from './ProblemCard'
import { Button } from './ui/button'
import { supabase } from '@/lib/supabase'

export default function Feed() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProblems()
  }, [])

  const fetchProblems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('problems')
        .select(`
          *,
          profiles:auth_users(username),
          likes(count)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      setProblems(data)
    } catch (error) {
      console.error('Error fetching problems:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {problems.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
      <div className="text-center">
        <Button onClick={fetchProblems}>もっと読み込む</Button>
      </div>
    </div>
  )
}