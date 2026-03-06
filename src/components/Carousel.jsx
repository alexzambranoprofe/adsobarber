import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

const CarouselWrapper = styled.section`
  margin-top: 24px;
`;

const Title = styled.h2`
  margin: 0 0 12px;
  font-size: 20px;
  color: #333;
`;

const Frame = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #eaeaea;
  background: #fff;
`;

const Track = styled.div`
  display: flex;
  transition: transform 400ms ease;
  transform: translateX(${(p) => `-${p.index * 100}%`});
`;

const Slide = styled.div`
  min-width: 100%;
  height: 450px;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
`;

const SlideImage = styled.img`
  max-height: 450px;
  max-width: 400px;
  object-fit: cover;
  object-position: center;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  width: 40px;
  height: 40px;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.9);
  color: #2e8700; /* verde oscuro */
  border: 1px solid rgba(0, 0, 0, 0.08);

  display: grid;
  place-items: center;

  &:hover {
    background: #39a900; /* verde SENA */
    color: #fff;
  }
`;

const Prev = styled(ArrowButton)`
  left: 12px;
`;

const Next = styled(ArrowButton)`
  right: 12px;
`;

const Dots = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;

  display: flex;
  justify-content: center;
  gap: 8px;
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 999px;

  border: 0;
  background: ${(p) => (p.active ? "#39a900" : "rgba(255,255,255,0.8)")};
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);

  &:hover {
    background: #2e8700;
  }
`;

// Pequeño helper para cambiar el índice en “ciclo”
function wrapIndex(nextIndex, length) {
  if (nextIndex < 0) return length - 1;
  if (nextIndex >= length) return 0;
  return nextIndex;
}

export default function Carousel({
  images,
  autoPlay = true,
  intervalMs = 6000,
  title = "Nuestro trabajo",
}) {
  const slides = useMemo(() => images ?? [], [images]);
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((i) => wrapIndex(i - 1, slides.length));
  const goNext = () => setIndex((i) => wrapIndex(i + 1, slides.length));

  // Autoplay
  useEffect(() => {
    if (!autoPlay) return;
    if (!slides.length) return;

    const id = setInterval(() => {
      setIndex((i) => wrapIndex(i + 1, slides.length));
    }, intervalMs);

    return () => clearInterval(id);
  }, [autoPlay, intervalMs, slides.length]);

  if (!slides.length) return null;

  return (
    <CarouselWrapper>
      <Title>{title}</Title>

      <Frame>
        <Track index={index}>
          {slides.map((src, idx) => (
            <Slide key={`${src}-${idx}`}>
              <SlideImage src={src} alt={`AdsoBarber slide ${idx + 1}`} />
            </Slide>
          ))}
        </Track>

        <Prev onClick={goPrev} aria-label="Anterior">
          ‹
        </Prev>
        <Next onClick={goNext} aria-label="Siguiente">
          ›
        </Next>

        <Dots>
          {slides.map((_, i) => (
            <Dot
              key={i}
              type="button"
              active={i === index}
              onClick={() => setIndex(i)}
              aria-label={`Ir a la imagen ${i + 1}`}
            />
          ))}
        </Dots>
      </Frame>
    </CarouselWrapper>
  );
}
