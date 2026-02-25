const Tesseract = require('tesseract.js');

const extractTextFromBase64 = async (base64Image) => {
    try {
        // base64Image is expected to be a data URI: "data:image/png;base64,iVBORw0KGgo..."
        // Tesseract.js in Node can accept base64 or a buffer.
        // It's safer to pass a buffer or the raw base64 string without data prefix depending on the version.
        // Actually, Tesseract.js accepts base64 data URIs directly in recognize() or buffers.

        let imageToProcess = base64Image;

        // If it's pure base64 without prefix data URI, we can convert it to buffer:
        if (!base64Image.startsWith('data:image')) {
            imageToProcess = Buffer.from(base64Image, 'base64');
        }

        const result = await Tesseract.recognize(
            imageToProcess,
            'eng',
            { logger: m => console.log(m) }
        );

        return result.data.text;
    } catch (error) {
        console.error('OCR Service Error:', error);
        throw new Error('Failed to extract text from image');
    }
};

module.exports = {
    extractTextFromBase64
};
