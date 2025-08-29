"use client";
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [markdownText, setMarkdownText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [slidesAndTheme, setSlidesAndTheme] = useState(null);
  const [error, setError] = useState('');
  const [activeInput, setActiveInput] = useState('file');

  const API_BASE_URL = "http://ec2-51-20-114-212.eu-north-1.compute.amazonaws.com:8000"

  const handleFileChange = (event) => {
    setSlidesAndTheme(null);
    setError('');
    setFile(event.target.files[0]);
    setMarkdownText('');
    setActiveInput('file');
  };

  const handleTextChange = (event) => {
    setSlidesAndTheme(null);
    setError('');
    setMarkdownText(event.target.value);
    setFile(null);
    setActiveInput('text');
  };

  const handleFileUploadSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError('Please select a Markdown file to upload.');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/convert-md`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to convert file.');
      }

      const data = await response.json();
      setSlidesAndTheme(data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async (event) => {
    event.preventDefault();

    if (!markdownText.trim()) {
      setError('Please enter some Markdown text.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/convert-md-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: markdownText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to convert text.');
      }

      const data = await response.json();
      setSlidesAndTheme(data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!slidesAndTheme) {
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide Deck: ${slidesAndTheme.design_theme}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            background-color: #1a202c;
            color: #e2e8f0;
        }
        .slide {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 4rem;
            text-align: center;
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 p-8">
    <h1 class="text-5xl font-extrabold tracking-tight text-center mb-4">
        Slide Deck
    </h1>
    <p class="text-xl text-center text-gray-400 mb-12">Design Theme: <span class="text-purple-400 font-bold">${slidesAndTheme.design_theme}</span></p>

    <div class="space-y-16">
        ${slidesAndTheme.slides.map((slide, index) => `
            <div class="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
                <h2 class="text-3xl font-bold mb-4">${slide.title}</h2>
                <p class="text-lg text-gray-300">${slide.content}</p>
            </div>
        `).join('')}
    </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `slide-deck-${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        <motion.header
          className="text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
            Markdown to Slides
          </h1>
          <p className="text-lg sm:text-xl text-gray-400">
            Convert your Markdown document into a JSON slide deck with a suggested design theme.
          </p>
        </motion.header>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => { setActiveInput('file'); setSlidesAndTheme(null); setError(''); }}
            className={`py-2 px-4 rounded-l-lg text-sm font-medium transition-colors duration-200
              ${activeInput === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Upload File
          </button>
          <button
            onClick={() => { setActiveInput('text'); setSlidesAndTheme(null); setError(''); }}
            className={`py-2 px-4 rounded-r-lg text-sm font-medium transition-colors duration-200
              ${activeInput === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Paste Text
          </button>
        </div>

        <Transition
          show={activeInput === 'file'}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-700 w-full"
        >
          <motion.form
            onSubmit={handleFileUploadSubmit}
            className="space-y-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="space-y-2">
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-400">
                Upload Markdown (.md) File
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".md"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700
                  transition-colors duration-200 ease-in-out"
              />
            </div>
            
            <button
              type="submit"
              disabled={!file || isLoading}
              className={`w-full py-3 px-6 rounded-full font-bold text-white transition-all duration-300
                ${(!file || isLoading) ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'}`}
            >
              {isLoading && activeInput === 'file' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Converting File...
                </span>
              ) : 'Generate Slides from File'}
            </button>
          </motion.form>
        </Transition>

        <Transition
          show={activeInput === 'text'}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-700 w-full"
        >
          <motion.form
            onSubmit={handleTextSubmit}
            className="space-y-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="space-y-2">
              <label htmlFor="markdown-text" className="block text-sm font-medium text-gray-400">
                Paste Markdown Text
              </label>
              <textarea
                id="markdown-text"
                rows="10"
                value={markdownText}
                onChange={handleTextChange}
                placeholder="Paste your Markdown content here..."
                className="block w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={!markdownText.trim() || isLoading}
              className={`w-full py-3 px-6 rounded-full font-bold text-white transition-all duration-300
                ${(!markdownText.trim() || isLoading) ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
            >
              {isLoading && activeInput === 'text' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Converting Text...
                </span>
              ) : 'Generate Slides from Text'}
            </button>
          </motion.form>
        </Transition>

        <Transition
          show={!!error}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="mt-4 text-red-400 text-sm text-center">
            {error}
          </div>
        </Transition>

        <Transition
          show={!!slidesAndTheme}
          as="div" 
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          {slidesAndTheme && (
            <motion.div
              className="mt-8 space-y-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-300">Suggested Design Theme</h2>
                <p className="text-xl font-medium text-purple-400">{slidesAndTheme.design_theme}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {slidesAndTheme.slides.map((slide, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-700"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                      Slide {index + 1}: {slide.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{slide.content}</p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={handleDownload}
                  className="py-3 px-6 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-colors duration-200"
                >
                  Download as HTML
                </button>
              </div>
            </motion.div>
          )}
        </Transition>
      </div>
    </div>
  );
}
