//Demonstrating the use of callbacks, Promises, and async/await in JavaScript
/////////////////////////////////////////////////////////////////////////////////////////

// Callback example
function fetchData1(callback) {
    setTimeout(() => {
        const data = "Callback Demo: Data received";
        callback(data); // Execute the callback with the data
    }, 1000); // Simulate a 1 second delay
}

fetchData1((data) => {
    console.log(data); // Callback receives the data after 1 second
    // Continue processing the data
    const processedData = "Processing data...";
    console.log(processedData);
    
    const finalMessage = "Data processed successfully!";
    console.log(finalMessage);
});


//Define a simple asynchronous function using Promise
const fetchData2 = new Promise((resolve) => {
    setTimeout(() => resolve("Promise Demo: Data received"), 1000);
});

fetchData2
    .then(data => {
        console.log(data);
        return "Processing data...";
    })
    .then(processedData => {
        console.log(processedData);
        return "Data processed successfully!";
    })
    .then(finalMessage => console.log(finalMessage))
    .catch(error => console.log(error))
    .finally(() => {
        console.log("Fetch operation completed, regardless of success or failure.");
    });


// Demonstrating async/await syntax
async function fetchData3() {
    try {
        const data = await new Promise((resolve) => {
            setTimeout(() => resolve("Async/Await Demo: Data received"), 1000);
        });
        console.log(data); // Data received after 1 second

        const processedData = "Processing data...";
        console.log(processedData);

        const finalMessage = "Data processed successfully!";
        console.log(finalMessage);

    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        console.log("Async operation completed.");
    }
}

fetchData3(); // Call the async function to execute it
