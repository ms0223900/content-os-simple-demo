### US-006：實作 InputPanel 與 Generate 觸發

**作為** 內容編輯者  
**我想要** 輸入 meeting notes 並按下 Generate  
**以便** 觸發內容生成與重試流程

**輸入格式**：
- UI 輸入：`notes: string`
- 按鈕事件：`onGenerate(notes)`

**輸出格式**：
- `components/InputPanel.tsx`
  - textarea + Generate button
  - loading / disabled state 控制

**驗收條件**：
- [x] 空字串不可送出，需提示使用者
- [x] Generate 點擊後會呼叫上層 `onGenerate`
- [x] 生成期間按鈕 disabled，避免重複提交
- [x] 手機與桌面版排版可正常顯示

**依賴關係**：
- 無（可先行做 UI 殼）
- 若要端到端觸發需完成：`US-005_實作runWithRetry核心流程.md`

**優先級**：P0  
**相關功能對應**：Input、Generate

**狀態**：Done（2026-04-01）
