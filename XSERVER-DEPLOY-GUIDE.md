# エックスサーバー自動デプロイ設定ガイド

## 🚀 概要

このガイドでは、GitHub Actionsを使用してエックスサーバーに自動デプロイする方法を説明します。

## 📋 前提条件

### 1. エックスサーバーの準備
- エックスサーバーのアカウント
- SSH接続の有効化
- デプロイ先ディレクトリの確認

### 2. GitHubリポジトリ
- GitHub Actionsが有効なリポジトリ
- 適切な権限設定

## 🔧 エックスサーバーの設定

### 1. SSH接続の有効化

1. エックスサーバーのサーバーパネルにログイン
2. 「SSH設定」を選択
3. SSH接続を「ON」に設定

### 2. SSH鍵の生成と登録

```bash
# SSH鍵を生成
ssh-keygen -t rsa -b 4096 -C "your-email@example.com" -f ~/.ssh/xserver_deploy

# 公開鍵をコピー
cat ~/.ssh/xserver_deploy.pub
```

1. 生成された公開鍵をコピー
2. エックスサーバーの「SSH設定」で公開鍵を登録

### 3. 接続情報の確認

エックスサーバーのサーバーパネルで以下を確認：
- **ホスト名**: `your-domain.xserver.jp`
- **ユーザー名**: サーバーパネルに表示されるユーザー名
- **デプロイパス**: `/home/username/domain.com/public_html`

## 🔐 GitHub Secretsの設定

GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」で以下を設定：

### 必須のSecrets

| Secret名 | 説明 | 例 |
|---------|------|-----|
| `XSERVER_SSH_PRIVATE_KEY` | SSH秘密鍵の内容 | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `XSERVER_HOST` | エックスサーバーのホスト名 | `your-domain.xserver.jp` |
| `XSERVER_USER` | SSH接続用ユーザー名 | `username` |
| `XSERVER_PATH` | デプロイ先パス | `/home/username/domain.com/public_html` |
| `XSERVER_DOMAIN` | ドメイン名 | `your-domain.com` |

### SSH秘密鍵の取得方法

```bash
# 秘密鍵の内容をコピー
cat ~/.ssh/xserver_deploy
```

**注意**: 秘密鍵は絶対に公開しないでください。

## 🚀 デプロイの実行

### 自動デプロイ

1. `main`ブランチにコードをプッシュ
2. GitHub Actionsが自動実行
3. テスト・ビルド・デプロイが順次実行

### 手動デプロイ

```bash
# 環境変数を設定
export XSERVER_HOST="your-domain.xserver.jp"
export XSERVER_USER="username"
export XSERVER_PATH="/home/username/domain.com/public_html"
export XSERVER_DOMAIN="your-domain.com"

# デプロイ実行
npm run deploy:xserver
```

### ドライラン（テスト）

```bash
# 実際にファイルを転送せずにテスト
npm run deploy:xserver:dry-run
```

## 📁 デプロイされるファイル

### 含まれるファイル
- `index.html`
- `src/main.js`
- `src/style.css`
- `dist/` ディレクトリ（ビルド済みファイル）

### 除外されるファイル
- `.git/`
- `node_modules/`
- `tests/`
- `.github/`
- `*.md`
- 設定ファイル（`.eslintrc.json`, `.prettierrc`など）
- `package.json`, `package-lock.json`

## 🔍 トラブルシューティング

### よくある問題

#### 1. SSH接続エラー
```
❌ SSH接続に失敗しました
```

**解決方法**:
- SSH鍵の設定を確認
- エックスサーバーのSSH設定を確認
- ホスト名・ユーザー名を確認

#### 2. 権限エラー
```
Permission denied (publickey)
```

**解決方法**:
- 公開鍵がエックスサーバーに正しく登録されているか確認
- 秘密鍵の内容が正しいか確認

#### 3. パスエラー
```
No such file or directory
```

**解決方法**:
- `XSERVER_PATH`が正しいか確認
- ディレクトリが存在するか確認

#### 4. ファイル転送エラー
```
rsync: connection unexpectedly closed
```

**解決方法**:
- ネットワーク接続を確認
- エックスサーバーの状態を確認
- ファイルサイズが大きすぎないか確認

### デバッグ方法

#### 1. SSH接続テスト
```bash
ssh -v username@your-domain.xserver.jp
```

#### 2. ファイル一覧確認
```bash
ssh username@your-domain.xserver.jp "ls -la /home/username/domain.com/public_html"
```

#### 3. 権限確認
```bash
ssh username@your-domain.xserver.jp "ls -la /home/username/domain.com/public_html"
```

## 📊 デプロイの監視

### GitHub Actions
- Actions タブでデプロイ状況を確認
- ログでエラーの詳細を確認

### アプリケーション確認
- デプロイ完了後、ブラウザでアクセス
- ヘルスチェック機能で自動確認

## 🔒 セキュリティ考慮事項

### 1. SSH鍵の管理
- 秘密鍵は絶対に公開しない
- 定期的に鍵を更新
- 不要な鍵は削除

### 2. アクセス制限
- 必要最小限の権限のみ付与
- デプロイ用ユーザーのみ使用

### 3. ログ管理
- デプロイログを定期的に確認
- 異常なアクセスを監視

## 📈 最適化のヒント

### 1. デプロイ速度の向上
- 不要なファイルを除外
- 圧縮転送を使用
- 差分転送を活用

### 2. 信頼性の向上
- バックアップ機能を活用
- ロールバック手順を準備
- ヘルスチェックを実装

### 3. 監視の強化
- デプロイ通知を設定
- エラーアラートを設定
- パフォーマンス監視

## 📞 サポート

### エックスサーバーサポート
- 公式サポート: https://www.xserver.ne.jp/support/
- マニュアル: https://www.xserver.ne.jp/manual/

### GitHub Actions
- 公式ドキュメント: https://docs.github.com/en/actions
- コミュニティ: https://github.community/

---

**注意**: この設定は一般的な例です。実際の環境に合わせて調整してください。
