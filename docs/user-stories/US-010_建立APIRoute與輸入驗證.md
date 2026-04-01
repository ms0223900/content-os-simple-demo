### US-010：建立 API Route 與輸入驗證（可選）

**作為** 工程團隊  
**我想要** 透過 `/api/generate` 取得 raw output  
**以便** 後續可平滑替換為真實 LLM 供應端

**輸入格式**：
- HTTP POST `/api/generate`
- Body: `{ "notes": "string" }`

**輸出格式**：
- 200: `{ "raw": "string" }`
- 400: `{ "error": "INVALID_INPUT", "message": "notes is required" }`
- 500: `{ "error": "INTERNAL_ERROR", "message": "failed to generate raw output" }`

**驗收條件**：
- [x] 空或無效 `notes` 會回傳 400
- [x] 正常請求可回傳 raw 字串（可能是壞輸出）
- [x] 例外狀況回傳 500 且有一致錯誤格式
- [x] 前端可切換直接 mock / API route 模式

**依賴關係**：
- 建議先完成：`US-004_建立Mock生成器與錯誤模式.md`
- 建議先完成：`US-009_串接主頁資料流與狀態管理.md`

**優先級**：P1  
**相關功能對應**：API 需求、部署前擴充性

**狀態**：Done（2026-04-01）
