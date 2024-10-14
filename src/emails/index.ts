import path from "path";
import { readFileSync } from "fs";

export default function getMail(template: string, ...data: any[]) {

    const templatePath = path.resolve(__dirname, `${template}.html`);
    const templateFile = readFileSync(templatePath, 'utf8');

    const compiledTemplate = templateFile.replaceAll(/\{\{(.+?)\}\}/g, (match, p1) => {
        const key = p1.trim();
        const value = data.find((item) => {
            return item[key];
        });

        return value ? value[key] : '';
    })


    return compiledTemplate;
}
