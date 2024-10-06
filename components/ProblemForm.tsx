"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import TileButton from './TileButton'
import { tileTypes, TileType, TileKey, validateHand, generateTileButtons } from '@/lib/mahjong-utils'
import { ROUNDS, TURNS, MAX_DESCRIPTION_LENGTH } from '@/lib/constants'
import { supabase } from '@/lib/supabase'

export default function ProblemForm() {
  const [selectedTiles, setSelectedTiles] = useState<TileKey[]>([])
  const [activeTab, setActiveTab] = useState<TileType>('m')
  const [description, setDescription] = useState('')
  const [round, setRound] = useState('')
  const [turn, setTurn] = useState('')
  const [scores, setScores] = useState(['', '', '', ''])
  const { toast } = useToast()
  const router = useRouter()

  const handleTileClick = (tile: TileKey) => {
    if (selectedTiles.length < 14) {
      setSelectedTiles([...selectedTiles, tile])
    }
  }

  const handleRemoveTile = (index: number) => {
    setSelectedTiles(selectedTiles.filter((_, i) => i !== index))
  }

  const handleScoreChange = (index: number, value: string) => {
    const newScores = [...scores]
    newScores[index] = value
    setScores(newScores)
  }

  const handleSubmit = async () => {
    const validationError = validateHand(selectedTiles)
    if (validationError) {
      toast({
        title: "無効な手牌",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    if (!round || !turn) {
      toast({
        title: "情報が不足しています",
        description: "局と巡目を選択してください",
        variant: "destructive",
      })
      return
    }

    if (scores.some(score => score === '')) {
      toast({
        title: "スコアが不完全です",
        description: "全プレイヤーのスコアを入力してください",
        variant: "destructive",
      })
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('ユーザーが認証されていません')

      const { data, error } = await supabase
        .from('problems')
        .insert({
          user_id: user.id,
          hand: selectedTiles.join(' '),
          description,
          round,
          turn,
          scores,
        })
        .select()

      if (error) throw error

      toast({
        title: "問題が作成されました",
        description: "問題が正常に投稿されました。",
      })

      router.push('/')
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">選択された牌</h3>
        <div className="flex overflow-x-auto py-2 gap-1 mb-4 bg-secondary rounded-md">
          {selectedTiles.map((tile, index) => (
            <TileButton
              key={`${tile}-${index}`}
              tile={tile}
              onClick={() => handleRemoveTile(index)}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TileType)}>
        <TabsList className="grid w-full grid-cols-4">
          {tileTypes.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type === 'm' ? '萬子' : type === 'p' ? '筒子' : type === 's' ? '索子' : '字牌'}
            </TabsTrigger>
          ))}
        </TabsList>
        {tileTypes.map((type) => (
          <TabsContent key={type} value={type}>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-10">
              {generateTileButtons(type).map((tile) => (
                <TileButton
                  key={tile}
                  tile={tile}
                  onClick={() => handleTileClick(tile)}
                  disabled={selectedTiles.length >= 14}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Select onValueChange={setRound}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="局を選択" />
            </SelectTrigger>
            <SelectContent>
              {ROUNDS.map((round) => (
                <SelectItem key={round.value} value={round.value}>
                  {round.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setTurn}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="巡目を選択" />
            </SelectTrigger>
            <SelectContent>
              {TURNS.map((turn) => (
                <SelectItem key={turn.value} value={turn.value}>
                  {turn.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {['東家', '南家', '西家', '北家'].map((player, index) => (
            <div key={player}>
              <label htmlFor={`score-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {player}のスコア
              </label>
              <Input
                type="number"
                id={`score-${index}`}
                value={scores[index]}
                onChange={(e) => handleScoreChange(index, e.target.value)}
                placeholder="25000"
              />
            </div>
          ))}
        </div>

        <Textarea
          placeholder="問題の説明を入力してください（最大500文字）"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
          maxLength={MAX_DESCRIPTION_LENGTH}
        />
        <p className="text-sm text-gray-500">
          {description.length}/{MAX_DESCRIPTION_LENGTH}
        </p>
      </div>

      <Button onClick={handleSubmit} disabled={selectedTiles.length !== 14} className="w-full">
        問題を作成
      </Button>
    </div>
  )
}