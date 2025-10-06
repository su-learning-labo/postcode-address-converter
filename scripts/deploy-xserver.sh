#!/bin/bash

# エックスサーバー自動デプロイスクリプト
# 使用方法: ./deploy-xserver.sh

set -e

# 設定値（環境変数から取得）
XSERVER_HOST="${XSERVER_HOST:-}"
XSERVER_USER="${XSERVER_USER:-}"
XSERVER_PATH="${XSERVER_PATH:-}"
XSERVER_DOMAIN="${XSERVER_DOMAIN:-}"

# 必須パラメータのチェック
if [ -z "$XSERVER_HOST" ] || [ -z "$XSERVER_USER" ] || [ -z "$XSERVER_PATH" ]; then
    echo "エラー: 必須の環境変数が設定されていません"
    echo "XSERVER_HOST, XSERVER_USER, XSERVER_PATH を設定してください"
    exit 1
fi

echo "🚀 エックスサーバーへのデプロイを開始します..."

# ビルド
echo "📦 プロジェクトをビルドしています..."
npm run build

# SSH接続テスト
echo "🔐 SSH接続をテストしています..."
ssh -o ConnectTimeout=10 -o BatchMode=yes $XSERVER_USER@$XSERVER_HOST "echo 'SSH接続成功'" || {
    echo "❌ SSH接続に失敗しました"
    echo "SSH鍵の設定とエックスサーバーのSSH設定を確認してください"
    exit 1
}

# バックアップ作成
echo "💾 現在のファイルをバックアップしています..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
ssh $XSERVER_USER@$XSERVER_HOST "mkdir -p $XSERVER_PATH/../backups && cp -r $XSERVER_PATH $XSERVER_PATH/../backups/$BACKUP_DIR" || {
    echo "⚠️ バックアップの作成に失敗しましたが、デプロイを続行します"
}

# ファイル転送
echo "📤 ファイルを転送しています..."
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='tests' \
    --exclude='.github' \
    --exclude='*.md' \
    --exclude='.eslintrc.json' \
    --exclude='.prettierrc' \
    --exclude='vitest.config.js' \
    --exclude='package.json' \
    --exclude='package-lock.json' \
    ./ $XSERVER_USER@$XSERVER_HOST:$XSERVER_PATH

# ファイル権限設定
echo "🔧 ファイル権限を設定しています..."
ssh $XSERVER_USER@$XSERVER_HOST "chmod -R 755 $XSERVER_PATH"

# デプロイ確認
echo "✅ デプロイを確認しています..."
ssh $XSERVER_USER@$XSERVER_HOST "ls -la $XSERVER_PATH" || {
    echo "❌ デプロイの確認に失敗しました"
    exit 1
}

echo "🎉 デプロイが完了しました!"
if [ -n "$XSERVER_DOMAIN" ]; then
    echo "🌐 アプリケーションURL: https://$XSERVER_DOMAIN"
fi

# ヘルスチェック
if [ -n "$XSERVER_DOMAIN" ]; then
    echo "🔍 ヘルスチェックを実行しています..."
    sleep 5
    if curl -f -s "https://$XSERVER_DOMAIN" > /dev/null; then
        echo "✅ アプリケーションが正常に動作しています"
    else
        echo "⚠️ アプリケーションのヘルスチェックに失敗しました"
        echo "手動でアクセスを確認してください: https://$XSERVER_DOMAIN"
    fi
fi

echo "📊 デプロイ完了時刻: $(date)"
