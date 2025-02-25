import React, { useState } from 'react';
import axios from 'axios';
import { FaCopy } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeDigits, setIncludeDigits] = useState(true);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!includeUppercase && !includeLowercase && !includeDigits) {
      setError('Please select at least one character type.');
      return;
    }
    if (length <= 0) {
      setError('Length must be greater than 0.');
      return;
    }
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/generate-token`, {
        length,
        uppercase: includeUppercase,
        lowercase: includeLowercase,
        digits: includeDigits,
      });
      setToken(response.data.token);
      setCopied(false);
    } catch (err) {
      setError('Error generating token.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
  };

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLength(value === '' ? NaN : Number(value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-300 to-gray-200">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-gray-200 shadow-lg rounded-b-2xl">
        <div className="text-3xl font-extrabold text-orange-500">TokenGen</div>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center py-20 px-6">
        <div className="bg-gray-200 shadow-2xl rounded-3xl p-12 w-full max-w-4xl text-center border border-gray-200">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Generate Your Secure Token</h1>
          <p className="text-gray-500 text-lg mb-10">Customize your token and generate a secure random token instantly.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <label className="block text-gray-600 font-semibold mb-2">Token Length</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={isNaN(length) ? '' : length}
                onChange={handleLengthChange}
                min={1}
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={() => setIncludeUppercase(!includeUppercase)}
                  className="h-5 w-5 text-orange-500 focus:ring-orange-500 rounded"
                />
                <span className="text-gray-700 text-lg">Include Uppercase</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={() => setIncludeLowercase(!includeLowercase)}
                  className="h-5 w-5 text-orange-500 focus:ring-orange-500 rounded"
                />
                <span className="text-gray-700 text-lg">Include Lowercase</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeDigits}
                  onChange={() => setIncludeDigits(!includeDigits)}
                  className="h-5 w-5 text-orange-500 focus:ring-orange-500 rounded"
                />
                <span className="text-gray-700 text-lg">Include Digits</span>
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <button
            onClick={handleGenerate}
            className="w-full bg-orange-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-200 mt-8 shadow-md"
          >
            Generate Token
          </button>

          {token && (
            <div className="bg-gray-100 p-5 rounded-lg flex items-center justify-between mt-6 border border-gray-300">
              <span className="text-gray-700 break-all text-lg">{token}</span>
              <button onClick={handleCopy} className="text-orange-500 hover:text-orange-700 ml-4">
                <FaCopy size={20} />
              </button>
            </div>
          )}

          {copied && <p className="text-green-500 text-sm mt-2">Token copied to clipboard!</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
