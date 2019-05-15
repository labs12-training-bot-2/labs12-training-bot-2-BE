function arrayFlat(arr) {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(arrayFlat(val)) : acc.concat(val),
    []
  );
}

module.exports = arrayFlat
