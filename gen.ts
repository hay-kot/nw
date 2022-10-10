import {
  access,
  readdir,
  readFile,
  mkdir,
  writeFile
} from 'fs/promises';

import path from 'path';
import { fileURLToPath } from 'url';

import { micromark } from 'micromark';
import { frontmatter, frontmatterHtml } from 'micromark-extension-frontmatter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_PATH = path.join(__dirname, 'content');
const BUILD_PATH = path.join(__dirname, 'build');


// run the generator
const run = async () => {
  await ensurePath(BUILD_PATH);
  const files = await getBlogList();

  let i = 0;
  files.forEach(async (f: string) => {
    const data = await renderFile(f);
    const outPath = path.join(BUILD_PATH, `${i.toString()}.html`);
    writeFile(outPath, data)
  });
}

// read files from content dir
const getBlogList = async (): Promise<string[]> => {
  try {
    let files: string[] = [];

    (await readdir(CONTENT_PATH))
      .map((f: string) => { files.push(path.join(CONTENT_PATH, f)) })


    console.log(files)
    return files
  } catch (err) {
    return []
  }
}

// ensure path exists
const ensurePath = async (path: string) => {
  try {
    await access(path)
  } catch (err) {
    try {
      mkdir(path)
    } catch (err) {
      console.log("Could not ensure path existed", err);
      process.exit();
    }
  }
}

const renderFile = async (file: string): Promise<string> => {
  const markdown = await readFile(file, 'utf-8')
  const html = micromark(markdown, {
    extensions: [frontmatter()],
    htmlExtensions: [frontmatterHtml()]
  })
  return html
}

// process the markdown file
//const renderFile = async (file: string): Promise<string> => {
//return shiki.getHighlighter({ theme: 'nord' })
//.then(async (highlighter: any) => {
//const md = markdown({
//html: true,
//highlight: (code: any, lang: any) => {
//return highlighter.codeToHtml(code, { lang })
//}
//})

//const markdownString = await readFile(file, 'utf-8')

//const { fontMatter, bodyString } = await stripFrontMatter(markdownString);


//const body = await md.render(bodyString)

//const html =
//`
//<title>Shiki</title>
//<link rel="stylesheet" href="style.css">
//${body}
//<script src="index.js"></script>
//`
//console.log(html);
//return html
//})
//}

//const stripFrontMatter = async (markdown: string) => {


//return { frontMatter: "", bodyString: "" };
//}

(async function() {
  await run();
})()
