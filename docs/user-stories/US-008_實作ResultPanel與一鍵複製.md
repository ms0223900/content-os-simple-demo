### US-008：實作 ResultPanel 與一鍵複製

**作為** 內容編輯者  
**我想要** 查看成功輸出的 Email 與 Blog 並可一鍵複製  
**以便** 直接將結果貼到外部工具使用

**輸入格式**：
- `content: ContentPack | null`
- 複製操作目標：`email` 或 `blog`

**輸出格式**：
- `components/ResultPanel.tsx`
  - Email：`subject` + `draft`
  - Blog：`title` + `outline` 條列
  - Copy 按鈕與成功/失敗提示

**驗收條件**：
- [x] 僅在成功結果存在時顯示內容
- [x] Email 與 Blog 各有獨立 Copy 操作
- [x] Copy 後顯示明確提示
- [x] `blog.outline` 以列表格式渲染

**依賴關係**：
- 需先完成：`US-001_定義核心型別與Schema.md`
- 建議先完成：`US-005_實作runWithRetry核心流程.md`

**優先級**：P0  
**相關功能對應**：Render + Copy

**狀態**：Done（2026-04-01）
