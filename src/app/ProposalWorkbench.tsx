"use client";
import React, { useEffect, useState } from "react";

/** =========================
 *  プリセット（改行はテンプレートリテラルで）
 *  ========================= */
const PRESETS = {
  "社会・生活": [
    {
      seed: `スマホ通知が1日200回以上鳴る生活は、注意資源を細切れにする。
便利さは集中の質と引き換えでも許されるのか。
私たちはどこで線を引くべきだろうか？`,
      counter: `通知は問題の表層で、真因は意思決定の設計にある。
“通知ゼロ”よりも“重要度の自動仕分け＋時間帯バッチ処理”で学業・仕事のリズムを守る方が現実的だ。`,
    },
    {
      seed: `置き配が主流になると、配達員と受取人の『ありがとう』は消える。
利便性と感謝の回路は両立できるのか。
失われた関係を補う仕掛けはある？`,
      counter: `対面を強制する必要はない。
受領時の“既読リアクション”や週次の感謝サマリーなど、非同期の軽いフィードバックで関与を可視化できる。`,
    },
    {
      seed: `AIレコメンドが好みを先回りし、驚きが減る。
効率化は越境の機会を奪っていないか。
日々の『偶然性』を設計できる？`,
      counter: `アルゴリズムの責任だけにせず、ユーザー側で“発見枠”を予約する。
週1回は探索度を上げるモードを強制し、カリキュラム化するのが実装しやすい。`,
    },
  ],
  公共: [
    {
      seed: `ベンチが広告で埋め尽くされると公共性は薄まる。
ああああああああああ

誰が何を持って線引きする？`,
      counter: `公共空間の目的関数を“滞留の質”に置き換える。
広告は許容するが、面積・明度・位置にスコア上限を設け、利用実感で再最適化すべき。`,
    },
  ],
  "Well-being": [
    {
      seed: `健康アプリは数字の改善を褒めるが、関係性や意味は点数化しづらい。
スコアにならない幸せは切り捨ててよいのか。
どう扱えば測定と生活が乖離しない？`,
      counter: `指標は二層に分ける。生体データは短期、関係充足は物語ベースで四半期に振り返る。
異尺度を混ぜずダッシュボードで並置する。`,
    },
  ],
  防災: [
    {
      seed: `防災訓練は年1回。頻度の低さが学習の転移を阻む。
日常に溶けた訓練設計は可能か。
“小さな反復”をどう埋め込む？`,
      counter: `地域アプリの“散歩クエスト”に避難路チェックを紐づける。
報酬は地域通貨やスタンプで十分。大事なのは反復の摩擦を下げること。`,
    },
  ],
  テクノロジー: [
    {
      seed: `生成AIが課題を高速に片付けるほど、学習機会は短縮される。
効率と習得はトレードオフか。
バイパス学習をどう補正する？`,
      counter: `アウトプット到達後に“逆向き学習”を必ず挟む。
生成→根拠抽出→手計算/手実装のミニ課題でメタ認知を回収する設計が現実的。`,
    },
  ],
  教育: [
    {
      seed: `講義動画は2倍速で『消費』される。
理解は速度に比例するのか。
学習の質を落とさず時短する術は？`,
      counter: `2倍速は導入フェーズに限定し、演習区間は1.0倍に固定。
区間ごとに『説明→停止→再現』のリズムを強制するUIが有効。`,
    },
  ],
  一般: [
    {
      seed: `便利さが増すほど、選択の理由を考えなくなる。
自動化は意思を細らせるのか。
どこで“考える負荷”を残すべき？`,
      counter: `全自動ではなく“半自動”を採用する。
初回は選択理由の入力を求め、以降は提案＋承認にし、意思の痕跡を残す。`,
    },
  ],
} as const;

type Category = keyof typeof PRESETS;
type Idea = (typeof PRESETS)[Category][number];

