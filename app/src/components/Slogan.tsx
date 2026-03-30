import { useState } from "react";

//TODO: Decide what Slogan should be implemented and how it should look like. Maybe we can have a few slogans and change them randomly on each login or something like that.

const slogans = [
  "Weil Gemeinschaft ohne Helfen nichts wert ist.",
  "Weil im Helfen, die Zukunft beginnt.",
  "Weil Du gebraucht wirst.",
  "Miteinander statt nebeneinander.",
  "Gemeinschaft, die wirkt.",
  "Nicht reden. Helfen!",
  "Lasst uns einfach helfen."
];

export function Slogan() {
  const [index, setIndex] = useState(0);

  return (
    <div
      onClick={() => setIndex((index + 1) % slogans.length)}
      className="flex flex-col items-center justify-center gap-4 cursor-pointer"
    >
      <p className="text-neutral-100 text-xl">{slogans[index]}</p>
    </div>
  );
}

export default Slogan;