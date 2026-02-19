# GitHub Copilot Instructions

## プロジェクト概要

- 目的: `devcontainer.json` のトップレベルキーを人間が読みやすい順序でソートする
- 主な機能: devcontainer.json のキーをカテゴリ別にソート、未定義キーはアルファベット順に末尾追加
- 対象ユーザー: 開発者

## 共通ルール

- 会話は日本語で行う。
- PR とコミットは Conventional Commits に従う。`<description>` は日本語で記載する。
- 日本語と英数字の間には半角スペースを入れる。

## 技術スタック

- 言語: JavaScript (Node.js)
- モジュールシステム: CommonJS (require/exports)
- パッケージマネージャー: pnpm@10.28.1
- テストフレームワーク: Jest 30.2.0

## コーディング規約

- インデント: 2 スペース
- クォート: ダブルクォート (`"..."`)
- セミコロン: 必ず使用
- 命名規則: camelCase (関数、変数、定数)
- エラーハンドリング: ANSI カラーコード使用 (赤: エラー、黄: 警告、緑: 成功)
- エラーメッセージ: 英語で記載
- コメント: 日本語で記載
- Lint/Format: ESLint、Prettier は使用しない (既存パターンに従う)

## 開発コマンド

```bash
# 依存関係のインストール
pnpm install

# テスト実行
pnpm test

# ツール実行 (デフォルトパス)
node fixdevcontainer.js

# ツール実行 (カスタムパス)
node fixdevcontainer.js /path/to/devcontainer.json

# 依存関係チェック
npx depcheck
```

## テスト方針

- テストフレームワーク: Jest
- ファイルシステム操作は必ずモック化する
- console 出力もモック化する
- テストコマンド: `pnpm test`
- 新機能追加時は対応するテストも追加する

## セキュリティ / 機密情報

- API キーや認証情報を Git にコミットしない。
- ログに個人情報や認証情報を出力しない。

## ドキュメント更新

コード変更時に以下のドキュメントを更新する：

- `README.md`: 機能変更、使用方法の変更
- コード内コメント: 実装変更時

## リポジトリ固有

- このプロジェクトは lint/format スクリプトを持たない
- CI では以下をチェック:
  - `pnpm install --frozen-lockfile --prefer-frozen-lockfile`
  - `pnpm test`
  - `npx depcheck`
  - `git status` がクリーンであること
- Renovate による依存関係の自動更新が有効
- `.node-version` で Node.js バージョンを管理
