const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const filePath = process.argv[2];
if (!filePath) {
  console.error("Please provide a file path.");
  process.exit(1);
}

async function parse() {
  const dataBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText();
  console.log("TEXT EXTRACTED FROM:", filePath);
  console.log(result.text.substring(0, 3000));
  await parser.destroy();
}
parse();


