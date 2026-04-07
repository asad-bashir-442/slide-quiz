export const comma = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function numberToLetter(number) {
  if (number >= 1 && number <= 26) {
    const asciiCode = number + 64;
    return String.fromCharCode(asciiCode);
  } else {
    return "Number out of range (1-26)";
  }
}
