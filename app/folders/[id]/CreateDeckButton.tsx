// app/folders/[id]/CreateDeckButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';

// propsとしてfolderId（どのフォルダに入れるか）を受け取ります
export default function CreateDeckButton({ folderId }: { folderId: string }) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleCreate = async () => {
    if (!title) return;

    // 単語帳（decks）に、タイトルとfolder_idをセットにして保存！
    const { error } = await supabase
      .from('decks')
      .insert([{ title: title, folder_id: folderId }]);

    if (!error) {
      setTitle('');
      setIsCreating(false);
      router.refresh();
    } else {
      console.error(error);
      alert("エラーが発生しました");
    }
  };

  if (!isCreating) {
    return (
      <button 
        onClick={() => setIsCreating(true)}
        className="mt-4 w-full py-3 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 font-bold hover:bg-gray-50 transition-colors"
      >
        ＋ このフォルダに新しい単語帳を作る
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 border-2 border-green-500 rounded-lg bg-green-50">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="単語帳の名前（例：第1回小テスト）"
        className="w-full p-2 border rounded mb-2 text-black"
        autoFocus
      />
      <div className="flex gap-2">
        <button onClick={handleCreate} className="flex-1 bg-green-500 text-white py-2 rounded font-bold">作成</button>
        <button onClick={() => setIsCreating(false)} className="flex-1 bg-gray-300 py-2 rounded font-bold text-gray-700">キャンセル</button>
      </div>
    </div>
  );
}