# Gemini CLI 向けコンテキストと作業方針

## 目的

このファイルは、Gemini CLI がこのプロジェクト (fixdevcontainer) で作業する際のコンテキストと作業方針を定義します。

## 出力スタイル

### 言語

- **会話**: 日本語
- **コード内コメント**: 日本語
- **エラーメッセージ**: 英語

### トーン

- 簡潔で明確な説明
- 技術的に正確な情報提供
- 必要に応じて具体的なコード例を提示

### 形式

- マークダウン形式で構造化
- コードブロックには言語指定
- 箇条書きで要点を整理

## 共通ルール

- **会話言語**: 日本語
- **コミット規約**: Conventional Commits に従う
  - `<type>(<scope>): <description>` 形式
  - `<description>` は日本語
  - 例: `fix: 未定義キーのソート処理を修正`
- **日本語と英数字の間**: 半角スペースを挿入

## プロジェクト概要

### 目的

`devcontainer.json` のトップレベルキーを人間が読みやすい順序でソートするツール。

### 主な機能

- devcontainer.json のキーをカテゴリ別に定義済み順序でソート
- 未定義キーはアルファベット順に末尾追加
- CLI ツールとして実行可能 (`npx fixdevcontainer`)

### 技術スタック

- **言語**: JavaScript (Node.js)
- **モジュールシステム**: CommonJS (require/exports)
- **パッケージマネージャー**: pnpm@10.28.1
- **テストフレームワーク**: Jest 30.2.0
- **実行環境**: Node.js (バージョンは `.node-version` で指定)

### プロジェクト構造

```
fixdevcontainer/
├── fixdevcontainer.js       # メイン CLI ツールとフォーマッターロジック
├── fixdevcontainer.test.js  # Jest テストスイート
├── package.json             # パッケージ設定
├── .node-version            # Node.js バージョン指定
└── .github/
    └── workflows/           # GitHub Actions ワークフロー
```

## コーディング規約

### フォーマット

- **インデント**: 2 スペース
- **クォート**: ダブルクォート (`"..."`)
- **セミコロン**: 必ず使用
- **改行**: Unix スタイル (LF)

### 命名規則

- **関数**: camelCase (例: `loadJson`, `formatter`)
- **変数**: camelCase (例: `predefinedOrder`, `jsonData`)
- **定数**: camelCase (例: `filename`)

### コメント言語

- **コード内コメント**: 日本語
- **エラーメッセージ**: 英語

### エラーメッセージ

ANSI カラーコード使用:

- 赤 (`\u001B[31m...\u001B[0m`): エラー
- 黄 (`\u001B[33m...\u001B[0m`): 警告
- 緑 (`\u001B[32m...\u001B[0m`): 成功

## 開発コマンド

```bash
# 依存関係のインストール
pnpm install

# テスト実行
pnpm test

# ツール実行 (デフォルト: .devcontainer/devcontainer.json)
node fixdevcontainer.js

# ツール実行 (カスタムパス)
node fixdevcontainer.js /path/to/devcontainer.json

# npx 経由で実行
npx fixdevcontainer [filename]

# 依存関係チェック
npx depcheck

# Git 状態確認
git status
git diff --exit-code
```

## テスト

### テストフレームワーク

Jest 30.2.0

### テスト方針

- ファイルシステム操作は `jest.mock("node:fs")` でモック化
- console 出力 (log/warn/error) もモック化
- 各テストケース後に `jest.clearAllMocks()` で初期化
- エッジケースも網羅的にテスト

### テスト実行

```bash
pnpm test
```

## 注意事項

### セキュリティ

- API キーや認証情報を Git にコミットしない
- ログに個人情報や認証情報を出力しない
- コミット前に `git diff` でセンシティブな情報を確認

### 既存ルールの優先

- このプロジェクトは **lint/format スクリプトを持たない**
- ESLint、Prettier は使用しない
- 既存のコードスタイルを手動で維持する
- 2 スペースインデント、ダブルクォート、セミコロンを守る

### 既知の制約

- Node.js の特定バージョンに依存 (`.node-version` 参照)
- CommonJS モジュールシステム使用 (ES Modules ではない)
- シンプルな単一ファイル構成を維持
- ビルドプロセスなし (純粋な JavaScript)

## CI/CD

### GitHub Actions でチェックされる項目

1. `pnpm install --frozen-lockfile --prefer-frozen-lockfile`
2. `pnpm test`
3. `npx depcheck`
4. `git status` がクリーンであること

### CI 成功条件

- すべてのテストが合格
- 未使用の依存関係がない
- Git 作業ツリーがクリーン (テスト実行でファイルが変更されない)

## リポジトリ固有

### 設計思想

- fixpack からインスパイアされた設計
- シンプルさを重視 (単一ファイル、最小限の依存関係)
- 人間が読みやすいキーソート順序

### 主要機能

- `predefinedOrder` 配列: devcontainer.json のキーソート順序を定義
- `formatter(filename)` 関数: ファイル読み込み、ソート、書き込みを行う
- 未定義キーの検出と警告

### Renovate

- 依存関係の自動更新が有効
- 既存の Renovate PR には追加コミットしない

### Node.js バージョン管理

- `.node-version` ファイルで管理
- CI/CD でも同じバージョンを使用

## 参考情報

- README.md: プロジェクト概要と使用方法
- LICENSE: MIT ライセンス
- fixdevcontainer.js: 実装の詳細
- fixdevcontainer.test.js: テストケース
