import Carousel from "@/components/Carousel";

export default function HomePage() {
  const carouselImages = [
    "/images/carousel/barber-1.png",
    "/images/carousel/barber-2.png",
    "/images/carousel/barber-3.png",
    "/images/carousel/barber-4.png",
    "/images/carousel/barber-5.png",
  ];
  return (
    <div>
      <Carousel
        images={carouselImages}
        title="Estilos y cortes"
        autoPlay={true}
        intervalMs={3500}
      />
    </div>
  );
}
