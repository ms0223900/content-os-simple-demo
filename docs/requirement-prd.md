## 需求概述

- 背景：使用者貼上會議筆記後，系統需產出 `Email + Blog` 結構化內容；輸出過程需模擬 LLM 不穩定（隨機壞輸出），並透過 Schema 驗證與重試機制確保最終可交付。
- 目標：
  - 在可接受時間內產出符合規格的 JSON 結果。
  - 明確顯示每次失敗原因（Parse / Schema）。
  - 產物可一鍵複製供外部使用。
- 目標用戶：
  - 內部 demo 使用者（開發者、PM、面試官、教學受眾）。
  - 後續可能接入真實 LLM 的工程團隊（先用 mock 驗證流程）。

---

## 進度核取清單（Progress Checklist）

- [ ] 核心 User Story 已確認
- [ ] 功能需求（頁面/流程/資料）已定義
- [ ] API 規格已定義
- [ ] Schema 與驗證規則已定義
- [ ] 驗收標準（Given/When/Then）已定義
- [ ] 風險與資訊缺口已標註

---

## 核心 User Stories

- As a content editor, I want to paste meeting notes and generate deliverable content, so that I can quickly get usable Email and Blog drafts.
- As a developer, I want the system to validate output by schema and retry on failures, so that final output format is reliable.
- As a demo viewer, I want to see attempt logs and failure reasons, so that I can understand system robustness and error handling behavior.

---

## 功能需求

### 1) 頁面與組件結構

- 主頁 `app/page.tsx`
  - 輸入區：meeting notes textarea
  - 操作區：`Generate` 按鈕
  - 嘗試紀錄區：attempt logs（逐次列出錯誤）
  - 結果區：Email / Blog 渲染與 Copy 按鈕
- 建議組件
  - `components/InputPanel.tsx`：輸入 + 觸發生成
  - `components/AttemptLogs.tsx`：顯示 `#attempt + errorType + message`
  - `components/ResultPanel.tsx`：顯示成功結果並支援一鍵複製

### 2) 主要流程（MVP）

1. 使用者輸入 meeting notes
2. 點擊 Generate
3. 系統取得 `raw output`（可能不合法）
4. `extractJson(raw)` 抽取 JSON 片段
5. `JSON.parse` 解析
6. AJV 依 schema 驗證
7. 失敗則記錄 log 並重試（直到成功或超過上限）
8. 成功後渲染 Email/Blog，支援 Copy

### 3) 資料結構設計（TypeScript 介面）

```ts
export interface ContentPack {
  meeting_title: string;
  email: {
    subject: string;
    draft: string;
  };
  blog: {
    title: string;
    outline: string[];
  };
}

export interface AttemptLog {
  attempt: number;
  ok: boolean;
  errorType?: "ParseError" | "SchemaError" | "UnknownError";
  message?: string;
}

export interface GenerateRequest {
  notes: string;
}

export interface GenerateResponse {
  raw: string;
}
```

### 4) Schema 規則（最小可交付）

- 必填：
  - `meeting_title`
  - `email.subject`
  - `email.draft`
  - `blog.title`
  - `blog.outline`
- 型別：
  - `meeting_title`, `email.subject`, `email.draft`, `blog.title` 必須為 string
  - `blog.outline` 必須為 string array

### 5) 模擬不穩輸出（錯誤模式）

- 非 JSON（純文字）
- 缺欄位（如缺 `email` 或缺 `blog.outline`）
- 型別錯誤（如 `blog.outline` 為 string）
- 前後雜訊（JSON 外多餘文字）

### 6) Retry 策略

- `maxAttempts = 5`
- 前期高失敗率、後期降低失敗率（如 attempt 1~2: 0.7，3~5: 0.2）
- 每次失敗寫入 AttemptLog
- 超過上限仍失敗時：
  - 顯示失敗狀態
  - 保留最後一次 `raw` 與錯誤資訊供除錯

---

## API 需求（端點與格式）

### 模式 A：純前端（最快）

- 不經 API，前端直接呼叫 mock generator。

### 模式 B：API Route（建議）

