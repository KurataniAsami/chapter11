'use client'

type CategoryFormProps = {
  category: string  
  setCategory: (value: string) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
  disabled?: boolean
  mode: 'new' | 'edit'
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  setCategory,
  onSubmit,
  disabled,
  mode
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col">
      <label htmlFor="name">{category}</label>
      <input
        type="text"
        className="border border-black"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="カテゴリー名を入力してください"
        disabled={disabled}
      />
      </div>
      <button type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={disabled}>
        {mode === 'new' ? '作成' : '更新'}
      </button>
    </form>
  )
}
