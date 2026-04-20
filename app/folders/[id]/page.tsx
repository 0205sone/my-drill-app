// app/folders/[id]/page.tsx
import { createClient } from '@/app/utils/supabase/client';
import Link from 'next/link';

export default async function FolderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const folderId = params.id;

  // 1. フォルダ情報を取得（名前を表示するため）
  const { data: folder } = await supabase
    .from('folders')
    .select('name')
    .eq('id', folderId)
    .single();

  // 2. そのフォルダに紐づく単語帳（decks）だけを取得
  const { data: decks } = await supabase
    .from('decks')
    .select('*')
    .eq('folder_id', folderId); // ここがポイント！

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/folders" className="text-blue-500">← フォルダ一覧へ戻る</Link>
        <h1 className="text-2xl font-bold mt-2">📂 {folder?.name}</h1>
      </div>

      <div className="grid gap-4">
        {decks?.map((deck) => (
          <Link 
            key={deck.id} 
            href={`/deck/${deck.id}`} // ここは以前作った単語帳詳細へ
            className="p-4 bg-gray-50 border rounded-lg hover:bg-white transition-all shadow-sm block"
          >
            <h2 className="font-bold">{deck.title}</h2>
          </Link>
        ))}
        
        <button className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
          ＋ このフォルダに単語帳を追加
        </button>
      </div>
    </div>
  );
}