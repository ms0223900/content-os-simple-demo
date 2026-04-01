### US-007：實作 AttemptLogs 與錯誤可視化

**作為** Demo 觀看者  
**我想要** 看到每一次 attempt 的結果與錯誤類型  
**以便** 快速理解系統在失敗時如何自動恢復

**輸入格式**：
- `attempts: AttemptLog[]`

**輸出格式**：
- `components/AttemptLogs.tsx`
  - 清單顯示：`#attempt errorType: message`
  - success / fail 樣式區分

**驗收條件**：
- [x] 每次重試皆新增一筆記錄
- [x] `ParseError` / `SchemaError` 顯示不同文案或標記
- [x] 成功時可顯示成功 attempt
- [x] 無 logs 時顯示空狀態提示

**依賴關係**：
- 需先完成：`US-001_定義核心型別與Schema.md`
- 需先完成：`US-005_實作runWithRetry核心流程.md`

**優先級**：P0  
**相關功能對應**：Attempt logs、錯誤可觀測性

**狀態**：Done（2026-04-01）
