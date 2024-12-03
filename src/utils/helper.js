import tarot from "../app/_data/tarot-images.json";

const getRandomNumber = (min, max, count) => {
  const uniqueNumbers = new Set();

  while (uniqueNumbers.size < count) {
    uniqueNumbers.add(Math.floor(Math.random() * (max - min + 1) + min));
  }

  return Array.from(uniqueNumbers);
};


function clickRotate(card) {
  console.log(card.currentTarget)
  const element = card.currentTarget; 
  element.classList.toggle('rotated'); 
}


export { getRandomNumber, clickRotate }