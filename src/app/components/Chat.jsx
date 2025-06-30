"use client";
import { useChat } from "@ai-sdk/react";
import React, { useState, useRef } from "react";
import Image from "next/image";
import tarot from "../../app/_data/tarot-images.json";
import { getRandomNumber, clickRotate, WaveHint } from "../../utils/helper.js";

export default function Chat() {
  const [drawnCard, setDrawnCard] = useState([]);
  const [drawButtonClicked, setDrawButtonClicked] = useState(false);

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
    if (drawnCard.length < 1) {
      const drawnCards = drawCard(0, tarot.cards.length, cardsToDraw);
      // shows ask question button
      setDrawButtonClicked(true);
      setDrawnCard(drawnCards);
      clickRotate(cardElement);
    }
  };

  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const showHint = input.length > 0 && drawnCard.length === 0;

  return (
    <div className="bg-black min-h-screen flex flex-col items-center">
      <header className="sticky top-0 z-50 w-full">
        <div className="bg-black flex flex-col items-center p-5 space-y-4">
          <h1 className="text-2xl mb-2 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold whitespace-nowrap">
            What&apos;s on your mind?
          </h1>
          <form onSubmit={handleSubmit} className="w-full md:w-1/2 mx-auto">
            <input
              className="w-full p-2 border border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 rounded shadow-xl"
              value={input}
              placeholder="Ask anything..."
              onChange={handleInputChange}
            />
          </form>
        </div>
        <div
          className="h-4 w-full bg-gradient-to-b from-black via-black/70 to-transparent
                  pointer-events-none"
        />
        <div className="relative overflow-visible">
          {/* ✨ floating hint */}
          {showHint && (
            <div
              className="pointer-events-none relative -top-5 
                 flex justify-center animate-floating z-30"
            >
              {"Click the card to draw".split("").map((ch, i) => (
                <span
                  key={i}
                  className="inline-block text-sm font-semibold text-white animate-wave"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  ˝{ch}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>
      {/* ──────────────────────────────────────────────── */}
      <div className="cards-wrapper mt-8">
        <div className="card-container" id="container">
          <div id="tarotCard" className="card" onClick={(e) => drawCards(1, e)}>
            <div className="card-contents card-front">
              <Image
                src={`/cards/cardback.jpg`}
                alt={`Card: back of the card`}
                width={300} // Set the width of the image
                height={350} // Set the height of the image
                className="card-contents card-front w-300 h-350" // Add custom classes if needed
                priority
              />
              <div
                id="tarotCard"
                className="card"
                onClick={(e) => drawCards(1, e)}
              ></div>
            </div>

            <div className="card-depth">
              <h2></h2>
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

                <div className="card-depth">
                  <h2>{cards.name}</h2>
                  <hr />
                  <p>what</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* </div> */}

      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            {message.role === "user" ? "User: " : "AI: "}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
              }
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
