"use client";

import { useState } from 'react';
import Card from './components/Card';
import { ethers } from 'ethers';

export default function Home() {
  const [input, setInput] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false)

  const validateAddress = (address) => {
    return ethers.isAddress(address);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFetching(true)
    setError('');
    setData([])

    if (!validateAddress(input)) {
      setError('Invalid Ethereum address');
      setFetching(false)
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/pudgyPenguins?walletAddress=${input}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const result = await response.json();
      setFetching(false)

      if (response.status !== 200) {
        setError(`${response.status}: ${result.message}`);
        return;
      }

      if (result.length === 0) {
        setError('User has no Penguins');
        return;
      }

      setData(result);
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error(err);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="mb-8 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 bg-black text-white rounded-md"
          placeholder="Enter Ethereum address"
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors">
          Submit
        </button>
      </form>
      {fetching && <p className="text-green-500 mb-8">Fetching results for {input}...</p>}
      {error && <p className="text-red-500 mb-8">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((nft, index) => (
          <Card key={index} nft={nft} />
        ))}
      </div>
    </main>
  );
}