export default function ProposalWorkbench() {
  // 共通ステート
  const [title, setTitle] = useState("");
  const [seed, setSeed] = useState("");     // 左ペイン（AIの主張 / 生成で上書き可）
  const [counter, setCounter] = useState(""); // 右ペイン

  const [category, setCategory] = useState<Category>("社会・生活");
  const [index, setIndex] = useState(0);

  // 送信状態
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  // —— お題提案/生成（旧セクション2を統合）——
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [generating, setGenerating] = useState(false);

  // 初期表示：現カテゴリーの最初の種をセット（反駁は上書きしない）
  useEffect(() => {
    const list: readonly Idea[] = PRESETS[category];
    if (list?.length) {
      setSeed(list[0].seed);
      setIndex(0);
    }
  }, [category]);

  // 次のお題へ（反駁は維持）
  function nextPreset() {
    const list: readonly Idea[] = PRESETS[category] || [];
    if (!list.length) return;
    const i = (index + 1) % list.length;
    setIndex(i);
    setSeed(list[i].seed);
  }

  function insertCounterSample() {
    const list: readonly Idea[] = PRESETS[category] || [];
    if (!list.length) return;
    setCounter(list[index].counter);
  }

  // 保存・復元
  const STORAGE_KEY = "proposal-simple-v1";
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as {
          title?: string;
          seed?: string;
          counter?: string;
          category?: Category;
          index?: number;
        };
        setTitle(data.title ?? "");
        setSeed(data.seed ?? PRESETS["社会・生活"][0].seed);
        setCounter(data.counter ?? "");
        setCategory((data.category as Category) ?? "社会・生活");
        setIndex(typeof data.index === "number" ? data.index : 0);
      }
    } catch {
      // noop
    }
  }, []);

  useEffect(() => {
    const data = { title, seed, counter, category, index };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [title, seed, counter, category, index]);

  // Markdown出力
  function exportMarkdown() {
    const md = `# 題目
${title || "(未設定)"}

## AIの主張
${seed}

## 自分の反駁
${counter}`;
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `自主提案レポート_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 送信（GAS Web App へ POST）
  async function submitReport() {
    if (!title.trim() || !seed.trim() || !counter.trim()) {
      setSubmitMsg("題目・AIの主張・自分の反駁は必須です。");
      return;
    }
    try {
      setSubmitting(true);
      setSubmitMsg(null);
      const url = process.env.NEXT_PUBLIC_SUBMIT_URL as string | undefined;
      const token = process.env.NEXT_PUBLIC_SUBMIT_TOKEN as string | undefined;
      if (!url || !token) {
        setSubmitMsg("送信設定が未完了です（URL/TOKEN を確認）");
        return;
      }
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          title,
          category,
          seed,
          counter,
          user: "",
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setSubmitMsg("送信しました。スプレッドシートに保存されています。");
      } else {
        setSubmitMsg(`送信失敗: ${json.error || "unknown error"}`);
      }
    } catch (e: any) {
      setSubmitMsg(`送信失敗: ${e?.message || String(e)}`);
    } finally {
      setSubmitting(false);
    }
  }

  // お題をAIに提案してもらう
  async function suggestTopics(genre = "社会・生活") {
    try {
      setSuggesting(true);
      const r = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre, n: 5 }),
      });
      const data = await r.json();
      setTopics(Array.isArray(data.topics) ? data.topics : []);
    } finally {
      setSuggesting(false);
    }
  }

  // 選んだ/入力したお題から左ペイン（seed）を自動生成
  async function generateFromTopic(t: string) {
    if (!t.trim()) return;
    setTopic(t);
    try {
      setGenerating(true);
      const r = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `テーマ:「${t}」。このテーマについて200〜300字で中立的に説明文を書いてください。論点が分かるよう簡潔に。`,
        }),
      });
      const data = await r.json();
      if (data?.text) setSeed(data.text);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur p-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <h1 className="text-xl font-semibold">
            AI主張 × 自分の反駁エディタ（プリセット＋生成）
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="px-2 py-1 border rounded-lg text-sm"
              aria-label="カテゴリ"
            >
              {(Object.keys(PRESETS) as Category[]).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              onClick={nextPreset}
              className="px-3 py-1.5 border rounded-lg hover:bg-neutral-100"
              type="button"
            >
              次のお題
            </button>
            <button
              onClick={insertCounterSample}
              className="px-3 py-1.5 border rounded-lg hover:bg-neutral-100"
              type="button"
            >
              反駁サンプルを挿入
            </button>
            <button
              onClick={exportMarkdown}
              className="px-3 py-1.5 border rounded-lg hover:bg-neutral-100"
              type="button"
            >
              Markdown出力
            </button>
            <button
              onClick={submitReport}
              disabled={submitting}
              className="px-3 py-1.5 border rounded-lg hover:bg-neutral-100 disabled:opacity-50"
              type="button"
            >
              {submitting ? "送信中…" : "送信"}
            </button>
          </div>
        </div>
        {submitMsg && (
          <p className="max-w-5xl mx-auto px-1 pt-2 text-sm text-neutral-600">
            {submitMsg}
          </p>
        )}
      </header>

      {/* お題入力・提案（生成UI） */}
      <div className="max-w-5xl mx-auto p-4 space-y-3">
        <div className="flex gap-2 items-center">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="テーマ（例：在宅勤務は生産性を上げるか）"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            onClick={() => generateFromTopic(topic)}
            className="px-3 py-2 rounded bg-black text-white disabled:opacity-60"
            disabled={!topic.trim() || generating}
          >
            {generating ? "生成中..." : "生成"}
          </button>
          <button
            onClick={() => suggestTopics("社会・生活")}
            className="px-3 py-2 rounded border"
            disabled={suggesting}
          >
            お題を提案
          </button>
        </div>

        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => generateFromTopic(t)}
                className="px-2 py-1 text-sm rounded border hover:bg-gray-50"
                title="このお題で左ペインを自動生成"
              >
                {t}
              </button>
            ))}
            <button
              onClick={() => suggestTopics("テクノロジー")}
              className="px-2 py-1 text-sm rounded border"
            >
              もっと見る
            </button>
          </div>
        )}
      </div>

      <main className="max-w-5xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium mb-1">
            題目（例：AIの意見に反論するには。）
          </label>
          <input
            className="w-full border rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-300"
            placeholder="例：AIの倫理的判断を人間が監視するには。"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <section className="border rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold mb-2">左：AIの主張（プリセット/生成）</h2>
          <textarea
            className="w-full h-64 border rounded-xl p-3 font-[system-ui] text-sm bg-neutral-50"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
          <p className="text-xs text-neutral-500 mt-2">
            ※カテゴリ変更／次のお題／生成で切り替えできます。
          </p>
        </section>

        <section className="border rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold mb-2">右：自分の反駁</h2>
          <textarea
            className="w-full h-64 border rounded-xl p-3 font-[system-ui] text-sm"
            placeholder="AIの主張に対して、自分の意見・反論・別視点を書く。"
            value={counter}
            onChange={(e) => setCounter(e.target.value)}
          />
          <div className="flex items-center gap-2 mt-2 text-xs text-neutral-600">
            <span className="inline-block px-2 py-1 rounded bg-neutral-100">ヒント</span>
            <span>主張→根拠→具体の順にまとめることを意識しよう！</span>
          </div>
        </section>
      </main>
    </div>
  );
}

