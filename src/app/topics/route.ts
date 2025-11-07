// src/app/api/topics/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { genre = "社会・生活", n = 5 } = await req.json().catch(() => ({}));
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const r = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: "Propose short, distinct topics for student debate." },
        { role: "user", content: `ジャンル: ${genre}\n大学生が議論しやすい「論点」が明確な日本語のトピックを${n}個、各28〜38文字で。箇条書き。` }
      ],
      temperature: 0.7,
    });

    const text = r.choices?.[0]?.message?.content ?? "";
    const topics = text
      .split(/\r?\n/)
      .map(s => s.replace(/^[-・●\d\.\)\s]*/g, "").trim())
      .filter(Boolean)
      .slice(0, n);

    return NextResponse.json({ topics });
  } catch (e) {
    console.error(e);
    // キー未設定/失敗時の保険
    return NextResponse.json({
      topics: [
        "学校でのスマホ持ち込みは許可すべきか",
        "在宅勤務は生産性を上げるのか下げるのか",
        "使い捨てプラスチック削減の現実的手段",
        "生成AIの教育利用はどこまで認めるべきか",
        "公共の場での静粛マナーは強化すべきか",
      ],
    });
  }
}
