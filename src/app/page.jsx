"use client";
import React, { useState, useEffect } from "react";
import tarot from "../app/_data/tarot-images.json";
import Image from "next/image";
import { getRandomNumber, clickRotate } from "../utils/helper.js";

export default function Home() {
  const [inquiry, setInquiry] = useState("");
  const [responses, setResponses] = useState([]);
  const [drawnCard, setDrawnCard] = useState([]);
  const [drawButtonClicked, setDrawButtonClicked] = useState(false);
  const [cardsToDraw, setCardsToDraw] = useState("");
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const drawCard = (min, max, count) => {
    let chosenCard = [];

    let chosenIndex = getRandomNumber(min, max - 1, count);

    for (let i of chosenIndex) {
      const cardChosen = tarot.cards[i];
      cardChosen.rev = Math.floor(Math.random() * 2);
      cardChosen.name += cardChosen.rev ? " Reversed" : "";
      chosenCard.push(cardChosen);
    }

    return chosenCard;
  };

  const drawCards = (cardsToDraw, cardElement) => {
    if (drawnCard < 1) {
      const drawnCards = drawCard(0, tarot.cards.length, cardsToDraw);
      // shows ask question button
      handleButtonClick();
      setDrawnCard(drawnCards);
      clickRotate(cardElement);
    }
  };

  const handleQuestionSubmit = async () => {
    try {
      // receives responses from fetch
      const cardResponses = [];
      let questionCard = "";
      console.log(drawnCard.length);

      //combines tarot card input
      for (const card of drawnCard) {
        questionCard += card.name + ",";
      }
      questionCard = inquiry + ". The cards I got are:" + questionCard;

      // POST /api/tarot/ {
      //   user_question
      //   reading_format
      //   cards:
      // }

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
      setFetchCompleted(true);
      return setResponses(cardResponses);
    } catch (error) {
      setResponses("I'm on a break. Will be back in 5 minutes: ", error);
    }
  };

  const handleButtonClick = () => {
    setDrawButtonClicked(true);
  };

  const handleSelectChange = (e) => {
    setCardsToDraw(e.target.value);
  };

  const handleReset = () => {
    setInquiry("");
    setResponses([]);
    setDrawnCard([]);
    setDrawButtonClicked(false);
    setCardsToDraw("");
    setFetchCompleted(false);
  };

  return (
    <div className="bg-black  p-5 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 p-2 whitespace-nowrap">
        What&apos;s on your mind?
      </h1>
      <div className="w-full items-center flex flex-col">
        <div>
          <input
            type="text"
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
            className="p-2 border border-gray-300 rounded text-black"
            placeholder="?"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="selectInput" className="text-black">
            How many cards?
          </label>

          {cardsToDraw && (
            <p className="text-black">You selected: {cardsToDraw}</p>
          )}
        </div>
      </div>

      <div className="cards-wrapper">
        <div className="card-container">
          <div className="card" onClick={(e) => drawCards(1, e)}>
            <div className="card-contents card-front">
              <Image
                src={`/cards/cardback.jpg`}
                alt={`Card: back of the card`}
                width={300} // Set the width of the image
                height={350} // Set the height of the image
                className="card-contents card-front w-300 h-350" // Add custom classes if needed
                priority
              />

              <div className="card-depth">
                <h2>Click card</h2>
              </div>
            </div>

            <div className="card-contents card-back">
              {drawnCard.map((cards, index) => (
                <div
                  key={index}
                  //className="flex flex-col items-center mx-4 p-4 text-wrap "
                >
                  <Image
                    src={`/cards/${cards.img}`}
                    alt={`Card: ${cards.name}`}
                    width={150} // Set the width of the image
                    height={200} // Set the height of the image
                    className="card-contents card-back" // Add custom classes if needed
                    style={{
                      transform: cards.rev ? "scaleY(-1)" : "scaleY(1)",
                    }}
                  />
                  <p>{cards.name}</p>
                </div>
              ))}

              <div className="card-depth">
                <h2>Click card again</h2>
                <hr />
                <p>To turn back</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Drawing Button */}
      <div>
        {cardsToDraw && inquiry && (
          <button
            onClick={() => {
              const drawnCards = drawCard(0, tarot.cards.length, cardsToDraw);
              console.log("drawnCards", drawnCards);
              // setTarotCards([...tarotCards, drawnCards]);
              setDrawnCard(drawnCards);
              // shows ask question button
              handleButtonClick();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Draw Cards
          </button>
        )}
      </div>

      {/* Getting a reading Button */}
      <div>
        {/* {drawButtonClicked && !fetchCompleted && ( */}
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

      {/* Get Another Reading */}
      {fetchCompleted && (
        <button
          onClick={handleReset}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
        >
          Reset
        </button>
      )}
    </div>
  );
}
