// src/app/api/ai/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const r = await client.chat.completions.create({
      model: "gpt-5-mini", // ご利用プランに合わせて
      messages: [
        { role: "system", content: "You are a concise, neutral explainer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });
    const text = r.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ text });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
