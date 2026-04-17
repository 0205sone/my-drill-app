'use client';
import { useState, useEffect } from 'react';
import { createClient } from './utils/supabase/client';

const EVALUATIONS = [
  { level: 1, label: '書けない', color: 'bg-red-500', icon: '❓' },
  { level: 2, label: '見て理解', color: 'bg-orange-400', icon: '👀' },
  { level: 3, label: '半分書けた', color: 'bg-yellow-400', icon: '📐' },
  { level: 4, label: 'ちょっと違う', color: 'bg-lime-500', icon: '💢' },
  { level: 5, label: '完璧', color: 'bg-green-600', icon: '✨' },
];

export default function Home() {
  const [cards, setCards] = useState<any[]>([]); // 全部のカードを入れる配列
  const [currentIndex, setCurrentIndex] = useState(0); // 今何問目かを記録する数字
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const supabase = createClient();

  // 画面が開いたときに、全部のカードを取ってくる
  useEffect(() => {
    async function fetchCards() {
      // cardsテーブルから全部（*）持ってくる
      const { data, error } = await supabase.from('cards').select('*');
      if (data) {
        setCards(data);
      }
      setIsLoading(false);
    }
    fetchCards();
  }, []);

  // 評価ボタンを押したときの処理
  const handleEvaluate = async (level: number) => {
    const currentCard = cards[currentIndex];

    // Supabaseに記録を保存
    await supabase.from('progress').insert({
      card_id: currentCard.id,
      status: level,
    });

    // 次のカードへ進む！
    setIsFlipped(false); // カードを表面に戻す
    setCurrentIndex((prev) => prev + 1); // インデックスを1つ進める
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">データベースから問題を取得中...⏳</div>;
  }

  // もしカードが1枚もない場合
  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-xl font-bold text-gray-500 mb-4">単語がまだありません</p>
        <a href="/new" className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full">単語を登録しに行く</a>
      </div>
    );
  }

  // 用意したカードを全部やりきった場合
  if (currentIndex >= cards.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-extrabold text-green-500 mb-4">🎉 今日の学習は完了！</h2>
        <p className="text-gray-600 mb-8">すべてのカードを復習しました。お疲れ様でした！</p>
        <a href="/new" className="text-blue-500 hover:underline font-bold">新しい単語を追加する</a>
      </div>
    );
  }

  // 今表示するべきカード
  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 relative">
      
      {/* 登録画面へのリンクを右上に配置 */}
      <div className="absolute top-6 right-6">
        <a href="/new" className="text-blue-500 font-bold hover:underline bg-white py-2 px-4 rounded-full shadow-sm">
          ＋ 単語を登録
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-2 text-gray-700">単語帳アプリ（テスト）</h1>
      <p className="text-gray-500 font-bold mb-6">
        {currentIndex + 1} / {cards.length} 問目
      </p>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 min-h-[300px] flex flex-col items-center justify-center mb-8 relative">
        <div className="text-center text-4xl font-extrabold text-gray-800 mb-6">
          {currentCard.question}
        </div>

        {!isFlipped ? (
          <button 
            onClick={() => setIsFlipped(true)}
            className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all"
          >
            答えを見る
          </button>
        ) : (
          <div className="text-2xl font-medium text-gray-600 mt-4 text-center">
            {currentCard.answer}
          </div>
        )}
      </div>

      {isFlipped && (
        <div className="w-full max-w-md grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="text-center text-sm font-bold text-gray-500 mb-2">結果はどうだった？</p>
          {EVALUATIONS.map((item) => (
            <button
              key={item.level}
              onClick={() => handleEvaluate(item.level)}
              className={`${item.color} hover:brightness-110 text-white font-bold py-4 px-6 rounded-xl shadow-md transform active:scale-95 transition-all flex justify-between items-center`}
            >
              <span className="text-lg">{item.icon} {item.label}</span>
              <span className="opacity-70 text-sm">Level {item.level}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}