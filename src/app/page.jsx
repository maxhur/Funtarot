"use client";
import React, { useState, useRef } from "react";
import tarot from "../app/_data/tarot-images.json";
import Image from "next/image";
import { getRandomNumber, clickRotate } from "../utils/helper.js";
import { v4 as uuid } from "uuid";
import { useChat } from "@ai-sdk/react";

export default function Home() {
  const [inquiry, setInquiry] = useState("");
  const [responses, setResponses] = useState([]);
  const [drawnCard, setDrawnCard] = useState([]);
  const [drawButtonClicked, setDrawButtonClicked] = useState(false);
  const [cardsToDraw, setCardsToDraw] = useState("");
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const { messages, input, setInput, append } = useChat();

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

  const sendQuestion = async () => {
    if (!inquiry.trim()) return;

    try {
      // Build the user prompt (question + chosen cards)
      setInput(inquiry);
      console.log("Input set to:", inquiry);
      /* 2️⃣  ask the server */
      const res = await append({
        content: input,
        cards: drawnCard.map((c) => c.name),
        role: "user",
        // history: messagesRef.current.map(({ role, text }) => ({
        //   role,
        //   content: text,
        // })),
      });

      console.log('messages', messages)

      setResponses ((prev) => [
        ...prev,
        { response: messages }]);
      //   if (!res.body) return;

      //   const reader = res.body.getReader();
      //   const decoder = new TextDecoder();
      //   let running = "";

      //   while (true) {
      //     const { value, done } = await reader.read();
      //     if (done) break;
      //     running += decoder.decode(value, { stream: true });
      //     setMessages((prev) =>
      //       prev.map((m) => (m.id === assistantId ? { ...m, text: running } : m))
      //     );
      //   }
    } catch (err) {
      console.error("Error sending question:", err);
      setResponses([
        { response: "🛠️ The oracle is resting. Try again shortly." },
      ]);
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
    document.getElementById("tarotCard").classList.toggle("rotated");
    setDrawButtonClicked(false);
    setCardsToDraw("");
    setFetchCompleted(false);
    //clickRotate(getElementById('tarotCard'))
  };

  return (
    <div className="bg-black  p-5 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 p-2 whitespace-nowrap">
        What&apos;s on our mind?
      </h1>
      <div className="items-center flex-col">
        <div className="questionInput">
          <input
            type="text"
            // value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
            className="p-2 border border-gray-300 rounded text-black"
            placeholder="?"
          />
        </div>
      </div>

      <div className="cards-wrapper">
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
      </div>

      {/* Getting a reading Button */}
      <div className="getRead">
        {/* {drawButtonClicked && !fetchCompleted && ( */}
        {drawButtonClicked && (
          <button
            onClick={sendQuestion}
            className="mt-4 group relative px-6 py-3 bg-gray-800 text-gray-300 font-bold rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 hover:shadow-gray-500/50 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-purple-800 to-purple-600 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"></span>
            <span className="relative z-10">?</span>
          </button>
        )}
      </div>
      {/* {console.log("responses", responses)}
      {responses.length > 0 && (
        <div className="mt-6 max-w-prose whitespace-pre-wrap text-lg leading-relaxed">
          <strong className="block mb-2 text-purple-400">Reading:</strong>
          {responses}
        </div>
      )} */}
      {/* {messages} */}

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
