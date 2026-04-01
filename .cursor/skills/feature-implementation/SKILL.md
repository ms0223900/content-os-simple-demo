---
name: feature-implementation
description: 將功能需求轉為可執行的實作流程，包含需求分析、功能設計、測試案例、實作、驗收與文件更新。Use when the user asks to run /feature, implement a new feature, or turn vague feature requests into concrete execution steps.
---

# Feature Implementation Workflow

## Purpose

把模糊需求整理成可驗收的功能，並以一致流程完成開發、測試與文件同步。

## Trigger Scenarios

當使用者出現以下意圖時使用本技能：
- 提到 `/feature`
- 要求「實作功能 / 開發新功能」
- 需求尚不完整，需要先分析與收斂
- 需要從驗收條件反推測試與實作

## Execution Rules

1. 先確認需求文件、設計稿、使用者故事是否存在且可用。
2. 先確認目標功能目前「尚未實作」，避免重工或重複開發。
3. 以驗收條件為中心：測試案例必須能直接對應驗收條件。
4. 小步驟迭代：每完成一段實作就快速驗證，不一次改太大。
5. 功能完成後，務必同步文件與使用者故事狀態。

## Workflow

依序執行以下 9 個步驟：

1. **分析需求（最重要）**
   - 校對需求文件與設計稿是否最新、是否符合使用者故事描述。
   - 先從測試案例、任務清單與現有程式碼交叉確認功能尚未實作。
   - 明確化輸入、輸出、限制條件、邊界情境與非功能需求。

2. **設計功能**
   - 定義功能範圍、資料流、元件/模組責任邊界。
   - 拆解可交付的實作任務，標記依賴與優先序。

3. **生成測試案例**
   - 依使用者故事驗收條件建立測試案例（正常、邊界、錯誤情境）。
   - 每一條驗收條件至少對應一條可執行測試。

4. **測試功能（先測試後實作）**
   - 先執行相關測試或驗證流程，確認目前狀態不符合新需求（預期失敗）。
   - 記錄 baseline，避免後續誤判。

5. **實作功能**
   - 按任務清單逐步實作，保持最小可驗證變更。
   - 遵循專案既有架構、命名與程式碼品質標準。

6. **驗收功能**
   - 驗證所有驗收條件都被滿足。
   - 補做回歸檢查，確認既有功能未受影響。

7. **文件化功能**
   - 更新必要技術文件（使用方式、限制、已知行為）。
   - 補充測試方式與驗收結果摘要。

8. **更新需求文件**
   - 同步實際交付內容、範圍差異與最終決策。
   - 標示未完成項目與後續待辦（若有）。

9. **更新使用者故事**
   - 將使用者故事狀態更新為最新，確認驗收條件逐條對齊。
   - 若存在差異，回補說明並建立後續任務。

## Output Format

執行本技能時，請用以下結構回報結果：

```markdown
## Feature Goal
- ...

## Requirement Analysis
- Current state:
- Gaps:
- Constraints:

## Implementation Plan
- [ ] Task 1
- [ ] Task 2

## Test Cases (Mapped to Acceptance Criteria)
- AC1 -> TC1, TC2
- AC2 -> TC3

## Implementation Result
- Changed files:
- Key decisions:

## Validation
- Acceptance criteria status:
- Regression check:

## Documentation Updates
- Updated docs:
- Updated user story:
```

## Definition of Done

以下條件全部成立才算完成：
- 驗收條件全部通過
- 主要流程與邊界情境已驗證
- 相關文件已更新
- 使用者故事狀態已同步
