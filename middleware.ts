import { NextResponse, NextRequest } from "next/server";

const COOKIE_NAME = "tbk";
const TOKEN = process.env.TBK_LINK_TOKEN!;

// 保護を外したいパス（例：静的ファイルや _next は除外）
const PUBLIC_PATHS = [
  "/favicon.ico",
  "/robots.txt",
  "/_next",          // Next.js assets
];

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 公開パスは素通し
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // すでに通行証クッキーを持っていれば通す
  const hasCookie = req.cookies.get(COOKIE_NAME)?.value === TOKEN;
  if (hasCookie) return NextResponse.next();

  // URL に key=... があれば検証 → クッキー付与してクリーンURLへ
  const key = searchParams.get("key");
  if (key && key === TOKEN) {
    const res = NextResponse.redirect(new URL(pathname, req.url)); // ?key を消す
    res.cookies.set(COOKIE_NAME, TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30日
    });
    return res;
  }

  // ここまで来たら未認証 → 401 を返す（文言はお好みで）
  return new NextResponse(
    "Unauthorized. Access this site using the special link with ?key=...",
    { status: 401, headers: { "content-type": "text/plain; charset=utf-8" } }
  );
}

export const config = {
  // すべてのページを対象（静的ファイルは上で除外）
  matcher: ["/((?!api).*)"], // APIも守りたいなら "/:path*" に
};
