document.addEventListener("DOMContentLoaded", () => {
    const numberForm = document.getElementById("number-form");
    const factsContainer = document.getElementById("facts-container"); // Updated to target the new div

    numberForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const favoriteNumber = document.getElementById("favorite-number").value;

        // Function to fetch a fact about a specific number from the Numbers API
        function fetchNumberFact(number) {
            return new Promise((resolve, reject) => {
                fetch(`http://numbersapi.com/${number}?json`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.found) {
                            resolve(data.text);
                        } else {
                            reject("Fact not found for the number " + number);
                        }
                    })
                    .catch(error => reject(error));
            });
        }

        // Fetch 4 facts about the favorite number
        const promises = [];
        for (let i = 0; i < 4; i++) {
            promises.push(fetchNumberFact(favoriteNumber));
        }

        // Display the facts on the page when all requests are complete
        Promise.all(promises)
            .then(facts => {
                // Clear previous facts
                factsContainer.innerHTML = "";

                // Display the facts
                facts.forEach(fact => {
                    const factElement = document.createElement("p");
                    factElement.textContent = fact;
                    factsContainer.appendChild(factElement);
                });
            })
            .catch(error => {
                console.error(error);
                factsContainer.innerHTML = "Error fetching facts.";
            });
    });
});
