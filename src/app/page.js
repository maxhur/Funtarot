"use client";
import React, { useState } from "react";

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleQuestionSubmit = async () => {
    try {
      const fetchResponse = await fetch("/api/chat-gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          someDate: true,
        }),
      });

      const result = await fetchResponse.json();
      setResponse(result.choices);
    } catch (error) {
      console.error("Error fetching response:", error);
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
            <strong>Answer:</strong>
            {response.map((choice) => {
              console.log(choice);
              return <p key={choice.index}>{choice.message.content}</p>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
