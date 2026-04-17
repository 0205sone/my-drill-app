import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://qsflaawvuhnnduwlugrk.supabase.co", // ← コンソールに表示されていたあなたの本物のURL！
    "sb_publishable_Cbvtyi0Xhka7fjrj_tnx-w_QLU1xNY2" // ← あなたが最初に見つけていた本物の新しい鍵！
  )
}