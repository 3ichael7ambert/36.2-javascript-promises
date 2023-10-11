document.addEventListener("DOMContentLoaded", () => {
    const cardDisplay = document.getElementById("cardDisplay");
    const factText = document.getElementById("factText");
    const resultText = document.getElementById("resultText");
    const highButton = document.getElementById("highButton");
    const lowButton = document.getElementById("lowButton");

    let deckId = null;
    let currentCardValue = 0;

    function shuffleNewDeck() {
        fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            .then(response => response.json())
            .then(data => {
                deckId = data.deck_id;
                // Draw the first card when the deck is shuffled
                drawCard();
            })
            .catch(error => console.error("Error:", error));
    }

    function drawCard() {
        if (deckId) {
            fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
                .then(response => response.json())
                .then(data => {
                    if (data.cards.length > 0) {
                        const card = data.cards[0];
                        const imageUrl = card.image;
                        cardDisplay.src = imageUrl;
                        cardDisplay.style.setProperty("--rotation", `${getRandomRotation()}deg`);
                        currentCardValue = getCardValueSum(card.value);

                        // Fetch and display a fact for the current card
                        getFactForCard(card.value);
                    } else {
                        cardDisplay.src = "";
                    }
                })
                .catch(error => console.error("Error:", error));
        } else {
            cardDisplay.src = "";
            alert("Please shuffle a new deck first.");
        }
    }

    function getRandomRotation() {
        return Math.random() * 70 - 35;
    }

    function getFactForCard(cardValue) {
        fetch(`http://numbersapi.com/${getCardValueSum(cardValue)}/trivia?json`)
            .then(response => response.json())
            .then(data => {
                if (data.found) {
                    factText.innerText = data.text;
                } else {
                    factText.innerText = "No fact found for this number.";
                }
            })
            .catch(error => console.error("Error:", error));
    }

    function getCardValueSum(cardValue) {
        const cardValues = {
            "ACE": 1,
            "2": 2,
            "3": 3,
            "4": 4,
            "5": 5,
            "6": 6,
            "7": 7,
            "8": 8,
            "9": 9,
            "10": 10,
            "JACK": 11,
            "QUEEN": 12,
            "KING": 13
        };

        return cardValues[cardValue] || 0;
    }

    function resetCardDisplay() {
        cardDisplay.src = "";
    }

    shuffleNewDeck();
    highButton.addEventListener("click", () => checkGuess("high"));
    lowButton.addEventListener("click", () => checkGuess("low"));

    function checkGuess(guess) {
        if (deckId) {
            fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
                .then(response => response.json())
                .then(data => {
                    if (data.cards.length > 0) {
                        const nextCardValue = getCardValueSum(data.cards[0].value);
                        const isCorrect = (guess === "high" && nextCardValue > currentCardValue) || (guess === "low" && nextCardValue < currentCardValue);

                        if (isCorrect) {
                            resultText.innerText = `Correct! The next card is ${guess}.`;
                        } else {
                            resultText.innerText = `Wrong! The next card is not ${guess}.`;
                        }

                        const imageUrl = data.cards[0].image;
                        cardDisplay.src = imageUrl;
                        cardDisplay.style.setProperty("--rotation", `${getRandomRotation()}deg`);
                        currentCardValue = nextCardValue;

                        // Fetch and display a new fact for the next card
                        getFactForCard(data.cards[0].value);
                    } else {
                        cardDisplay.src = "";
                        factText.innerText = "No more cards in the deck.";
                    }
                })
                .catch(error => console.error("Error:", error));
        } else {
            cardDisplay.src = "";
            alert("Please shuffle a new deck first.");
        }
    }
});
