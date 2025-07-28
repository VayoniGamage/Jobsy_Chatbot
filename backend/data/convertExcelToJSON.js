import fs from 'fs';
import xlsx from 'xlsx';

const workbook = xlsx.readFile('D:\Jobsy_Chatbot\backend\data\Jobsy_QA_Dataset.csv');
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const jsonData = xlsx.utils.sheet_to_json(sheet);
const formatted = jsonData.map((entry, index) => ({
  id: index + 1,
  question: entry.Question,
  answer: entry.Answer
}));

fs.writeFileSync('data/dataset.json', JSON.stringify(formatted, null, 2));
console.log('✅ Excel converted to JSON successfully!');
