import tarot from "../app/_data/tarot-images.json";

const getRandomNumber = (min, max, count) => {
  const uniqueNumbers = new Set();

  while (uniqueNumbers.size < count) {
    uniqueNumbers.add(Math.floor(Math.random() * (max - min + 1) + min));
  }

  return Array.from(uniqueNumbers);
};

function clickRotate(card) {
  console.log(card.currentTarget);
  const element = card.currentTarget;
  element.classList.toggle("rotated");
}

function WaveHint({ text }) {
  console.log(text);
  return (
    <div
      className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2
                 flex justify-center animate-floating"
    >
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="inline-block text-sm font-semibold text-white animate-wave"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}

export { getRandomNumber, clickRotate, WaveHint };
