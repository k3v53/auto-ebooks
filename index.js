require('dotenv').config();
const { Client } = require('@notionhq/client');
const { get } = require('https');
const { JSDOM } = require('jsdom');
const { Calibre } = require('node-calibre');
const { NOTION_DATABASE_ID, NOTION_API_KEY } = process.env;
const notion = new Client({ auth: NOTION_API_KEY });
const calibre = new Calibre();

async function listNotionBooks() {
	try {
		const response = await notion.databases.query({
			database_id: NOTION_DATABASE_ID,
			sorts: [
				{
					property: 'Última edición',
					direction: 'ascending',
				},
			],
			filter: {
				and: [
					{
						property: 'procesing_status',
						multi_select: { does_not_contain: 'Procesed Initial Upload' },
					},
				],
			},
		});
		return response;
	} catch (error) {
		console.log(error);
	}
}
async function main(params) {
  let notionBooks = await listNotionBooks();
	let notionBooksResults = notionBooks.results;
	for (let book of notionBooksResults) {
		console.log(book);
	}
	console.log('Books amount: ' + notionBooksResults.length);
	const calibreResponse = await calibre.run(
		'fetch-ebook-metadata -t "El alquimista"'
	);
	console.log(calibreResponse);
}
main();