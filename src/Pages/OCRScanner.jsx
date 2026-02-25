import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, Loader2, Camera } from 'lucide-react';

const OCRScanner = () => {
    const [image, setImage] = useState(null);
    const [base64Image, setBase64Image] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setText('');
            setError('');

            // Convert image to Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64Image(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExtractText = async () => {
        if (!base64Image) {
            setError('Please capture or upload an image first.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Assuming your backend runs on localhost:5000, or proxy is set up
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(`${API_URL}/api/scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64Image })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to extract text from image');
            }

            if (data.success) {
                setText(data.text);
            } else {
                throw new Error(data.message || 'OCR processing failed');
            }

        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred during text extraction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-200">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col space-y-6">
                <div className="flex items-center space-x-3 text-blue-600 border-b pb-4 border-gray-100">
                    <Camera size={32} />
                    <h1 className="text-3xl font-bold text-gray-800">Camera OCR Scanner</h1>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Column: Upload & Actions */}
                    <div className="flex-1 space-y-5 flex flex-col">
                        <div className="w-full">
                            <label
                                htmlFor="image-upload"
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500 text-center px-4">
                                    <Camera className="w-10 h-10 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500 font-semibold">Tap to capture or upload image</p>
                                    <p className="text-xs text-gray-400">Supported formats: JPEG, PNG</p>
                                </div>
                                {/* capture="environment" encourages mobile devices to open the rear camera */}
                                <input
                                    id="image-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            onClick={handleExtractText}
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all shadow-md flex items-center justify-center gap-2
                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Processing Backend OCR...</span>
                                </>
                            ) : (
                                <>
                                    <FileText size={20} />
                                    <span>Extract Text</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right Column: Preview & Result */}
                    <div className="flex-1 space-y-5 flex flex-col border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-6 md:pt-0">
                        {previewUrl ? (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-700">Image Preview:</h3>
                                <div className="relative h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                                    <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                                </div>
                            </div>
                        ) : (
                            <div className="h-48 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
                                No image captured
                            </div>
                        )}

                        <div className="space-y-2 flex-grow flex flex-col">
                            <h3 className="text-sm font-medium text-gray-700">Extracted Text:</h3>
                            <textarea
                                readOnly
                                className="w-full flex-grow min-h-[150px] p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                placeholder={loading ? "Waiting for backend response..." : "Extracted text will appear here..."}
                                value={text}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OCRScanner;
