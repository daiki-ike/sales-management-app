# 売上管理アプリ

Reactの静的アプリです。部門・個人CSVの取込、合計、順位、グラフ、CSV出力に対応します。

## ローカル起動

Node.js 24 LTS（24.15以上）、または22 LTS（22.22.2以上）を使用します。

```powershell
npm ci
npm start
```

http://127.0.0.1:3000 を開きます。CSVはブラウザーで処理します。

## 検証とビルド

```powershell
npm test
npm run build
npm run preview
npm audit
```

`npm test`はCSV取込・集計・順位・詳細表示の回帰テストを実行します。
`npm run test:watch`で継続実行できます。ビルド出力先は従来どおり`build/`です。

## Vercel

`vercel.json`でVite、`npm ci`、`npm run build`、出力`build`を指定しています。
本番反映前にVercelのNodeバージョンが上記条件を満たすことを確認してください。

## 2026-10-22の依存脆弱性対策

保守終了したCreate React Appの`react-scripts`をViteへ置き換えました。
JSXの入口・アプリ・テストを`.jsx`に変更し、HTMLをルートへ移しました。
集計・CSV・ランキング処理のコードと初期データは変更していません。
テストは初期テンプレート用Jestテストから、実際の機能を確認するVitestへ移行しています。
外部Tailwind CDNの読込みは従来構成を維持しています。npm監査はCDNや独自実装の安全性を保証しません。

`README.old.md`は旧構成の資料です。現在の実行手順はこのファイルを使ってください。
