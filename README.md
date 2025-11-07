# ThinkBack - AIと考える力を取り戻すWebアプリ

## 🧠 プロジェクト概要
「ThinkBack」は、AIが提示する意見に対して**自分で反論や別視点を考える**ことで、  
“考える時間”を取り戻すことを目的としたWebアプリです。  

AIにすぐ答えを求めるのではなく、**AIを考える相手**として使うことで、  
現代社会で失われつつある「自問自答する力」を育てることを狙っています。  

本プロジェクトは、  
東京科学大学「現代社会の課題とコミュニケーション」授業内の  
自主提案レポート（テーマ：「考えなくても答えが得られる時代に、考える力をどう育てるか」）として制作しました。

---

## 💡 背景と目的
近年、生成AIの発達により「考えなくても答えが得られる」環境が広がっています。  
一方で、自ら問いを立て、考え抜く力が失われつつあります。  

私はこの状況を課題と捉え、  
AIを「思考を奪う存在」ではなく「思考を促す存在」として再定義するためにこのアプリを開発しました。  

---

## ⚙️ アプリ概要と機能
- **テーマ入力機能**：任意の社会課題・テーマを入力  
- **AIの意見生成**：AIが一方の立場から意見を提示  
- **反論入力**：ユーザーが自分の意見を考え、反論を記述  
- **AIの再反論**：AIが再び応答し、短いディベートを形成  
- **履歴機能**：過去のやり取りを振り返り、自分の思考の変化を確認可能  

この仕組みを通して、ユーザーは「考える時間」を意識的に確保し、  
AIとの対話をきっかけに自分の考えを深めることができます。

---

## 🛠️ 技術構成
- Framework: **Next.js (App Router)**  
- Language: **TypeScript**  
- Styling: **Tailwind CSS / shadcn/ui**  
- AI: **OpenAI API (GPT-4 or GPT-5)**  
- Hosting: **Vercel**  

開発の詳細やソースコードは以下のリポジトリで公開しています。  
👉 [https://github.com/<your-username>/thinkback-app](https://github.com/<your-username>/thinkback-app)

---

## 🚀 起動方法
```bash
git clone https://github.com/ciel-iel/web-app.git
cd thinkback-app
npm install
npm run dev

ブラウザでhttp://localhost:3000にアクセス。
*env.localに以下を設定してください：

OPEMAI_API_KEY=your_openai_api_key
