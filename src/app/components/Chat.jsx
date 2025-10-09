"use client";
import { useChat } from "@ai-sdk/react";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import tarot from "../../app/_data/tarot-images.json";
import { getRandomNumber, clickRotate } from "../../utils/helper.js";

export default function Chat() {
  const [drawnCard, setDrawnCard] = useState([]);
  const [isCardDrawn, setIsCardDrawn] = useState(false);

  const [highlight, setHighlight] = useState(false);
  const glowTimerRef = useRef(null); // holds the timeout ID
  const inputRef = useRef(null); // holds the timeout ID
  const messagesEndRef = useRef(null); // ref for auto-scroll
  const [placeholderText, setPlaceholderText] = useState("Ask anything...");
  const [placeholderChange, setPlaceholderChange] = useState(false);

  const drawCardRandom = (min, max, count) => {
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
      const drawnCards = drawCardRandom(0, tarot.cards.length, cardsToDraw);
      // shows ask question button
      console.log("drawnCards", drawnCards);
      setDrawnCard(drawnCards);
      clickRotate(cardElement);
      setIsCardDrawn(true);
    }
  };

  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const MIN_CHARS = 10;
  const MAX_CHARS = 100;
  const GLOW_MS = 2000;
  const showHint = input.length >= MIN_CHARS && drawnCard.length === 0;

  function isValid() {
    isCardDrawn ?? console.log("Please draw a card first.");
    return;
  }

  function onAsk(e) {
    e.preventDefault();
    console.log(input.legnth);
    console.log(MIN_CHARS);
    if (input.length < MIN_CHARS) {
      console.log(`Please enter at least ${MIN_CHARS} characters.`);
      return;
    }

    if (!drawnCard) {
      console.log("Please draw a card first.");
      return;
    }

    handleSubmit(e);
  }

  const placeholderMessages = [
    "Ask before you draw",
    "Type your question first",
    "Question first, then card",
    "Ask something, then tap",
    "What do you want to know?",
    "Ask the cards a question",
    "Your question goes here",
    "Ask, then draw",
    "Type a question first",
    "Pose your question first",
    "What do you wish to ask?",
  ];

  /* pick one at random */
  function getRandomPlaceholder() {
    setPlaceholderChange(true);
    return placeholderMessages[
      Math.floor(Math.random() * placeholderMessages.length)
    ];
  }

  function flashHighlight() {
    inputRef.current?.focus();

    if (input.length < 1 && !placeholderChange) {
      setPlaceholderText(getRandomPlaceholder());
    }

    if (!highlight) setHighlight(true); // only set once
    clearTimeout(glowTimerRef.current);

    glowTimerRef.current = setTimeout(() => {
      setHighlight(false); // hide after last  timeout
      glowTimerRef.current = null; // clean up
    }, GLOW_MS);

    console.log("glow timer ref after:", glowTimerRef.current);
  }

  const isInputValid = input.length >= MIN_CHARS && input.length <= MAX_CHARS;

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function scrollToSection(id) {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" }); // Optional: smooth scrolling
  }

  return (
    <div className="bg-black min-h-screen flex flex-col items-center">
      <header className="sticky top-0 z-50 w-full">
        <div className="bg-black flex flex-col items-center p-5 space-y-4">
          <h1 className="text-2xl mb-2 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold whitespace-nowrap">
            What&apos;s on your mind?
          </h1>
          <form onSubmit={onAsk} className="w-full md:w-1/2 mx-auto">
            <input
              className={`w-full p-2 border border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 rounded shadow-xl ${
                highlight ? "animate-glow" : ""
              }`}
              ref={inputRef}
              value={input}
              placeholder={placeholderText}
              disabled={isCardDrawn}
              id="questionInput"
              onChange={handleInputChange}
            />
            <div className="mt-1 text-xs">
              <p hidden={input.length >= MIN_CHARS} className="text-left">
                minimum {MIN_CHARS} characters
              </p>
              <p hidden={input.length <= MAX_CHARS} className="text-right">
                maximum {MAX_CHARS} characters
              </p>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!isInputValid || !isCardDrawn}
                className=" bg-white text-black font-bold py-1 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
              >
                Ask the Card
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* ──────────────────────────────────────────────── */}
      <div className="cards-wrapper mt-8 relative">
        {showHint && (
          <div
            className="pointer-events-none absolute -top-7 left-11 transform -translate-x-1/2 -translate-y-8
       flex justify-center animate-floating z-30"
          >
            {"Click the card to draw".split("").map((ch, i) => (
              <span
                key={i}
                className="inline-block text-sm font-semibold text-white animate-wave"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                "{ch}
              </span>
            ))}
          </div>
        )}

        <div className="card-container" id="container">
          <div
            id="tarotCard"
            className="card"
            onClick={(e) =>
              isInputValid ? drawCards(1, e) : flashHighlight(e)
            }
          >
            <div className="card-contents card-front">
              <Image
                draggable="false"
                src={`/cards/cardback.jpg`}
                alt={`Card: back of the card`}
                width={300} // Set the width of the image
                height={350} // Set the height of the image
                className="card-contents card-front w-300 h-350" // Add custom classes if needed
                priority
              />
            </div>

            <div className="card-contents card-back">
              {drawnCard.map((cards, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center mx-4 p-4 text-wrap "
                >
                  <Image
                    src={`/cards/${cards.img}`}
                    alt={`Card: ${cards.name}`}
                    width={300} // Set the width of the image
                    height={350} // Set the height of the image
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
      </div>

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
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
