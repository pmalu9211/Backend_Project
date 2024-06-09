const listOfIngredients = []; // Assuming this array is defined somewhere in your code

async function asynchronousFunction() {
  //this fucntion now gives delay and a promis which the next fuction in the series of the logIngredients has,
  //because of this now the it executes the hello console.log statement in a sync manner i.e, after the other fuctions have been executed and others wait for the promis sent by this and vice verca happens in other case
  // Simulating an asynchronous operation with a delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("HELLo");
      reject(new Error("FUCK OFF NIGGA"));
      resolve("result");
    }, 1000);
  });
}

async function logIngredients() {
  try {
    const url = await doSomething();
    const res = await fetch(url);
    const data = await res.json();
    listOfIngredients.push(data);
    console.log(listOfIngredients);
    console.log("WHY AM I HERE !!!");
    await asynchronousFunction();
    console.log("WHY AM I HERE !!!");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Example function for demonstration purposes
async function doSomething() {
  return "https://dummyjson.com/posts";
}

// Example usage of logIngredients()
logIngredients();
