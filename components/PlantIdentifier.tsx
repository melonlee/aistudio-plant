
import React, { useState, useCallback } from 'react';
import { identifyPlantFromImage } from '../services/geminiService';
import Spinner from './Spinner';
import { UploadIcon, SparklesIcon } from './IconComponents';

const PlantIdentifier: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult('');
      setError('');
    }
  };

  const handleIdentify = useCallback(async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setError('');
    setResult('');
    try {
      const identification = await identifyPlantFromImage(imageFile);
      setResult(identification);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Plant Identifier</h2>
      <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 mb-4">
        {previewUrl ? (
          <img src={previewUrl} alt="Plant preview" className="max-h-60 rounded-lg shadow-md mb-4" />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <UploadIcon className="h-12 w-12 mb-2" />
            <p className="font-semibold">Upload a photo of your plant</p>
            <p className="text-sm">We'll identify it and provide care tips.</p>
          </div>
        )}
        <label htmlFor="plant-upload" className="cursor-pointer mt-4 bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-lg hover:bg-green-200 transition-colors">
          {previewUrl ? 'Choose a Different Photo' : 'Select Photo'}
        </label>
        <input id="plant-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
      <button
        onClick={handleIdentify}
        disabled={!imageFile || isLoading}
        className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
      >
        {isLoading ? (
          <>
            <Spinner className="text-white -ml-1 mr-3" />
            Identifying...
          </>
        ) : (
          <>
            <SparklesIcon className="h-5 w-5 mr-2" />
            Identify Plant & Get Care Tips
          </>
        )}
      </button>

      {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}
      
      {result && (
        <div className="mt-6 flex-grow overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Analysis Result:</h3>
          <div className="prose prose-green max-w-none bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantIdentifier;
