// src/components/ImageBoard.tsx
import { useState } from "react";
import './ImageBoard.css';

type ImgItem = { id: number; src: string; alt: string };

const IMAGES: ImgItem[] = Array.from({ length: 12 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    src: `/images/img${id}.jpg`,
    alt: `Imagem ${id}`,
  };
});

// Fisher–Yates (sem mutar o array original)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ImageBoard() {
  // embaralha apenas na primeira renderização
  //const [deck] = useState<ImgItem[]>(() => shuffle(IMAGES));
  const [deck, setDeck] = useState<ImgItem[]>(() => shuffle(IMAGES));
  const [selectedImages, setSelectedImages] = useState<ImgItem[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  function handleImageClick(image: ImgItem) {    
    setSelectedImages((prev) => {
      // se já clicou nessa imagem → reset
      if (prev.find((img) => img.id === image.id)) {
        setScore(0); // reseta pontuação atual

        // Aciona shake
        setShakeTrigger(true);
        setTimeout(() => setShakeTrigger(false), 300); // 300ms = duração da animação

        return [];
      }      
       // adiciona a imagem ao vetor
      const newSelected = [...prev, image];

      // atualiza score
      const newScore = newSelected.length;
      setScore(newScore);

      // atualiza highScore se necessário
      setHighScore((prevHigh) => Math.max(prevHigh, newScore));

      return newSelected;
      
    });

    // reembaralha sempre que clica
    setDeck(shuffle(IMAGES));
  }

  const topRow = deck.slice(0, 6);
  const bottomRow = deck.slice(6, 12);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h3>Pontuação: {score}</h3>
      <h3>Recorde: {highScore}</h3>  

      <Row items={topRow} onImageClick={handleImageClick} shakeTrigger={shakeTrigger}/>
      <Row items={bottomRow} onImageClick={handleImageClick} shakeTrigger={shakeTrigger}/>
      
    </div> 
  );
}

function Row({ items, onImageClick, shakeTrigger }: { items: ImgItem[]; onImageClick: (image: ImgItem) => void; shakeTrigger?: boolean; }) {
  return (
    <div className={`row ${shakeTrigger ? 'shake' : ''}`}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 12,
      }}
    >
      {items.map((item) => (
        <img
          key={item.id}
          src={item.src}
          alt={item.alt}
          className="image-card"
          onClick={() => onImageClick(item)}
        />
      ))}
    </div>
  );
}
