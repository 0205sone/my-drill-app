// app/folders/page.tsx
import Link from 'next/link';
import { createClient } from '@/app/utils/supabase/client';
import CreateFolderButton from './CreateFolderButton'; // さっき作ったやつを呼ぶ

export default async function FoldersPage() {
  const supabase = createClient();
  
  const { data: folders } = await supabase
    .from('folders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📁 フォルダ一覧</h1>
      
      {/* ここをコンポーネントに差し替え！ */}
      <CreateFolderButton />

      <div className="grid gap-4">
        {folders?.map((folder) => (
          <Link 
            key={folder.id} 
            href={`/folders/${folder.id}`} 
            className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors shadow-sm block text-black"
          >
            <span className="text-xl">📂</span>
            <span className="ml-3 font-bold text-lg">{folder.name}</span>
          </Link>
        ))}
        
        {folders?.length === 0 && (
          <p className="text-center text-gray-500">フォルダがまだありません</p>
        )}
      </div>
    </div>
  );
}