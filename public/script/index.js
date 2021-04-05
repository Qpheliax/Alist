/** hide doodle patterns on non-supporting browsers. */
if (!window.customElements || !document.head.attachShadow) {
  document.body.classList.add("no-doodle-support");
}

//
const w = window.innerWidth;
const h = window.innerHeight;

/* cat's eyes */
const items = document.querySelectorAll(".forCat");

const redEyes = () => {
  for (let i = 0; i < items.length; i++) {
    const img = document.querySelector(".cat");

    if (img) {
      items[i].addEventListener("mouseover", function () {
        img.src = "/assets/fox_alt.svg";
      });
      items[i].addEventListener("mouseout", function () {
        img.src = "/assets/fox.svg";
      });
    }
  }
};

/* back button dynamic width*/

const backWidth = () => {
  const backButton = document.querySelector(".back_btn");

  if (backButton) {
    const submit = document.querySelector(".btn");
    const submitWidth = submit.offsetWidth;
    backButton.style.width = `${submitWidth}px`;
    submit.addEventListener("resize", function () {
      backWidth();
    });
  }
};

/* style for forth container in first row */

const itemContent = document.querySelectorAll("._item");

const setForthClass = () => {
  if (itemContent[3] && w >= 1440) {
    const forth = itemContent[3];
    forth.id = "forth";
  }
};

const setPaddingToForth = () => {
  const forthContainer = document.getElementById("forth");
  if (forthContainer && w >= 1440) {
    const itemWidth = document.querySelectorAll("._gItem")[0].offsetWidth;
    const itemContainerWidth = itemContent[0].offsetWidth;
    const remainder = (itemWidth - itemContainerWidth) / 2;
    const setPadding = (forthContainer.style.marginLeft = `${remainder}px`);
  }
};

/* div for stars 1/4 part of window */

const stars = document.querySelector(".starsPalace");
const starsPalace = () => {
  const divWidth = w / 2;
  const divHeight = h / 2;

  if (stars) {
    stars.style.width = `${divWidth}px`;
    stars.style.height = `${divHeight - 100}px`;
  }
};

const createStar = (tp, lf, width, height) => {
  const size = Math.floor(Math.random() * 3) + 1;
  const starTop = tp + Math.floor(Math.random() * height);
  const starLeft = lf + Math.floor(Math.random() * width);

  const star = document.createElement("div");
  star.className = "star";

  star.style.top = `${starTop}px`;
  star.style.left = `${starLeft}px`;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.backgroundColor = `rgba(255, 255, 255, .${Math.floor(
    Math.random() * 10 + 1
  )})`;

  document.querySelector(".starsPalace").appendChild(star);

  const starAnimation = () => {
    setTimeout(() => {
      const randomnumber = Math.floor(Math.random() * 15) + 5;
      star.style.animation = `starFades ${randomnumber}s ease alternate infinite`;
    }, 2000);
  };
  starAnimation();
};

/* redraw stars on resize */
const newLocal = ".starsPalace";
const starLoop = () => {
  for (let i = 0; i < 110; i++) {
    const tp = document.querySelector(newLocal).offsetTop;
    const lf = document.querySelector(newLocal).offsetLeft;

    const width = document.querySelector(newLocal).offsetWidth;
    const height = document.querySelector(newLocal).offsetHeight;
    createStar(tp, lf, width, height);
  }
};

/* delete old stars on resize */
const renew = () => {
  const node = document.querySelector(".starsPalace");
  node.innerHTML = "";
};

/* custom upload button, reduse uploaded filename to 20 characters */
const uploadFilesInformation = () => {
  const hiddenUploadButton = document.querySelector(".editForm__load__input");
  if (hiddenUploadButton) {
    const fileChosen = document.querySelector(".editForm__files");
    hiddenUploadButton.addEventListener("change", function (event) {
      let spanCount = "";
      if (this.files && this.files.length > 1) {
        spanCount = this.files.length + "files ";
      } else {
        const dots = "...";
        const thisvalue = event.target.value.split("\\").pop();

        if (thisvalue.length > 20) {
          spanCount = dots + thisvalue.slice(-20);
        } else {
          spanCount = thisvalue;
        }
      }

      if (spanCount) {
        fileChosen.innerHTML = spanCount;
      } else {
        fileChosen.innerHTML = "";
      }
    });
  }
};

// help display

const helpDisplay = () => {
  const icon = document.querySelector(".help_icon");

  if (icon) {
    const dialog = document.querySelector(".help_icon__information");
    icon.addEventListener("mouseover", function () {
      dialog.style.display = "block";
    });
    icon.addEventListener("mouseout", function () {
      dialog.style.display = "none";
    });
  }
};

// active page numbers - pagination

const toggleNumbers = () => {
  const current = location.href;
  const links = document.querySelectorAll("._link");
  const linksLength = links.length;

  for (let i = 0; i < linksLength; i++) {
    if (links[i].href === current) {
      links[i].className += " nActive";
    }
  }
};

/* onLoad*/

backWidth();
redEyes();
// console.time();
starsPalace();
starLoop();
// console.timeEnd();
helpDisplay();
setForthClass();
setPaddingToForth();
uploadFilesInformation();
toggleNumbers();

/* onResize */
const asyncStars = async () => {
  starsPalace();
  renew();
  starLoop();
};

window.addEventListener("resize", function () {
  setPaddingToForth();
  asyncStars();
});

window.addEventListener("load", function () {
  backWidth();
});
