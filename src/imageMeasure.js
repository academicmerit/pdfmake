'use strict';

function ImageMeasure(pdfKitDoc, imageDictionary) {
	this.pdfKitDoc = pdfKitDoc;
	this.imageDictionary = imageDictionary || {};
}

ImageMeasure.prototype.measureImage = function (src) {
	var image;
	var that = this;
	/*
	 * To keep the svg quality we convert it to jpeg
	 * with dimension multiplied by 2.
	 * And now we need to downscale it to keep the proper size.
	 **/
	var svgDownscaleRate = 1;
	if (src.indexOf('__blob:') >= 0) {
		svgDownscaleRate = 2;
	}
	var scale = .7 // related to issue #328

	if (!this.pdfKitDoc._imageRegistry[src]) {
		try {
			image = this.pdfKitDoc.openImage(realImageSrc(src));
		} catch (error) {
			image = null;
		}
		if (image === null || image === undefined) {
			throw 'invalid image, images dictionary should contain dataURL entries (or local file paths in node.js)';
		}
		image.embed(this.pdfKitDoc);

		image.width = (image.width / svgDownscaleRate) * scale
		image.height = (image.height / svgDownscaleRate) * scale

		this.pdfKitDoc._imageRegistry[src] = image;
	} else {
		image = this.pdfKitDoc._imageRegistry[src];
	}

	return {width: image.width, height: image.height};

	function realImageSrc(src) {
		var img = that.imageDictionary[src];

		if (!img) {
			return src;
		}

		var index = img.indexOf('base64,');
		if (index < 0) {
			return that.imageDictionary[src];
		}

		return Buffer.from(img.substring(index + 7), 'base64');
	}
};

module.exports = ImageMeasure;
