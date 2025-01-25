
# HTMLファイル自動生成ツール

このツールは、JSON形式の商品データに基づいて、複数のHTMLファイルを自動生成します。Handlebarsテンプレートエンジンを使用しており、商品ごとに異なるテンプレート、ヘッダー、フッター、追加コンテンツを適用できます。

## 機能

*   **JSONデータに基づくHTML生成:** 商品情報（名前、色、数量など）をJSONファイルで管理し、それを元にHTMLファイルを生成します。
*   **Handlebarsテンプレートエンジン:** HTMLの構造をテンプレートとして定義し、JSONデータと組み合わせてHTMLを生成します。これにより、動的なHTML生成が可能になります。
*   **商品ごとのテンプレート:** 商品ごとに異なるHTMLテンプレートを使用できます。
*   **共通ヘッダーとフッター:** 複数のヘッダーとフッターを定義し、商品ごとに選択できます。
*   **複数の追加コンテンツ:** 各商品バリエーションに対して、複数の追加コンテンツファイルを指定し、HTMLに埋め込むことができます。
*   **ファイル名のカスタマイズ:** Handlebarsの構文を使用して、ファイル名を動的に生成できます（例: `{{name}}_{{color}}.html`、`{{name}}_{{color}}_{{quantity}}.html`）。
*   **HTMLのminify:** 生成されたHTMLファイルをminifyし、ファイルサイズを小さくします。
*   **エラーハンドリング:** ファイルの読み込みや処理中に発生するエラーを適切に処理します。

## ディレクトリ構成

```
project/
├── products/          # products.json を配置
│   └── products.json
├── generate-files.ts # メインのスクリプト
├── output/          # 生成されたHTMLファイルが出力される
└── templates/
    ├── headers/      # 共通ヘッダーのテンプレート
    │   ├── header1.html
    │   └── header2.html
    ├── footers/      # 共通フッターのテンプレート
    │   ├── footer1.html
    │   └── footer2.html
    ├── contents/     # 追加コンテンツのHTMLファイル
    │   ├── productA_red1.html
    │   ├── productA_red2.html
    │   └── ...
    └── products/    # 商品ごとのHTMLテンプレート
        ├── templateA.html
        ├── templateB.html
        └── templateC.html
```

## 使用方法

1.  **必要なパッケージのインストール:**

    ```bash
    npm install typescript @types/node html-minifier handlebars --save-dev
    ```

2.  **JSONデータ (`products/products.json`) の作成:**

    商品情報をJSON形式で記述します。例:

    ```json
    [
        {
            "name": "商品A",
            "filenameTemplate": "{{name}}_{{color}}.html",
            "template": "templateA",
            "header": "header1",
            "footer": "footer1",
            "variations": [
                {
                    "color": "赤",
                    "contentFiles": ["productA_red1", "productA_red2"]
                },
                {
                    "color": "黄"
                }
            ]
        },
        // ... 他の商品データ
    ]
    ```

3.  **テンプレートファイルの作成:**

    `templates`ディレクトリ内に、ヘッダー、フッター、商品ごとのテンプレート、追加コンテンツのHTMLファイルを作成します。

4.  **スクリプトの実行:**

    ```bash
    npx ts-node generate-files.ts
    ```

    生成されたHTMLファイルは`output`ディレクトリに出力されます。

## JSONデータの構造

*   `name`: 商品名 (文字列)
*   `filenameTemplate`: ファイル名テンプレート (Handlebars構文の文字列)
*   `template`: 使用するHTMLテンプレートファイル名 (文字列)
*   `header`: 使用するヘッダーファイル名 (文字列)
*   `footer`: 使用するフッターファイル名 (文字列)
*   `variations`: 商品バリエーションの配列
    *   `color`: 色 (文字列)
    *   `quorty`: 数量 (文字列、オプション)
    * `contentFiles`: 追加コンテンツファイル名の配列（文字列配列、オプション）

## テンプレートファイルの記述

*   Handlebarsの構文 (`{{...}}`) を使用して、JSONデータから値を取得できます。
*   追加コンテンツは`{{{additionalContent}}}`で出力します。

## 補足事項

*   エラーが発生した場合は、コンソールにエラーメッセージが出力されます。
*   minifyのオプションは`generate-files.ts`内で変更できます。

```
