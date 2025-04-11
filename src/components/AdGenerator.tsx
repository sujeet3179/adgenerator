import { useState } from 'react';
import axios from 'axios';

const OPENAI_API_KEY = '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'; 

export default function AdGenerator() {
  const [product, setProduct] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAdCopy = async () => {
    setLoading(true);

    const prompt = `Create an ad title and a short description for: ${product}`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const reply = response.data.choices[0].message.content;

      // Try to extract title + description (you can improve this logic)
      const [generatedTitle, ...rest] = reply.split('\n');
      setTitle(generatedTitle.replace(/Title: /i, '').trim());
      setDescription(rest.join(' ').replace(/Description: /i, '').trim());
    } catch (err) {
      console.error('OpenAI error:', err);
      alert('Error generating ad copy.');
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-bold">AI-Powered Ad Generator</h2>

      <input
        type="text"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder="Describe your product or offer"
        className="w-full border p-2 rounded"
      />

      <button
        onClick={generateAdCopy}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Generating...' : '✨ Generate Ad Copy'}
      </button>

      {title && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <h3 className="font-semibold text-lg">Generated Title:</h3>
          <p>{title}</p>

          <h3 className="font-semibold text-lg mt-2">Generated Description:</h3>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
}
