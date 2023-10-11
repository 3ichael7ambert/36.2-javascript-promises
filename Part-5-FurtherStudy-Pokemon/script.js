

const pokemonContainer = document.getElementById('pokemonContainer');
        const generateButton = document.getElementById('generateButton');

        function getRandomPokemon(pokemonList) {
            return pokemonList[Math.floor(Math.random() * pokemonList.length)];
        }

        async function getPokemonData(pokemon) {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = await pokemonResponse.json();

            const speciesResponse = await fetch(pokemonData.species.url);
            const speciesData = await speciesResponse.json();

            const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
            const descriptionText = description ? description.flavor_text : 'Description not found';

            return {
                name: pokemon.name,
                image: pokemonData.sprites.front_default,
                description: descriptionText,
            };
        }

        async function generateRandomPokemon() {
            pokemonContainer.innerHTML = '';

            try {
                const allPokemonResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
                const allPokemonData = await allPokemonResponse.json();

                const randomPokemonPromises = Array.from({ length: 3 }, () => {
                    const randomPokemon = getRandomPokemon(allPokemonData.results);
                    return getPokemonData(randomPokemon);
                });

                const randomPokemonData = await Promise.all(randomPokemonPromises);

                randomPokemonData.forEach(pokemon => {
                    displayPokemon(pokemon);
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function displayPokemon(pokemon) {
            const pokemonDiv = document.createElement('div');
            pokemonDiv.classList.add('pokemon-card');
            pokemonDiv.innerHTML = `
                <h2>${pokemon.name}</h2>
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <p>${pokemon.description}</p>
            `;
            pokemonContainer.appendChild(pokemonDiv);
        }

        generateButton.addEventListener('click', generateRandomPokemon);