const doubleNumber = (number) => {
  return new Promise((resolve, reject) => {
    // wenn Argument keine Ziffer ist, soll ein Fehler ausgegeben werden
    if (typeof number !== "number") reject("Para must be a number");

    // wenn Argument eine Ziffer ist, soll sie nach 2 Sekunden mit 2 multipliziert werden
    setTimeout(() => {
      resolve(number * 2);
    }, 2000);
  });
};

// Funktionsaufruf mit Argument Number
doubleNumber(4)
  .then((result) => {
    console.log(result); //--> 8
  })
  .catch((error) => {
    console.log(error);
  });

// // Funktionsaufruf mit Argument String
// doubleNumber("wort")
//   .then((wort) => console.log(wort))
//   .catch((err) => console.log(err)); //--> Para must be a number
