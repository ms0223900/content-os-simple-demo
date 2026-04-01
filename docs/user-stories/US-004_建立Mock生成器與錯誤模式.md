### US-004：建立 Mock 生成器與錯誤模式

**作為** Demo 開發者  
**我想要** 建立可控的 mock 輸出生成器（含常見壞輸出）  
**以便** 在不串接真實 LLM 的情況下，驗證 retry 與 validation 流程

**輸入格式**：
- `notes: string`
- `attempt: number`
- 可選：`mode: "loose" | "strict"`

**輸出格式**：
- `lib/mockGenerate.ts`
  - `mockGenerateLoose(input): string`
  - `mockGenerateStrict(input): string`
  - 內含四種錯誤輸出：非 JSON / 缺欄位 / 型別錯 / 前後雜訊

**驗收條件**：
- [x] 能穩定產生至少 1 種合法輸出與 4 種非法輸出
- [x] loose 模式失敗率高於 strict 模式
- [x] 輸出內容包含 PRD 定義之核心欄位語意
- [x] 輸出為 `raw string`（不直接回傳 object）

**依賴關係**：
- 建議先完成：`US-001_定義核心型別與Schema.md`

**優先級**：P0  
**相關功能對應**：隨機出錯設計、生成流程

**狀態**：Done（2026-04-01）
