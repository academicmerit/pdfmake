var fonts = {
	FTFonts: {
		normal: 'fonts/regular.ttf',
		bold: 'fonts/bold.ttf',
		italics: 'fonts/italic.ttf',
		bolditalics: 'fonts/bolditalic.ttf'
	}
};

var PdfPrinter = require('../src/printer');
var printer = new PdfPrinter(fonts);
var fs = require('fs');

var docDefinition = {
	content: [
		'First paragraph',
		'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
	]
};

var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('pdfs/basics.pdf'));
pdfDoc.end();
