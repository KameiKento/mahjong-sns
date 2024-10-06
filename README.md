# 麻雀何切る問題 - ローカルセットアップ手順

## 1. プロジェクトのクローン

まず、プロジェクトをローカルマシンにクローンします。GitHubなどのリポジトリを使用している場合は以下のコマンドを使用します：

```bash
git clone https://github.com/yourusername/mahjong-social.git
cd mahjong-social
```

もしGitHubを使用していない場合は、プロジェクトのファイルを適当なディレクトリにコピーしてください。

## 2. 依存関係のインストール

プロジェクトディレクトリで以下のコマンドを実行し、必要な依存関係をインストールします：

```bash
npm install
```

## 3. 環境変数の設定

`.env.local` ファイルをプロジェクトのルートディレクトリに作成し、以下の内容を追加します：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

`your-project-id` と `your-anon-key` は、Supabaseプロジェクトの設定から取得した実際の値に置き換えてください。

## 4. アプリケーションの実行

以下のコマンドでアプリケーションを起動します：

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてアプリケーションにアクセスできます。

## 注意事項

- Supabaseの設定（特にGoogle認証）が正しく行われていることを確認してください。
- ローカル環境で実行する場合、Supabaseのプロジェクト設定で許可されているURLに `http://localhost:3000` を追加する必要があるかもしれません。