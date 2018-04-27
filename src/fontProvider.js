'use strict';

var isArray = require('./helpers').isArray;

function typeName(bold, italics) {
	var type = 'normal';
	if (bold && italics) {
		type = 'bolditalics';
	} else if (bold) {
		type = 'bold';
	} else if (italics) {
		type = 'italics';
	}
	return type;
}

function FontProvider(fontDescriptors, pdfKitDoc) {
	this.fonts = {};
	this.pdfKitDoc = pdfKitDoc;
	this.fontCache = {};

	for (var font in fontDescriptors) {
		if (fontDescriptors.hasOwnProperty(font)) {
			var fontDef = fontDescriptors[font];

			this.fonts[font] = {
				normal: fontDef.normal,
				bold: fontDef.bold,
				italics: fontDef.italics,
				bolditalics: fontDef.bolditalics
			};
		}
	}
}

FontProvider.prototype.provideFont = function (familyName, bold, italics) {
	var type = typeName(bold, italics);
	var safeFamilyName = familyName;
	// fallback to default font if nothing found
	if (typeof(familyName) !== 'string') {
		safeFamilyName = 'Roboto';
	}
	if (!this.fonts[safeFamilyName] || !this.fonts[safeFamilyName][type]) {
		throw new Error('Font \'' + safeFamilyName + '\' in style \'' + type + '\' is not defined in the font section of the document definition.');
	}

	this.fontCache[safeFamilyName] = this.fontCache[safeFamilyName] || {};

	if (!this.fontCache[safeFamilyName][type]) {
		var def = this.fonts[safeFamilyName][type];
		if (!isArray(def)) {
			def = [def];
		}
		this.fontCache[safeFamilyName][type] = this.pdfKitDoc.font.apply(this.pdfKitDoc, def)._font;
	}

	return this.fontCache[safeFamilyName][type];
};

module.exports = FontProvider;
