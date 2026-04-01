### US-005：實作 runWithRetry 核心流程

**作為** 開發者  
**我想要** 實作統一的 retry loop  
**以便** 將 generate → extract → parse → validate → log 的流程模組化並可重用

**輸入格式**：
- `notes: string`
- `maxAttempts: number`（預設 5）
- `generator`（可注入 loose/strict 或 API）

**輸出格式**：
- `lib/runWithRetry.ts`
  - `runWithRetry(params): Promise<{ ok: true; content: ContentPack; attempts: AttemptLog[] } | { ok: false; attempts: AttemptLog[]; lastRaw?: string }>`

**驗收條件**：
- [ ] 成功時回傳 `ContentPack` 與 attempts 記錄
- [ ] 失敗時回傳完整 attempts 與最後 raw
- [ ] 每次失敗都標記 `ParseError` 或 `SchemaError`
- [ ] 嘗試次數不超過 `maxAttempts`
- [ ] 可以切換 loose/strict 策略（例如 1~2 loose，3+ strict）

**依賴關係**：
- 需先完成：`US-002_實作輸出驗證器與錯誤格式化.md`
- 需先完成：`US-003_實作extractJson與Parse錯誤處理.md`
- 需先完成：`US-004_建立Mock生成器與錯誤模式.md`

**優先級**：P0  
**相關功能對應**：Retry 策略、主要流程
