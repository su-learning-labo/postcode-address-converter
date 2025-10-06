# 📮 郵便番号→住所検索ツール

7桁の郵便番号を入力すると、対応する住所を自動で検索・表示し、住所をクリックするとGoogle Mapsで位置を確認できるWebアプリケーションです。

## ✨ 主な機能

- **リアルタイム検索**: 7桁の郵便番号を入力すると自動で住所を検索
- **バリデーション**: 入力値の形式チェック（7桁の半角数字のみ）
- **エラーハンドリング**: 該当なし・通信エラーなどの適切な処理
- **Google Maps連携**: 住所をクリックするとGoogle Mapsで位置を表示
- **確認ダイアログ**: 誤操作を防ぐための確認メッセージ
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **美しいUI**: モダンでクリーンなデザイン
- **TDD開発**: テスト駆動開発で高品質なコードを実現

## 🛠️ 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **API**: [ZipCloud API](https://zipcloud.ibsnet.co.jp/)
- **地図サービス**: Google Maps
- **テスト**: Vitest + jsdom
- **開発手法**: TDD (Test-Driven Development)

## 📁 プロジェクト構造

```
postcode-address-converter/
├── 📁 src/
│   ├── main.js         # アプリケーションのメインロジック
│   └── style.css       # スタイルシート
├── 📁 tests/
│   └── main.test.js    # main.jsに対応するテストコード
├── index.html          # HTMLのメインファイル
├── package.json        # プロジェクト管理ファイル
├── vitest.config.js    # テスト設定ファイル
├── .gitignore          # Git除外設定
└── README.md           # アプリの説明書
```

## 🚀 セットアップ

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **テストの実行**
   ```bash
   npm test
   ```

3. **開発モードでのテスト実行**
   ```bash
   npm run test:watch
   ```

4. **アプリケーションの起動**
   ```bash
   # ローカルサーバーを起動
   python3 -m http.server 8000
   
   # ブラウザでアクセス
   open http://localhost:8000
   ```

## 🧪 テスト

このプロジェクトはTDD（テスト駆動開発）で構築されています。

### テストの実行

```bash
# 全テストを実行
npm test

# ウォッチモードでテストを実行
npm run test:watch

# UI付きでテストを実行
npm run dev
```

### テストカバレッジ

- `validatePostcode`: 郵便番号のバリデーション機能
- `searchAddressByPostcode`: 住所検索機能
- `openInGoogleMaps`: Google Maps連携機能
- `confirmAndOpenGoogleMaps`: 確認ダイアログ機能
- エラーハンドリング（無効な郵便番号、該当なし、通信エラー）

**テスト結果**: 13テスト中13テスト成功 ✅

## 📱 使用方法

1. ローカルサーバーを起動（`python3 -m http.server 8000`）
2. ブラウザで`http://localhost:8000`にアクセス
3. 郵便番号入力欄に7桁の数字を入力
4. 7桁入力完了と同時に自動で住所が検索・表示される
5. 住所をクリックすると確認ダイアログが表示される
6. 「OK」を選択するとGoogle Mapsで住所の位置を表示

### 入力例

- `1000001` → `東京都 千代田区 千代田` → クリックでGoogle Maps表示
- `5300001` → `大阪府 大阪市北区 梅田` → クリックでGoogle Maps表示
- `9999999` → `❌ 該当する住所が見つかりませんでした`

### 動作の流れ

1. **入力中**: `1/7 桁入力中...` → `2/7 桁入力中...` → ...
2. **検索中**: `🔍 検索中...`
3. **結果表示**: 成功時は住所、エラー時はエラーメッセージ
4. **住所クリック**: 確認ダイアログ表示
5. **Google Maps**: 新しいタブで住所の位置を表示

## 🔧 API仕様

### ZipCloud API

- **エンドポイント**: `https://zipcloud.ibsnet.co.jp/api/search`
- **パラメータ**: `zipcode` (7桁の郵便番号)
- **レスポンス形式**: JSON

### レスポンス例

```json
{
  "status": 200,
  "message": null,
  "results": [
    {
      "address1": "東京都",
      "address2": "千代田区",
      "address3": "千代田",
      "kana1": "トウキョウト",
      "kana2": "チヨダク",
      "kana3": "チヨダ"
    }
  ]
}
```

### Google Maps連携

- **URL形式**: `https://www.google.com/maps/search/?api=1&query=エンコードされた住所`
- **動作**: 新しいタブで開く（`noopener,noreferrer`でセキュリティ確保）
- **確認ダイアログ**: 誤操作を防ぐための確認メッセージ

## 🎨 デザイン特徴

- **クリーンなデザイン**: シンプルで使いやすいインターフェース
- **モダンなカラーパレット**: CSS変数を使用した一貫したデザインシステム
- **インタラクティブな要素**: ホバー効果とアニメーション
- **レスポンシブ**: モバイルファーストデザイン
- **アクセシビリティ**: 高コントラストモード対応、モーション軽減設定対応
- **視覚的フィードバック**: 住所クリック時のホバー効果

## 🚀 デプロイメント

### GitHub Pages（開発・テスト用）
- **URL**: `https://su-learninglabo.github.io/postcode-address-converter`
- **自動デプロイ**: mainブランチへのプッシュ時
- **手動デプロイ**: Actions タブから実行可能

### エックスサーバー（本番環境）
- **自動デプロイ**: mainブランチへのプッシュ時
- **SSH接続**: セキュアなファイル転送
- **バックアップ**: 自動バックアップ機能
- **ヘルスチェック**: デプロイ後の自動確認

#### エックスサーバーデプロイの設定

1. **SSH接続の有効化**
   - エックスサーバーのサーバーパネルでSSH設定をON

2. **SSH鍵の生成と登録**
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your-email@example.com" -f ~/.ssh/xserver_deploy
   cat ~/.ssh/xserver_deploy.pub  # 公開鍵をコピー
   ```

3. **GitHub Secretsの設定**
   - `XSERVER_SSH_PRIVATE_KEY`: SSH秘密鍵
   - `XSERVER_HOST`: エックスサーバーのホスト名
   - `XSERVER_USER`: SSH接続用ユーザー名
   - `XSERVER_PATH`: デプロイ先パス
   - `XSERVER_DOMAIN`: ドメイン名

詳細な設定方法は [XSERVER-DEPLOY-GUIDE.md](./XSERVER-DEPLOY-GUIDE.md) を参照してください。

## 🔒 セキュリティ

- **外部リンク**: `noopener,noreferrer`オプションでセキュリティ確保
- **確認ダイアログ**: 誤操作による意図しない外部サイト遷移を防止
- **入力検証**: 郵便番号の形式チェック
- **エラーハンドリング**: 適切なエラーメッセージ表示

## 📊 パフォーマンス

- **軽量**: 依存関係を最小限に抑制
- **高速**: リアルタイム検索による即座の結果表示
- **効率的**: 必要なAPIのみを呼び出し
- **最適化**: CSS変数とモダンなJavaScript使用

## 🚀 今後の拡張可能性

- **履歴機能**: 検索履歴の保存・表示
- **お気に入り**: よく使う住所の保存
- **複数住所表示**: 同一郵便番号の複数住所対応
- **地図埋め込み**: Google Maps APIを使用した地図表示
- **PWA対応**: オフライン機能の追加

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。

## 📞 サポート

何か問題がございましたら、GitHubのIssuesでお知らせください。

---

**開発者向け情報**

- **テスト環境**: Vitest + jsdom
- **コード品質**: ESLint推奨
- **ブランチ戦略**: mainブランチで直接開発
- **コミットメッセージ**: 日本語での記述を推奨