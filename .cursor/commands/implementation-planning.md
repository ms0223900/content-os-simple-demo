# /implementation-planning

## Description
實作評估 - 評估技術實現方案與架構設計

## Usage
評估和設計技術實現方案，包含模組拆解和技術解決方案設計

## Two Main Phases

### Phase 1: 模組拆解 (Module Decomposition)
設計解決方案的「架構」，從使用者的使用流程來思考

#### Prompt Template
```
{功能}，可以參考 @{需求文件} 這個需求檔案中的描述，請依照以下原則，拆解功能的模組，提供給我模組拆解的建議。

- 從使用者的使用流程來思考
- 使用樹狀結構思考法
- 拆解成可以獨立開發的模組
- 每個模組都要有清楚的輸入輸出
- 每個模組都要能夠獨立驗證功能完整性
```

### Phase 2: 設計技術解決方案 (Technical Solution Design)
設計解決方案的「實作細節」，考量未來設計的彈性

#### Prompt Template
```
請幫我依照需求和拆解後的模組，考量未來設計的彈性，設計技術解決方案，請以依照結構性良好的序列清單來撰寫。
- 需求綱要： @{PRD}
- 脈絡： @{需求文件}
- 模組拆解：@{模組拆解文件}
```

## Technical Solution Summary Example
```
## 技術解決方案總結 / Technical Solution Summary

本方案採用分層架構與策略模式，擴展現有計算機為科學計算模式。

**核心架構**：維持 UI → State → Engine → Types 四層，各層職責明確、低耦合。

**運算引擎層**：以策略模式實作科學計算函數，透過 `FunctionRegistry` 動態註冊策略，`ScientificCalculatorEngine` 協調路由。三角、指數、對數函數各自獨立模組，未來可擴展統計、矩陣等。

**狀態管理層**：標準與科學模式狀態分離，透過組合模式整合。`useScientificCalculatorState` 擴展現有狀態，`useAngleModeState` 獨立管理角度模式。

**型別系統**：先定義型別再實作，確保型別安全與可擴展性。統一 `CalculationResult` 介面，支援策略註冊與錯誤處理。

**擴展性**：新增函數僅需實作策略並註冊，無需修改核心邏輯。支援插件化設計，未來可動態載入運算模組。

**實作順序**：型別定義與工具層 → 運算引擎 → 狀態管理 → UI 呈現 → 優化測試。
```

## Implementation Sequence
1. 型別定義與工具層
2. 運算引擎實作
3. 狀態管理實作
4. UI 呈現實作
5. 測試優化