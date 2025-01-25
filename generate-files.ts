import * as fs from 'fs/promises';
import * as path from 'path';
import { minify } from 'html-minifier';
import Handlebars from 'handlebars';

interface ProductVariation {
    code: string;
    color: string;
    quantity?: string;
    contentFiles?: string[];
}

interface Product {
    name: string;
    filenameTemplate: string;
    template: string;
    header: string;
    footer: string;
    variations: ProductVariation[];
}

async function generateFiles() {
    const outputDir = path.join(__dirname, 'output');
    const productsJsonPath = path.join(__dirname, 'products', 'products.json');
    const templatesDir = path.join(__dirname, 'templates', 'products');
    const headersDir = path.join(__dirname, 'templates', 'headers');
    const footersDir = path.join(__dirname, 'templates', 'footers');
    const contentsDir = path.join(__dirname, 'templates', 'contents');

    try {
        await fs.mkdir(outputDir, { recursive: true });
    } catch (err) {
        console.error("Failed to create directory:", err);
    }

    try {
        const productsData: Product[] = JSON.parse(await fs.readFile(productsJsonPath, 'utf-8'));

        for (const product of productsData) {
            try {
                const templatePath = path.join(templatesDir, `${product.template}.html`);
                const templateContent = await fs.readFile(templatePath, 'utf-8');
                const template = Handlebars.compile(templateContent);

                const headerPath = path.join(headersDir, `${product.header}.html`);
                const headerContent = await fs.readFile(headerPath, 'utf-8');
                const headerTemplate = Handlebars.compile(headerContent);

                const footerPath = path.join(footersDir, `${product.footer}.html`);
                const footerContent = await fs.readFile(footerPath, 'utf-8');
                const footerTemplate = Handlebars.compile(footerContent);

                for (const variation of product.variations) {
                    let additionalContent = "";
                    if (variation.contentFiles && variation.contentFiles.length > 0) {
                        try {
                            for (const contentFile of variation.contentFiles) {
                                const contentPath = path.join(contentsDir, `${contentFile}.html`);
                                const content = await fs.readFile(contentPath, 'utf-8');
                                additionalContent += content;
                            }
                        } catch (contentError) {
                            console.error(`Failed to read content file for ${product.name}_${variation.code}:`, contentError);
                        }
                    }

                    const data = { name: product.name, code: variation.code, color: variation.color, quantity: variation.quantity, additionalContent: additionalContent };

                    const filenameTemplate = Handlebars.compile(product.filenameTemplate);
                    const filename = filenameTemplate(data);
                    const filepath = path.join(outputDir, filename);
                    const dirname = path.dirname(filepath); // ファイルパスからディレクトリ部分を抽出
                    try {
                        await fs.mkdir(dirname, { recursive: true }); // ディレクトリを作成（存在しない場合は作成）
                    } catch (mkdirError) {
                        console.error(`Failed to create directory ${dirname}:`, mkdirError);
                        continue; // ディレクトリ作成に失敗した場合はスキップ
                    }

                    const header = headerTemplate(data);
                    const footer = footerTemplate(data);
                    let fileContent = template(data);

                    fileContent = header + fileContent + footer;

                    try {
                        const minifiedContent = minify(fileContent, {
                            collapseWhitespace: true,
                            removeComments: true,
                            minifyCSS: true,
                            minifyJS: true,
                        });
                        await fs.writeFile(filepath, minifiedContent, 'utf-8');
                        console.log(`File "${filename}" generated successfully.`);
                    } catch (err) {
                        console.error(`Failed to write file "${filename}":`, err);
                    }
                }
            } catch (templateError) {
                console.error(`Failed to read template file for ${product.name}:`, templateError);
            }
        }
    } catch (jsonError) {
        console.error(`Failed to read products.json:`, jsonError);
    }
}

generateFiles().catch(console.error);