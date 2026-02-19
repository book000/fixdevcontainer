# Claude Code 作業方針

## 目的

このファイルは、Claude Code がこのプロジェクト (fixdevcontainer) で作業する際の方針とプロジェクト固有ルールを定義します。

## 判断記録のルール

判断は必ずレビュー可能な形で記録すること：

1. 判断内容の要約
2. 検討した代替案
3. 採用しなかった案とその理由
4. 前提条件・仮定・不確実性
5. 他エージェントによるレビュー可否

前提・仮定・不確実性を明示し、仮定を事実のように扱わないこと。

## プロジェクト概要

- 目的: `devcontainer.json` のトップレベルキーを人間が読みやすい順序でソートするツール
- 主な機能:
  - devcontainer.json のキーをカテゴリ別に定義済み順序でソート
  - 未定義キーはアルファベット順に末尾追加
  - CLI ツールとして `npx fixdevcontainer` で実行可能

## 重要ルール

- **会話言語**: 日本語
- **コミット規約**: Conventional Commits (`<description>` は日本語)
- **コメント言語**: 日本語
- **エラーメッセージ言語**: 英語

## 環境のルール

- **コミットメッセージ**: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) に従う
  - `<type>(<scope>): <description>` 形式
  - `<description>` は日本語
  - 例: `feat: ユーザー認証機能を追加`
- **ブランチ命名**: [Conventional Branch](https://conventional-branch.github.io) に従う
  - `<type>/<description>` 形式
  - `<type>` は短縮形 (feat, fix)
  - 例: `feat/add-user-auth`
- **GitHub リポジトリ調査**: テンポラリディレクトリに git clone して、そこでコード検索する
- **Renovate PR**: 既存の Renovate プルリクエストに対して、追加コミットや更新を行わない

## Git Worktree

このプロジェクトは Git Worktree を採用していません。通常のブランチ運用です。

## コード改修時のルール

- 日本語と英数字の間には半角スペースを挿入する
- エラーメッセージ: ANSI カラーコード使用 (赤: エラー、黄: 警告、緑: 成功)
- エラーメッセージは英語で記載
- 関数にはコメントを記載・更新する (日本語)
- インデント: 2 スペース
- クォート: ダブルクォート
- セミコロン: 必ず使用

## 相談ルール

### Codex CLI (ask-codex)

- 実装コードに対するソースコードレビュー
- 関数設計、モジュール内部の実装方針などの局所的な技術判断
- アーキテクチャ、モジュール間契約、パフォーマンス／セキュリティといった全体影響の判断
- 実装の正当性確認、機械的ミスの検出、既存コードとの整合性確認

### Gemini CLI (ask-gemini)

- SaaS 仕様、言語・ランタイムのバージョン差、料金・制限・クォータといった、最新の適切な情報が必要な外部依存の判断
- 外部一次情報の確認、最新仕様の調査、外部前提条件の検証

### 指摘への対応

他エージェントが指摘・異議を提示した場合、Claude Code は必ず以下のいずれかを行う。黙殺・無言での不採用は禁止する。

- 指摘を受け入れ、判断を修正する
- 指摘を退け、その理由を明示する

以下は必ず実施すること：

- 他エージェントの提案を鵜呑みにせず、その根拠や理由を理解する
- 自身の分析結果と他エージェントの意見が異なる場合は、双方の視点を比較検討する
- 最終的な判断は、両者の意見を総合的に評価した上で、自身で下す

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

# Git 状態確認 (CI と同様)
git status
git diff --exit-code
```

## アーキテクチャと主要ファイル

### 主要ディレクトリ

```
fixdevcontainer/
├── fixdevcontainer.js       # メイン CLI ツールとフォーマッターロジック
├── fixdevcontainer.test.js  # Jest テストスイート
├── package.json             # パッケージ設定
├── .node-version            # Node.js バージョン指定
├── .depcheckrc.json         # 依存関係チェック設定
└── .github/
    └── workflows/           # GitHub Actions ワークフロー
```

### アーキテクチャサマリー

- **モジュールシステム**: CommonJS (require/exports)
- **実行環境**: Node.js CLI ツール (shebang: `#!/usr/bin/env node`)
- **主要機能**: `formatter(filename)` 関数
- **キーソート順序**: `predefinedOrder` 配列で定義
- **エラーハンドリング**: 早期リターン方式、ANSI カラーコード使用

## 実装パターン

### 推奨パターン

- ファイル操作は `node:fs` モジュール使用
- エラー時は早期リターン (return null/undefined)
- ANSI カラーコードで視認性向上
- 既存コードのスタイルを踏襲 (2 スペース、ダブルクォート、セミコロン)

### 非推奨パターン

- ESLint/Prettier の導入 (このプロジェクトでは使用しない)
- TypeScript への変換 (JavaScript プロジェクトのまま維持)
- 複雑なビルドプロセスの追加 (シンプルさを保つ)

## テスト

### テスト方針

- テストフレームワーク: Jest
- ファイルシステム操作は必ずモック化
- console 出力 (log/warn/error) もモック化
- 各テストケース後に `jest.clearAllMocks()`

### 追加テスト条件

- 新機能追加時は対応するテストを追加
- エラーケースも網羅的にテスト
- モックの実装を正確に行う

## ドキュメント更新ルール

### 更新対象

- `README.md`: 機能変更、使用方法の変更時
- コード内コメント: 実装変更時
- このファイル (CLAUDE.md): プロジェクト方針変更時

### 更新タイミング

- 機能追加・変更のコミット時
- API 変更時
- 新しい制約・要件追加時

## 作業チェックリスト

### 新規改修時

1. プロジェクトを理解する (メモリファイル参照)
2. 作業ブランチが適切であることを確認する
3. 最新のリモートブランチに基づいた新規ブランチであることを確認する
4. PR がクローズされた不要ブランチが削除済みであることを確認する
5. `pnpm install` で依存関係をインストールする

### コミット・プッシュ前

1. Conventional Commits に従っていることを確認する
2. センシティブな情報が含まれていないことを確認する
3. Lint/Format エラーがないことを確認する (このプロジェクトでは手動確認)
4. `pnpm test` で動作確認を行う
5. 既存のコードスタイルに従っているか確認する

### PR 作成前

1. PR 作成の依頼があることを確認する
2. センシティブな情報が含まれていないことを確認する
3. コンフリクトの恐れがないことを確認する

### PR 作成後

1. コンフリクトがないことを確認する
2. PR 本文が最新状態のみを網羅していることを確認する
3. `gh pr checks <PR ID> --watch` で CI を確認する
   - `pnpm install` が成功
   - `pnpm test` が成功
   - `npx depcheck` が成功
   - `git status` がクリーン
4. Copilot レビューに対応し、コメントに返信する
5. コードレビューを実施し、指摘対応を行う
6. PR 本文の崩れがないことを確認する

## リポジトリ固有

- このプロジェクトは **lint/format スクリプトを持たない**
- 既存のコードスタイルを手動で維持する
- CI での自動チェック: install, test, depcheck, git status
- Renovate による依存関係の自動更新が有効
- `.node-version` で Node.js バージョンを管理
- シンプルな単一ファイル構成を維持する
- fixpack からインスパイアされた設計思想を踏襲する
