const rand = () => {
  return "hsla(" + Math.floor(Math.random() * 360) + ", 100%, 50%, 1)";
};

module.exports = rand;
