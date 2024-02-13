"use client";
import React, { useState, useEffect } from "react";
import tarot from "../app/_data/tarot-images.json";

const Home = () => {
  const [inquiry, setInquiry] = useState("");
  const [tarotCards, setTarotCards] = useState([""]);
  const [responses, setResponses] = useState([]);
  //const [loading, setLoading] = useState("");
  const [drawnCard, setDrawnCard] = useState([]);

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

    let chosenIndex = getRandomNumber(min, max -1, count);

    for (let i of chosenIndex) {
      console.log("i: ", i)
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
          questionCard += card.name + ",";
        }
      } else {
        questionCard += tarotCards;
      }

      questionCard = inquiry + ". The cards I got are:" + questionCard;

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

  // return (
  //   <div className="bg-gray-100 min-h-screen flex items-start justify-center">
  //     <div className="bg-white p-8 rounded shadow-md">
  //       <h1 className="text-3xl font-bold mb-4">Tarot Card Reading</h1>

  //       <div className="mb-4">
  //         <label className="block text-sm font-semibold mb-2"></label>
  //         <input
  //           type="text"
  //           onChange={(e) => {
  //             let updateInquiry = e.target.value;
  //             setInquiry(updateInquiry);
  //           }}
  //           className="w-full p-2 border border-gray-300 rounded text-black"
  //           placeholder={`What's on your mind?`}
  //         />
  //       </div>

  //       {/* Card draw button */}
  //       <div>
  //         <button
  //           onClick={() => {
  //             // Replace the arguments with your desired range and count
  //             const drawnCards = drawCard(0, tarot.cards.length, 2); // draws 1 card
  //             console.log("cp1: ", drawnCards);
  //             setTarotCards([...tarotCards, drawnCards]);
  //             setDrawnCard(drawnCards); //update Drawn Card State
  //           }}
  //           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
  //         >
  //           Draw Cards
  //         </button>
  //       </div>

  //       {responses.length > 0 && (
  //         <div className="mt-4 text-black">
  //           <strong>Reading:</strong>
  //           {responses.map((cardResponse) => (
  //             <div key={cardResponse.card}>
  //               <p>
  //                 <strong>{cardResponse.card}</strong>{" "}
  //                 {cardResponse.response
  //                   .map((choice) => choice.message.content)
  //                   .join(" ")}
  //               </p>
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>
  //     <div className="bg-gray-100 min-h-screen flex items-center justify-center">
  //       <div className="bg-white p-8 rounded shadow-md text-center">
  //         {" "}
  //         {/* Added text-center class */}
  //         {drawnCard && (
  //           <div>
  //             <h1>{drawnCard[0].name}</h1>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //     <div className="bg-gray-100 min-h-screen flex items-center justify-center">
  //       {/* Button to trigger the reading */}
  //       <button
  //         onClick={handleQuestionSubmit}
  //         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
  //       >
  //         Get Reading
  //       </button>
  //     </div>
  //   </div>
  // );
  return (
    <div className="bg-gray-100 p-5 min-h-screen flex flex-col items-center">
      {/* <div className="bg-white p-8 rounded shadow-md mb-4"> */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 p-2 whitespace-nowrap">
        What's on your mind?
      </h1>
      <div className="mb-4">
        <input
          type="text"
          onChange={(e) => setInquiry(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-black"
          placeholder="What's on your mind?"
        />
      </div>

      {/* Drawn Card shows here */}
      {drawnCard.length > 0 && (
        <div className="bg-white mt-4 mb-4 p-8 rounded shadow-lg text-center">
          <h1>{drawnCard[0].name}</h1>
          <img src={`/cards/${drawnCard[0].img}`} alt="drawnCard" />
        </div>
      )}
      <div>

        {/* Card Drawing Button */}
        <button
          onClick={() => {
            const drawnCards = drawCard(0, tarot.cards.length, 1);
            setTarotCards([...tarotCards, drawnCards]);
            setDrawnCard(drawnCards);
            console.log(drawnCards)
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          Draw Cards
        </button>
      </div>
      <button
        onClick={handleQuestionSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Get Reading
      </button>
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
