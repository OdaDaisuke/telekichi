# telekichi

## アルファ版までの道のり

- ディレクトリ構造が壊滅的に終わってるのを解消

```text
/child_process -> 再生プロキシ / 録画デーモン
/init_db -> DBスキーマ & seed初期化
lib/telekichi -> 各種デーモン & サーバ & フロントから共通して利用できるロジック
/src -> フロント側
```

## Features

- Mirakurun依存
- 機能
  - チャンネル一覧
  - 再生
  - 再生中のチャンネル切り替え
  - Webベース
  - スマホUI・PC UI作る
  - 複数デバイスで簡単に再生できるのを前提にしたものにしたい

## Roadmaps

- 保存先ストレージの選択
- 同時録画
- MSE/EMEでの再生に対応
- 字幕表示
- 副音声対応
- スクショのSNSシェア機能
- NAS OSの開発
- チューナ管理部分の自前開発

# How to start a local server for development

```bash
npm run dev
```

# Appendix

## Channel Mapping

GR:23 -> service.service_id
GR:25 -> service.id
