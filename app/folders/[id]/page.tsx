// app/folders/[id]/page.tsx
import { createClient } from '@/app/utils/supabase/client';
import Link from 'next/link';
import CreateDeckButton from './CreateDeckButton'; // 👈 これを追加！

export default async function FolderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const folderId = params.id;

  const { data: folder } = await supabase
    .from('folders')
    .select('name')
    .eq('id', folderId)
    .single();

  const { data: decks } = await supabase
    .from('decks')
    .select('*')
    .eq('folder_id', folderId);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/folders" className="text-blue-500 hover:underline">← フォルダ一覧へ戻る</Link>
        <h1 className="text-2xl font-bold mt-2">📂 {folder?.name}</h1>
      </div>

      <div className="grid gap-4">
        {decks?.map((deck) => (
          <Link 
            key={deck.id} 
            href={`/deck/${deck.id}`}
            className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-400 transition-colors shadow-sm block text-black"
          >
            <h2 className="font-bold text-lg">📝 {deck.title}</h2>
          </Link>
        ))}
        
        {/* 👈 ダミーボタンを消して、これに差し替え！ folderIdを渡すのがポイントです */}
        <CreateDeckButton folderId={folderId} />
      </div>
    </div>
  );
}