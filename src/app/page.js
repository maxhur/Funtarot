"use client";
import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const handleQuestionSubmit = async () => {
    try {
      const apiUrl = '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';
      const apiResponse = await axios.post(apiUrl, { question });
      setReponse(apiResponse.data.answer);
    } catch {
      console.error('Error fetching rresponse:', error);
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md">
      <h1 className="text-3xl font-bold mb-4">Ask a Question</h1>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded"
        placeholder="Type your question here"
      />
      <button
        onClick={handleQuestionSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
      Get Answer
      </button>
      {response && (
        <div className="mt-4">
          <strong>Answer:</strong> {response}
        </div>
      )}
    </div>
  </div>
  );
};


export default Chat;