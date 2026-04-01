### US-003：實作 extractJson 與 Parse 錯誤處理

**作為** 開發者  
**我想要** 從含雜訊字串中抽出 JSON 並安全 parse  
**以便** 系統能處理 `Sure! ... {json} ...` 這類常見模型輸出格式

**輸入格式**：
- `raw: string`（可能是非 JSON、雜訊包裹 JSON、或破損 JSON）

**輸出格式**：
- `lib/extractJson.ts`
  - `extractJson(raw: string): string`
  - `parseJsonSafely(raw: string): { ok: true; data: unknown } | { ok: false; errorType: "ParseError"; message: string }`

**驗收條件**：
- [x] 純 JSON 字串可正確 parse
- [x] 前後含雜訊時可抽出 JSON 並 parse
- [x] 找不到 `{` / `}` 時回傳 `ParseError`
- [x] JSON 語法錯誤時回傳 `ParseError` 且含原始錯誤訊息

**依賴關係**：
- 無（可與 US-001 並行）

**優先級**：P0  
**相關功能對應**：Parse + Extract、前後雜訊處理

**狀態**：Done（2026-04-01）
