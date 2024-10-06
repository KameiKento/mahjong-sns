import ProblemForm from '@/components/ProblemForm'

export default function CreateProblem() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">新しい問題を作成</h1>
      <ProblemForm />
    </div>
  )
}