function fetchUserData() {
  // Simulating an asynchronous operation (e.g., fetching data from an API)
  return new Promise((resolve, reject) => {
    //this is the way we declare the promise using the class delclareation syntax using the new keyword
    setTimeout(() => {
      // Simulated user data response
      const userData = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      };

      // Simulating successful response
      const success = Math.random() < 0.99; // 99% chance of success

      if (success) {
        resolve(userData); // Resolve with user data
      } else {
        reject(new Error("Failed to fetch user data")); // Reject with an error
      }
    }, 1000); // Simulating a delay of 1 second
  });
}

fetchUserData()
  .then((userData) => {
    console.log("User data:", userData);
    // Further processing of user data, e.g., displaying it on a webpage
  })
  .catch((error) => {
    console.error("Error: hellllooo", error.message);
    // Handling the error, e.g., displaying an error message to the user
  });
