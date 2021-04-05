const slides = document.querySelectorAll(".details__image__carousel_item");
const images = document.querySelectorAll(
  ".details__image__carousel_item__image"
);
const arrow = document.querySelectorAll(".arrow");

const compact = document.querySelector(".details__thumbnail");
const compactImages = document.querySelectorAll(".details__thumbnail__image");

const showSlides = (n) => {
  if (slides.length === 1) {
    for (let i = 0; i < arrow.length; i++) {
      arrow[i].style.display = "none";
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "block";
      }
      compact.style.display = "none";
    }
  } else {
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (let i = 0; i < compactImages.length; i++) {
      compactImages[i].className = "details__thumbnail__image";
    }
    slides[slideIndex - 1].style.display = "block";
    compactImages[slideIndex - 1].className = "details__thumbnail__image_alt";
  }
};

let slideIndex = 1;
showSlides(slideIndex);

const plusSlides = (n) => {
  showSlides((slideIndex += n));
};

// Thumbnail image controls
const currentSlide = () => {
  for (let i = 0; i < compactImages.length; i++) {
    (function (index) {
      compactImages[i].onclick = function () {
        showSlides((slideIndex = index + 1));
      };
    })(i);
  }
};

currentSlide();

/* lightbox */

const leftA = document.querySelector(".details__image__prev");
const rightA = document.querySelector(".details__image__next");
const transparentBlack = document.querySelector(
  ".carousel_transparent_background"
);
const closeButton = document.querySelector(".carousel_exit_cross");
const thumbnail = document.querySelector(".details__thumbnail");

const lightboxOn = () => {
  for (let i = 0; i < images.length; i++) {
    images[i].classList.add("details__image__carousel_item__image_alt");
  }
  leftA.className = "details__image__prev_alt";
  rightA.className = "details__image__next_alt";
  thumbnail.className = "details__thumbnail_alt";
  document.body.style.overflow = "hidden";
  transparentBlack.style.display = "block";
  closeButton.style.display = "block";
};

const lightboxOff = () => {
  for (let i = 0; i < images.length; i++) {
    images[i].classList.remove("details__image__carousel_item__image_alt");
  }
  leftA.className = "details__image__prev";
  rightA.className = "details__image__next";
  thumbnail.className = "details__thumbnail";
  document.body.style.overflow = "auto";
  document.body.style.overflowX = "hidden";
  transparentBlack.style.display = "none";
  closeButton.style.display = "none";
};

for (let i = 0; i < images.length; i++) {
  images[i].addEventListener("click", lightboxOn);
}
transparentBlack.addEventListener("click", lightboxOff);
closeButton.addEventListener("click", lightboxOff);
