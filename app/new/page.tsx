'use client';
import { useState } from 'react';
import { createClient } from '../utils/supabase/client';

export default function NewCard() {
  // 入力された文字を保存しておく箱（ステート）
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createClient();

  // 「登録する」ボタンを押したときの処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ボタンを押した時に画面がリロードされるのを防ぐ
    
    // どっちかが空っぽならストップ
    if (!question || !answer) {
      alert('問題と答えを両方入力してね！');
      return;
    }

    setIsSubmitting(true); // 連打防止のために「送信中」状態にする

    // 1. 保存先の「単語帳（deck）」を探す（今回はテスト単語帳のIDを取得）
    const { data: deck } = await supabase.from('decks').select('id').limit(1).single();

    if (!deck) {
      alert('単語帳が見つかりません！先に単語帳を作る必要があります。');
      setIsSubmitting(false);
      return;
    }

    // 2. データベースの cards テーブルに単語を保存！
    const { error } = await supabase.from('cards').insert({
      deck_id: deck.id,
      question: question,
      answer: answer,
    });

    if (error) {
      alert('保存に失敗しました...');
      console.error(error);
    } else {
      alert(`「${question}」を登録しました！✨`);
      // 次の単語をすぐ登録できるように、入力欄を空っぽに戻す
      setQuestion('');
      setAnswer('');
    }
    
    setIsSubmitting(false); // 「送信中」状態を解除
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-700 text-center">新しい単語を登録</h1>

        {/* 登録フォーム */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* 問題の入力欄 */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">問題（おもて）</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例：JavaScript"
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* 答えの入力欄 */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">答え（うら）</label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="例：ジャバスクリプト"
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* 登録ボタン */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 w-full text-white font-bold py-4 rounded-xl shadow-md transition-all ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
            }`}
          >
            {isSubmitting ? '登録中...' : '単語帳に追加する！'}
          </button>
        </form>

        {/* メイン画面に戻るリンク */}
        <div className="mt-6 text-center">
          <a href="/" className="text-blue-500 hover:underline text-sm font-bold">
            ← 学習画面に戻る
          </a>
        </div>

      </div>
    </div>
  );
}