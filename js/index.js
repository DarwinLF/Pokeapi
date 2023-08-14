let pokemons = [];

async function obtainPokemonList() {
    const result = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
    const data = await result.json();

    data.results.forEach((pokemon) => {
        pokemons.push(pokemon.name);
    });

    autoComplete(document.getElementById("pokemonFind"));
}

function autoComplete(input) {
    let currentFocus;

    input.addEventListener("input", function(e) {

        let a, b, val = this.value;
        closeAllLists();
        if(!val) {return false;}
        currentFocus = -1;
        a = document.createElement("div");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);

        pokemons.forEach((pokemonName) => {
            if(pokemonName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("div");
                b.innerHTML = "<strong>" + pokemonName.substr(0, val.length) + "</strong>";
                b.innerHTML += pokemonName.substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + pokemonName + "'>";
                b.addEventListener("click", function(e) {
                    input.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                })
                a.appendChild(b);
            }
        });
    });

    input.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");

        if (x) {
            x = x.getElementsByTagName("div");
        }

        if(e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        }
        else if(e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        }
        else if (e.keyCode == 13) {
            e.preventDefault();
            if(currentFocus > -1) {
                if(x) {
                    x[currentFocus].click();
                }
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
    
        removeActive(x);
        if(currentFocus >= x.length) currentFocus = 0;
        if(currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(element) {
        var x = document.getElementsByClassName("autocomplete-items");
        
        for(let i = 0; i < x.length; i++) {
            if(element != x[i] && element != input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function matchPokemons() {
    const pokemonFindElement = document.getElementById("pokemonFind");
    const informationElement = document.getElementById("information");
    informationElement.setAttribute("hidden", "hidden")
    const pokemonFind = pokemonFindElement.value.toLowerCase();
    const matches = [];

    if(pokemonFind === "") {
        return;
    }

    for(let i = 0; i < pokemons.length; i++) {
        if(pokemons[i] === pokemonFind) {
            searchPokemon(pokemons[i]);
            return;
        }
        
        if(pokemons[i].startsWith(pokemonFind)) {
            matches.push(pokemons[i])
        }
    }

    if(matches.length === 0) {
        alert("Pokemon no encontrado");
    }
    else if(matches.length === 1) {
        searchPokemon(matches[0]);
    }
    else {
        showMatches(matches);
    }
}

async function searchPokemon(pokemonName) {
    const baseUrl = "https://pokeapi.co/api/v2/pokemon/";

    const result = await fetch(baseUrl + pokemonName);
    const data = await result.json();

    showData(data);
}

function showData(data) {
    const matchesHidElement = document.getElementById("matchesHid");
    matchesHidElement.setAttribute("hidden", "hidden");
    const matchesElement = document.getElementById("matches");
    matchesElement.innerHTML = "";

    const spriteImageElement = document.getElementById("sprite");
    const nameElement = document.getElementById("name");
    const typesElement = document.getElementById("types");
    const heightElement = document.getElementById("height");
    const weightElement = document.getElementById("weight");
    const informationElement = document.getElementById("information");

    spriteImageElement.src = data.sprites.front_default;
    nameElement.innerHTML= data.name;
    typesElement.innerHTML = "";
    data.types.forEach((type) => {
        typesElement.innerHTML += convertTypesToSpanish(type.type.name) + " ";
    });
    heightElement.innerHTML = data.height + " m";
    weightElement.innerHTML = data.weight + " kg";

    informationElement.removeAttribute("hidden");
}

function convertTypesToSpanish(type) {
    switch(type) {
        case "fire":
            return "fuego";
        case "water":
            return "agua";
        case "grass":
            return "planta";
        case "flying":
            return "volador";
        case "fighting":
            return "lucha";
        case "poison":
            return "veneno";
        case "electric":
            return "eléctrico";
        case "ground":
            return "tierra";
        case "rock":
            return "roca";
        case "psychic":
            return "psíquico";
        case "ice":
            return "hielo";
        case "bug":
            return "bicho";
        case "ghost":
            return "fantasma";
        case "steel":
            return "acero";
        case "dragon":
            return "dragón";
        case "dark":
            return "siniestro";
        case "fairy":
            return "hada";
        default:
            return type;
    }
}

function showMatches(pokemons) {
    const matchesHidElement = document.getElementById("matchesHid");
    const matchesElement = document.getElementById("matches");

    pokemons.forEach((pokemon) => {
        let button = document.createElement("button");
        button.innerHTML = pokemon;
        button.setAttribute("onclick", `searchPokemon("${pokemon}")`);
        matchesElement.appendChild(button);
        matchesElement.appendChild(document.createTextNode( '\u00A0' ));
    });

    matchesHidElement.removeAttribute("hidden");
}