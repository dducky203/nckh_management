import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowForward } from "@mui/icons-material";
import Button from "../../../components/common/Button";

const Slideshow = ({ slides, autoPlayInterval = 5, user }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide change
  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval * 1000);

    return () => clearInterval(interval);
  }, [slides, autoPlayInterval]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (!slides || slides.length === 0) {
    return (
      <div className="h-[500px] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Không có slides để hiển thị</p>
      </div>
    );
  }

  return (
    <section className="relative h-[500px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="text-white max-w-2xl">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl mb-2 text-yellow-300">
                  {slide.subtitle}
                </p>

                {/* Description */}
                <p className="text-lg mb-6">{slide.description}</p>

                {/* CTA Button */}
                {slide.ctaText && slide.ctaLink && (
                  <Link to={slide.ctaLink}>
                    <Button className="bg-mainColor hover:bg-mainColor/90">
                      {slide.ctaText}
                      <ArrowForward className=" ml-2" fontSize="small" />
                    </Button>
                  </Link>
                )}

                {/* Default CTA based on user auth */}
                {!slide.ctaText && (
                  <>
                    {user ? (
                      <Link to="/events/dashboard">
                        <Button className="bg-mainColor hover:bg-mainColor/90">
                          Khám phá ngay
                          <ArrowForward className="ml-2" fontSize="small" />
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/login">
                        <Button className="bg-mainColor hover:bg-mainColor/90">
                          Đăng nhập để tham gia
                          <ArrowForward className="ml-2" fontSize="small" />
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="hover:ml-1 absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-mainColor/70 text-white p-2 rounded-full transition-all backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft fontSize="large" />
      </button>

      <button
        onClick={nextSlide}
        className="hover:mr-1 absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-mainColor/70 text-white p-2 rounded-full transition-all backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight fontSize="large" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-md transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75 w-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : "false"}
          />
        ))}
      </div>
    </section>
  );
};

export default Slideshow;
