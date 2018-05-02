exports.asciiToText = (string) => {
  return string.replace(/&amp;#(\d+);/g, function (m, n) { return String.fromCharCode(n); });
}
