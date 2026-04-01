### 一句話

貼上會議筆記 → 按 Generate → 產出 `Email + Blog` 的 **JSON** → 用 Schema gate 驗證 → **隨機出錯**時自動重試 → 最後顯示可複製結果。

---

### Demo 定位（為什麼這題適合測 Cursor Free）

- **真實感**：就算不接 LLM，也能用「隨機壞輸出」模擬模型不穩。
- **可控**：所有輸出必須通過 JSON Schema；不過就重試，直到可交付。
- **工程涵蓋面完整**：UI/狀態管理、API（可選）、JSON 解析、錯誤處理、重構（抽模組/拆元件）。

---

### MVP 範圍（2 小時版本）

1. **Input**：一個 textarea 貼 meeting notes（raw text）
2. **Generate**：按一下產生 *可能壞掉* 的 raw output（字串）
3. **Parse + Extract**：嘗試從 raw output 萃取出 JSON 片段並 parse
4. **Validate（Schema gate）**：AJV 驗證 JSON 格式是否符合規格
5. **Retry**：失敗就重試（最多 N 次，且可設計「越後面越容易成功」）
6. **Render + Copy**：成功後顯示 Email / Blog，並一鍵 Copy

---

### 輸出 Schema（極簡版）

> 這份 schema 是「可交付」的最小集合，渲染也最簡單。
> 
- `meeting_title`: string
- `email`:
    - `subject`: string
    - `draft`: string
- `blog`:
    - `title`: string
    - `outline`: string[]  （條列）

---

### 隨機出錯設計（模擬 LLM 不穩的 4 種常見壞法）

> 目標：讓 retry + validation 看起來很真實，但實作成本低。
> 
1. **非 JSON**：回傳一般文字（完全不是 JSON）
2. **缺欄位**：JSON 可 parse，但缺 `email` 或缺 `blog.outline`
3. **型別錯**：例如 `blog.outline` 給 string；或 `email.subject` 給 number
4. **前後雜訊**：JSON 前後加說明文字（像 `Sure! Here is the JSON:`）

---

### Validate 規則（最小可用）

- 必須有 `meeting_title`, `email.subject`, `email.draft`, `blog.title`, `blog.outline`
- `blog.outline` 必須是 string array

---

### Retry 策略（可控、可 demo、避免一直失敗）

**建議參數**

- `maxAttempts = 5`
- `baseFailureRate = 0.7`（前兩次較常失敗）
- 後面逐步降低失敗率（例如 attempt 3+ 改成 0.2）

**行為**

- 每次產生後：`extractJson(raw)` → `JSON.parse` → `ajvValidate`
- 若失敗：記錄 log（attempt, errorType, message）→ 下一次重試
- 若超過上限：顯示失敗（但保留最後一次 raw output 與錯誤）

**更像真實世界的變體（選做）**

- `mockGenerateLoose()`：常壞（模擬「沒約束的模型」）
- `mockGenerateStrict()`：較少壞（模擬「加了更嚴格 prompt/約束」）
- 規則：attempt 1–2 用 loose；attempt 3–5 用 strict

---

### UI 設計（最小但好 demo）

1. Input textarea + Generate button
2. Attempt logs（每次失敗一行）
    - 例：`#2 ParseError: Unexpected token ...`
    - 例：`#3 SchemaError: blog.outline should be array`
3. Result
    - Email 區塊（Subject + Draft）+ Copy
    - Blog 區塊（Title + Outline）+ Copy

---

### Demo 可驗收點（完成定義）

- 按 Generate 能在 1–5 次內成功產出符合 schema 的 JSON
- UI 能顯示每次失敗原因（parse / missing field / type mismatch）
- 結果可一鍵複製（Email / Blog）
- 主要模組已拆開（不全部塞在一個檔案）

---

## 專案架構（你會做到什麼程度）

> 以 Next.js App Router 為例；如果你想再快，也可以改成 Vite + SPA（但這份以 Next 為主，較貼近你預想教學流程）。
> 

### Routes / Pages

- `app/page.tsx`
    - 頁面 UI（Input / Generate / Logs / Result）

### APIs（兩種模式，二選一）

**模式 A：純前端（最快）**

- 不做 API route
- 直接在前端呼叫 `mockGenerate()`

**模式 B：走 API route（更像真實產品，仍不接 LLM）**

- `app/api/generate/route.ts`
    - POST: `{ notes: string }` → 回傳 `{ raw: string }`（刻意可能壞）
    - 好處：未來要接 LLM 時，只換這個 route

### Components

- `components/InputPanel.tsx`
    - textarea + Generate button
- `components/AttemptLogs.tsx`
    - 顯示每次 attempt 的結果（success/fail）
- `components/ResultPanel.tsx`
    - Email / Blog 渲染 + Copy

### Core modules（關鍵：讓你能測 Cursor 的重構/拆模組能力）

- `lib/schema.ts`
    - JSON schema 定義
- `lib/validator.ts`
    - AJV 初始化、validate function、錯誤格式化
- `lib/extractJson.ts`
    - 從 raw string 抽出 JSON（處理前後雜訊）
- `lib/mockGenerate.ts`
    - `mockGenerateLoose()` / `mockGenerateStrict()`
    - 內含 4 種錯誤模式（非 JSON / 缺欄位 / 型別錯 / 前後雜訊）
- `lib/runWithRetry.ts`
    - 核心 retry loop：attempt → parse → validate → log → retry

### Types

- `types/contentPack.ts`
    - `ContentPack` 型別（對應 schema）

---

## extractJson 設計（關鍵細節）

**需求**：raw output 可能長這樣：

- `Sure! Here is the JSON:\n{ ... }\nHope this helps!`

**最小策略**

- 找第一個 `{` 與最後一個 `}` 的區間
- 取 substring 後再 `JSON.parse`

**失敗時的處理**

- 找不到 `{` 或 `}`：直接丟 ParseError
- `JSON.parse` 失敗：記錄錯誤訊息到 logs

---

## 測 Cursor Free 的觀察清單（做的時候順手記）

- 建專案 + 跑起來的順暢度
- Cursor 對「拆檔、抽共用函式、改資料流」的支援程度
- Parse / validate 出錯時，Cursor 能否快速定位與給可行修法
- 將錯誤訊息「變成人話」的能力（errors formatting）
- Retry loop 的重構（從頁面內 inline → 抽成 `runWithRetry`）