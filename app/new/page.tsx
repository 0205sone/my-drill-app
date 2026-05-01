'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import Link from 'next/link';

export default function NewCardPage() {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [decks, setDecks] = useState<any[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  // 画面が開いたときに、単語帳（decks）の一覧を取ってくる
  useEffect(() => {
    const fetchDecks = async () => {
      const { data, error } = await supabase.from('decks').select('*');
      if (data && data.length > 0) {
        setDecks(data);
        setSelectedDeckId(data[0].id); // 最初に見つかった単語帳をデフォルトで選択状態にする
      }
    };
    fetchDecks();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 入力漏れや、単語帳が選ばれていない場合はストップ
    if (!front || !back || !selectedDeckId) {
      alert("問題、答え、単語帳をすべて入力・選択してください！");
      return;
    }
    
    setIsSubmitting(true);

    // Supabaseに送信！（deck_idを追加して迷子を防ぐ）
    const { error } = await supabase
      .from('cards') // ※もしテーブル名が違う場合は書き換えてください
      .insert([
        { 
          front_text: front, // ※もしカラム名が違う場合は書き換えてください
          back_text: back,   // ※もしカラム名が違う場合は書き換えてください
          deck_id: selectedDeckId 
        }
      ]);

    if (!error) {
      // 成功したら入力欄を空にして、選んだ単語帳の画面に戻る
      setFront('');
      setBack('');
      router.push(`/deck/${selectedDeckId}`); 
      router.refresh();
    } else {
      console.error(error);
      alert('エラーが発生しました');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">新しい単語を登録</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* ▼ 追加したドロップダウン ▼ */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">保存先の単語帳</label>
            <select 
              value={selectedDeckId}
              onChange={(e) => setSelectedDeckId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-gray-50 focus:outline-none focus:border-blue-500"
              required
            >
              {decks.length === 0 && <option value="">単語帳がありません</option>}
              {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">問題（おもて）</label>
            <input
              type="text"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="例：JavaScript"
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">答え（うら）</label>
            <input
              type="text"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="例：ジャバスクリプト"
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || decks.length === 0}
            className={`w-full py-3 mt-2 rounded-lg font-bold text-white transition-colors ${
              isSubmitting || decks.length === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 shadow-md'
            }`}
          >
            {isSubmitting ? '登録中...' : '単語帳に追加する！'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => router.back()} className="text-blue-500 hover:underline font-medium">
            ← 前の画面に戻る
          </button>
        </div>
      </div>
    </div>
  );
}