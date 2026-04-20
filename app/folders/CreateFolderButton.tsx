// app/folders/CreateFolderButton.tsx
'use client'; // これが必要！

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';

export default function CreateFolderButton() {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleCreate = async () => {
    if (!name) return;

    // Supabaseに新しいフォルダを保存
    const { error } = await supabase
      .from('folders')
      .insert([{ name }]);

    if (!error) {
      setName('');
      setIsCreating(false);
      router.refresh(); // 画面を最新の状態に更新
    }
  };

  if (!isCreating) {
    return (
      <button 
        onClick={() => setIsCreating(true)}
        className="mb-6 w-full py-3 bg-blue-500 text-white rounded-lg font-bold shadow-md hover:bg-blue-600 transition-colors"
      >
        ＋ 新しいフォルダを作る
      </button>
    );
  }

  return (
    <div className="mb-6 p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="フォルダ名（例：中間テスト）"
        className="w-full p-2 border rounded mb-2 text-black"
        autoFocus
      />
      <div className="flex gap-2">
        <button onClick={handleCreate} className="flex-1 bg-blue-500 text-white py-2 rounded font-bold">作成</button>
        <button onClick={() => setIsCreating(false)} className="flex-1 bg-gray-300 py-2 rounded font-bold text-gray-700">キャンセル</button>
      </div>
    </div>
  );
}