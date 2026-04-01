### US-001：定義核心型別與 Schema

**作為** 前端工程師  
**我想要** 建立 `ContentPack` 與 `AttemptLog` 型別，以及 AJV 可用的 JSON Schema  
**以便** 後續 parse、validate、retry 與 UI 渲染都能共用一致資料契約

**輸入格式**：
- 來源文件：`docs/requirement-prd.md`
- 需求欄位：
  - `meeting_title: string`
  - `email.subject: string`
  - `email.draft: string`
  - `blog.title: string`
  - `blog.outline: string[]`

**輸出格式**：
- `types/contentPack.ts`
  - `ContentPack`
  - `AttemptLog`
- `lib/schema.ts`
  - JSON Schema 物件（AJV 可直接驗證）

**驗收條件**：
- [x] `ContentPack` 與 PRD 欄位完全一致
- [x] `blog.outline` 型別為 `string[]`
- [x] Schema required 欄位完整
- [x] Schema 可被 AJV 正常載入
- [x] 沒有多餘或未定義欄位（若有需明確宣告允許）

**依賴關係**：
- 無（起始任務）

**優先級**：P0  
**相關功能對應**：Schema 規則、資料結構設計

**狀態**：Done（2026-04-01）
