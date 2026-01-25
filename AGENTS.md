# AI エージェント向け作業方針

## 目的

このファイルは、一般的な AI エージェントがこのプロジェクト (fixdevcontainer) で作業する際の共通方針を定義します。

## 基本方針

- **会話言語**: 日本語
- **コメント言語**: 日本語
- **エラーメッセージ言語**: 英語
- **コミット規約**: Conventional Commits に従う
  - `<type>(<scope>): <description>` 形式
  - `<description>` は日本語で記載
  - 例: `feat: ソート順序の改善`

## 判断記録のルール

重要な判断を行う際は、以下を明確に記録すること：

1. 判断内容の要約
2. 検討した代替案
3. 採用しなかった案とその理由
4. 前提条件・仮定・不確実性
5. 他エージェントによるレビュー可否

前提・仮定・不確実性を明示し、仮定を事実のように扱わないこと。

## プロジェクト概要

### 目的

`devcontainer.json` のトップレベルキーを人間が読みやすい順序でソートするツール。

### 主な機能

- devcontainer.json のキーをカテゴリ別に定義済み順序でソート
- 未定義キーはアルファベット順に末尾追加
- CLI ツールとして `npx fixdevcontainer` で実行可能

### 技術スタック

- **言語**: JavaScript (Node.js)
- **モジュールシステム**: CommonJS (require/exports)
- **パッケージマネージャー**: pnpm@10.28.1
- **テストフレームワーク: Jest 30.2.0**

## 開発手順（概要）

### 1. プロジェクト理解

- README.md でプロジェクトの目的を理解
- fixdevcontainer.js で実装ロジックを理解
- fixdevcontainer.test.js でテスト内容を理解

### 2. 依存関係インストール

```bash
pnpm install
```

### 3. 変更実装

- 既存のコードスタイルに従う (2 スペース、ダブルクォート、セミコロン)
- エラーハンドリングは早期リターン方式
- ANSI カラーコード使用 (赤: エラー、黄: 警告、緑: 成功)
- コメントは日本語で記載

### 4. テストと検証

```bash
# テスト実行
pnpm test

# 依存関係チェック
npx depcheck

# Git 状態確認
git status
```

## コーディング規約

### スタイル

- **インデント**: 2 スペース
- **クォート**: ダブルクォート (`"..."`)
- **セミコロン**: 必ず使用
- **命名規則**: camelCase (関数、変数、定数)

### エラーハンドリング

- ANSI カラーコード使用:
  - 赤 (`\u001B[31m...\u001B[0m`): エラー
  - 黄 (`\u001B[33m...\u001B[0m`): 警告
  - 緑 (`\u001B[32m...\u001B[0m`): 成功
- エラーメッセージは英語
- 早期リターン (null/undefined) でエラー処理

### テスト

- ファイルシステム操作は必ずモック化
- console 出力 (log/warn/error) もモック化
- 各テスト後に `jest.clearAllMocks()`
- 新機能追加時は対応するテストも追加

## セキュリティ / 機密情報

- API キーや認証情報を `.env` や設定ファイルで管理し、Git にコミットしない
- ログに個人情報や認証情報を出力しない
- コミット前に `git diff` でセンシティブな情報が含まれていないか確認

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
```

## CI/CD

GitHub Actions でチェックされる項目：

1. `pnpm install --frozen-lockfile --prefer-frozen-lockfile`
2. `pnpm test`
3. `npx depcheck`
4. `git status` がクリーンであること

## リポジトリ固有

- このプロジェクトは **lint/format スクリプトを持たない**
- ESLint、Prettier は使用しない
- 既存のコードスタイルを手動で維持する
- シンプルな単一ファイル構成を維持する
- Renovate による依存関係の自動更新が有効
- `.node-version` で Node.js バージョンを管理
- fixpack からインスパイアされた設計思想を踏襲する
- 主要ファイル:
  - `fixdevcontainer.js`: メイン実装
  - `fixdevcontainer.test.js`: テストスイート
  - `package.json`: パッケージ設定

## ドキュメント

### 更新対象

- `README.md`: 機能変更、使用方法の変更時
- コード内コメント: 実装変更時

### 重要な情報源

- README.md: プロジェクト概要と使用方法
- LICENSE: MIT ライセンス
- fixdevcontainer.js 内の `predefinedOrder`: ソート順序定義
