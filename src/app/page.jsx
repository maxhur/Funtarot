"use client";
import React, { useState, useEffect } from "react";
import tarot from "../app/_data/tarot.json";

const Home = () => {
  const [inquiry, setInquiry] = useState("");
  const [tarotCards, setTarotCards] = useState([""]);
  const [responses, setResponses] = useState([]);
  //const [loading, setLoading] = useState("");
  const [drawnCard, setDrawnCard] = useState(null);

  const getRandomNumber = function (min, max, count) {
    const uniqueNumbers = new Set();

    while (uniqueNumbers.size < count) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
      uniqueNumbers.add(randomNumber);
    }

    return Array.from(uniqueNumbers);
  };

  const drawCard = (min, max, count) => {
    let chosenCard = [];

    let chosenIndex = getRandomNumber(min, max, count);

    for (let i of chosenIndex) {
      chosenCard.push(tarot.cards[i]);
    }

    return chosenCard;
  };

  const handleQuestionSubmit = async () => {
    try {
      // receives responses from fetch
      const cardResponses = [];
      let questionCard = "";

      //combines tarot card input
      if (tarotCards.count > 1) {
        for (const card of tarotCards) {
          questionCard += card + ",";
        }
      } else {
        questionCard += tarotCards;
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
    <div className="bg-gray-100 min-h-screen flex items-start justify-center">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-4">Tarot Card Reading</h1>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2"></label>
          <input
            type="text"
            onChange={(e) => {
              updateInquiry = e.target.value;
              setInquiry(updateInquiry);
            }}
            className="w-full p-2 border border-gray-300 rounded text-black"
            placeholder={`What's on your mind?`}
          />
        </div>
        <div>
          <button
            onClick={() => {
              // Replace the arguments with your desired range and count
              const drawnCards = drawCard(0, tarot.nhits, 1); // draws 1 card
              console.log(drawnCards);
              setTarotCards([...tarotCards, drawnCards[0].name]);
              setDrawnCard(drawnCards[0]); //update Drawn Card State
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Draw Cards
          </button>
        </div>

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
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md">
          {drawnCard && (
            <div>
              <h1>{drawnCard.name}</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
