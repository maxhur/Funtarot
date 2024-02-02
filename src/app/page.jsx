"use client";
import React, { useState, useEffect } from "react";
import  { promises as fs } from "fs"


const Chat = () => {
  const [tarotCards, setTarotCards] = useState(["", "", ""]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState("");

  const handleQuestionSubmit = async () => {
    try {
      const cardResponses = [];
      let questionCard = "";

      for (const card of tarotCards) {
        questionCard += card + ",";
      }

      questionCard =
        "my three cards for past present and future are " + questionCard;

      const fetchResponse = await fetch("/api/chat-gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: questionCard,
          someDate: true,
        }),
      });
      const result = await fetchResponse.json();

      cardResponses.push({ response: result.choices });
      setResponses(cardResponses);
      console.log(cardResponses);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };
  
  
  

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-4">Tarot Card Reading</h1>

        {tarotCards.map((card, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-semibold mb-2">{`Tarot Card ${
              index + 1
            }:`}</label>
            <input
              type="text"
              value={tarotCards[index]}
              onChange={(e) => {
                const updatedCards = [...tarotCards];
                updatedCards[index] = e.target.value;
                setTarotCards(updatedCards);
              }}
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder={`Type your Tarot Card ${index + 1} here`}
            />
          </div>
        ))}

        {/* Button to trigger the reading */}
        <button
          onClick={handleQuestionSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Get Reading
        </button>

        {responses.length > 0 && (
          <div className="mt-4 text-black">
            <strong>Reading:</strong>
            {responses.map((cardResponse) => (
              <div key={cardResponse.card}>
                <p>
                  <strong>{cardResponse.card}</strong>{" "}
                  {cardResponse.response
                    .map((choice) => choice.message.content)
                    .join(" ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white p-8 rounded shadow-md">
        {/* <h1>{tarotData.cards.name}</h1> */}
      </div>
    </div>
  );
};

export default Chat;
