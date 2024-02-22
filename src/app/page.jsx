"use client";
import React, { useState, useEffect } from "react";
import tarot from "../app/_data/tarot-images.json";

const Home = () => {
  const [inquiry, setInquiry] = useState("");
  const [tarotCards, setTarotCards] = useState([]);
  const [responses, setResponses] = useState([]);
  //const [loading, setLoading] = useState("");
  const [drawnCard, setDrawnCard] = useState([]);
  const [drawButtonClicked, setDrawButtonClicked] = useState(false);
  const [cardsToDraw, setCardsToDraw] = useState("");

  const getRandomNumber = (min, max, count) => {
    const uniqueNumbers = new Set();

    while (uniqueNumbers.size < count) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
      uniqueNumbers.add(randomNumber);
    }

    return Array.from(uniqueNumbers);
  };

  const drawCard = (min, max, count) => {
    let chosenCard = [];

    let chosenIndex = getRandomNumber(min, max - 1, count);

    for (let i of chosenIndex) {
      console.log("i: ", i);
      chosenCard.push(tarot.cards[i]);
    }

    return chosenCard;
  };

  const handleQuestionSubmit = async () => {
    try {
      // receives responses from fetch
      const cardResponses = [];
      let questionCard = "";
      console.log(drawnCard.length)
      //combines tarot card input
      if (drawnCard.length > 1) {
        for (const card of drawnCard) {
          questionCard += card.name + ",";
        }
      } else {
        questionCard += drawnCard[0].name;
      }
      console.log('questionCard cp1: ',questionCard)////////////////////////////////
      questionCard = inquiry + ". The cards I got are:" + questionCard;
      console.log('questionCard cp3: ',questionCard)////////////////////////////////

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

  const handleButtonClick = () => {
    setDrawButtonClicked(true);
  };

  const handleSelectChange = (e) => {
    setCardsToDraw(e.target.value);
  };

  return (
    <div className="bg-gray-100 p-5 min-h-screen flex flex-col items-center">
      {/* <div className="bg-white p-8 rounded shadow-md mb-4"> */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 p-2 whitespace-nowrap">
        What's on your mind?
      </h1>
      <div className="w-auto items-center flex flex-row">
        <div>
          <input
            type="text"
            onChange={(e) => setInquiry(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            placeholder="What's on your mind?"
          />
        </div>
        <div className="ml-4 flex flex-row w-full">
          <label htmlFor="selectInput" className="text-black">
            How many cards?
          </label>
          <select
            id="selectDrawAmt"
            value={cardsToDraw}
            onChange={handleSelectChange}
            required
          >
            <option className="text-black" value="">
              Select...
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          {cardsToDraw && (
            <p className="text-black">You selected: {cardsToDraw}</p>
          )}
        </div>
      </div>

      {/* Drawn Card shows here */}
      {drawnCard.length > 0 && (
        <div className="bg-white mt-4 mb-4 p-8 rounded shadow-lg text-center">
          <div className="flex flex-wrap justify-center">
            {drawnCard.map((drawnCards, index) => (
              //<div key={index} className="flex-none mx-4 mb-4">
              <div key={index} className="flex-none">
                <h1>{drawnCards.name}</h1>
                <img
                  src={`/cards/${drawnCards.img}`}
                  alt="drawnCard"
                  className="w-auto h-30" // Adjust image height as needed
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Drawing Button */}
      <div>
        {!drawButtonClicked && cardsToDraw && inquiry && (
          <button
            onClick={() => {
              const drawnCards = drawCard(0, tarot.cards.length, cardsToDraw);
              console.log("drawnCards",drawnCards)
              setTarotCards([...tarotCards, drawnCards]);
              setDrawnCard(drawnCards);
              handleButtonClick();
              console.log(tarotCards)
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Draw Cards
          </button>
        )}
      </div>

      {/* Getting a reading Button */}
      <div>
        {drawButtonClicked && (
          <button
            onClick={handleQuestionSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Get a Reading
          </button>
        )}
      </div>
      {responses.length > 0 && (
        <div className="mt-4 text-black">
          <strong>Reading:</strong>
          {responses.map((cardResponse, index) => (
            <div key={index}>
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
    // </div>
  );
};

export default Home;