- Endpoint：`POST /api/generate`
- Request Body

```json
{ "notes": "string" }
```

- Response 200

```json
{ "raw": "string" }
```

- Response 400

```json
{ "error": "INVALID_INPUT", "message": "notes is required" }
```

- Response 500

```json
{ "error": "INTERNAL_ERROR", "message": "failed to generate raw output" }
```

---

## 設計規範

- 色彩
  - 主要操作按鈕使用高對比主色（可延用現有 design token）
  - 錯誤訊息使用紅色語意色，成功使用綠色語意色
- 字體與排版
  - 內文維持系統字體
  - Logs 區使用等寬字體可提升可讀性
- 間距
  - 主要區塊間距 16~24px
  - 結果卡片內邊距 12~16px
- 響應式
  - Mobile：區塊垂直堆疊
  - Desktop：Input / Logs / Result 可分區顯示

---

## 技術實現

- 技術棧
  - Next.js App Router
  - TypeScript
  - AJV（JSON schema validate）
- 建議模組
  - `lib/schema.ts`
  - `lib/validator.ts`
  - `lib/extractJson.ts`
  - `lib/mockGenerate.ts`
  - `lib/runWithRetry.ts`
  - `types/contentPack.ts`
- 資料獲取策略
  - MVP 可先純前端 mock
  - 若要貼近真實產品，改為 API route 回傳 raw；前端負責 parse + validate + retry（或後端集中處理，二擇一）

---

## 功能優先級

- P0（最優先）
  - 輸入 notes + Generate
  - 解析 JSON + AJV 驗證
  - Retry（maxAttempts）
  - 顯示錯誤 logs
  - 成功結果渲染 + Copy
- P1
  - Loose/Strict generator 切換策略
  - 更易讀的錯誤訊息格式化
  - 失敗狀態保留 raw output
- P2
  - 進階觀測（統計成功率、平均 attempt）
  - 可設定 schema 版本
  - 匯出結果（例如下載 JSON）

---

## 驗收標準（Acceptance Criteria）

- AC-1 成功流程
  - Given 使用者已輸入 notes
  - When 點擊 Generate
  - Then 系統在 1~5 次內完成符合 schema 的 `ContentPack` 並顯示 Email/Blog
- AC-2 Parse 失敗可追蹤
  - Given 回傳非 JSON 字串
  - When 系統執行 extract + parse
  - Then logs 顯示 `ParseError` 並進入下一次重試
- AC-3 Schema 失敗可追蹤
  - Given JSON 可 parse 但缺欄位或型別錯誤
  - When AJV 驗證
  - Then logs 顯示 `SchemaError` 與具體欄位訊息並重試
- AC-4 超過上限處理
  - Given 連續失敗達 maxAttempts
  - When 停止重試
  - Then 顯示失敗狀態且保留最後 raw + 錯誤訊息
- AC-5 複製功能
  - Given 已成功生成結果
  - When 使用者點擊 Email 或 Blog 的 Copy
  - Then 對應內容寫入剪貼簿並提供成功提示
- 效能（MVP）
  - 單次 attempt UI 不應阻塞互動
  - 5 次重試流程在可接受等待時間內完成（建議 < 5 秒，視 mock 延遲設定）

---

## 時程規劃（2 小時 MVP）

- 0.5h：型別、schema、validator、extractJson
- 0.5h：mock generator + retry loop + logs
- 0.5h：頁面整合（Input/Logs/Result）+ Copy
- 0.5h：錯誤處理、手動驗收、微調 UI

實作順序：`P0 -> P1（若有時間）`

---

## 風險與考量

- 技術風險
  - `extractJson` 以首尾大括號截取，對複雜雜訊字串可能誤判。
  - AJV 錯誤訊息需轉譯成人話，否則 demo 可讀性下降。
- 內容管理
  - meeting notes 可能含敏感資訊；若上線需加遮罩或資料留存策略。
- 安全性
  - 若改走 API，需限制 payload 長度與基本輸入驗證，避免濫用。
- 需求邊界
  - 目前是 mock，不含真實 LLM 串接、prompt 管理、模型配額與觀測。
