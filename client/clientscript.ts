const isLocal: boolean = false;     // Bei Upload in Cloud muss Wert als false gesetzt werden!
const url: string = isLocal ? "http://localhost:8100" : "https://gissomses2021.herokuapp.com"; // URL des zu kontaktierenden Servers definieren

interface Recipe {                  // Interface für Rezepte mit Namen des Erstellers, Rezepttitel, Zutaten (als String-Array) u. Zubereitungsanweisungen
    username: string;
    title: string;
    ingredients: string[];
    preparation: string;
}

interface ServerMeldung {   // Interface für Server Meldung
    error: boolean;          // Error Message, wenn Username vorhanden
    message: string;        // Nachricht, wenn User erfolgreich angelegt wurde
}

function authenticateUser(operation: string): void {         // Funktion, die sowohl Nutzer registrieren, als auch Nutzer eiinloggen kann
    // Username, password und message-Element aus dem HTML Dokument bekommen
    const username: string = getInputValueById("username");
    const password: string = getInputValueById("password");
    const messageElement: HTMLElement = <HTMLElement>document.getElementById(operation === "login" ? "loginMessage" : "serverMessage");

    let data: FormData = new FormData();            // FormData-Objekt anlegen, in welchem die Login-Daten des Nutzers gespeichert werden
    data.append("requestType", operation);
    data.append("username", username);
    data.append("password", password);

    talkToServer(data).then(response => {
        messageElement.innerText = response.message;    // der für die Serverantwort zuständige Teil auf der Login- bzw. Register-Seite wird mit dem Inhalt der Servermessage gefüllt
        messageElement.style.color = response.error ? "#a02128" : "#19e619";    // abhängig, ob erfolgreich oder nicht, erscheint der Text in grün oder rot

        if (!response.error) {                              // ist Login erfolgreich und kam es zu keinem Fehler Fehler, wird Nutzer automatisch auf die Seite mit allen Rezepten weitergeleitet
            sessionStorage.setItem("username", username);
            window.location.href = "allRecipes.html";
        }
    });
}

function createRecipe(): void {
    // Username, recipeTitle, ingredientList und preparation aus dem HTML Dokument bekommen
    const username: string = sessionStorage.getItem("username");                //Der Username kann aus dem Session Storage entnommen werden
    const title: string = getInputValueById("title");
    const ingredients: string = getInputValueById("ingredients");
    const preparation: string = getInputValueById("preparation");

    let data: FormData = new FormData();            // FormData-Objekt anlegen, in welchem die Eingabeparameter des Nutzers gespeichert werden, die für die Ausführung der Funktion auf Serverseite notwendig sind
    data.append("requestType", "createRecipe");     // Requesttyp definieren und für Rezept notwendigen Inhalte mitgeben
    data.append("username", username);
    data.append("title", title);
    data.append("ingredients", ingredients);
    data.append("preparation", preparation);

    talkToServer(data);
}

function deleteRecipe(): void {
    // Username, recipeTitle aus dem HTML Dokument bekommen
    const username: string = sessionStorage.getItem("username");
    const title: string = getInputValueById("title");

    let data: FormData = new FormData();
    data.append("requestType", "deleteRecipe");
    data.append("username", username);
    data.append("title", title);

    talkToServer(data);
}

function getRecipes(): void {
    const recipesContainer: HTMLDivElement = <HTMLDivElement>document.getElementById("allRecipes");

    let data: FormData = new FormData();
    data.append("requestType", "getRecipes");

    talkToServer(data).then(response => {
        JSON.parse(response.message).forEach((recipe: Recipe) => renderRecipe(recipesContainer, recipe));
    });
}

function addToFavorites(): void {
    const username: string = sessionStorage.getItem("username");
    const title: string = getInputValueById("title");
    const ingredients: string = getInputValueById("ingredients");
    const preparation: string = getInputValueById("preparation");

    let data: FormData = new FormData();            // FormData-Objekt anlegen, in welchem die Eingabeparameter des Nutzers gespeichert werden
    data.append("requestType", "addToFavorites");     // Requesttyp definieren
    data.append("username", username);
    data.append("title", title);
    data.append("ingredients", ingredients);
    data.append("preparation", preparation);

    talkToServer(data);
}

// Funktion die die Eingabe des Users in einem HTML-Input-Element zurückgibt, um Codewiederholung zu vermeiden
function getInputValueById(elementId: string): string {
    const inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById(elementId);
    return inputElement.value;
}

async function talkToServer(data: FormData): Promise<ServerMeldung> {       // Funktion mithilfe derer mit dem Server kommuniziert wird

    const query: URLSearchParams = new URLSearchParams(<any>data);      // Umwandlung in URL-Parameter (url.com?key=value&key2=value2)
    return fetch(url + "?" + query.toString(), {
        method: "GET"
    }).then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    });
}

function renderRecipe(container: HTMLDivElement, recipe: Recipe): void {
    // Funktion, die dynamisch ein Rezept erstellt, indem ein div-Container erstellt wird, welcher mit den einzelnen Bestandteilen des Rezepts befüllt wird
    const newRecipeElement: HTMLElement = document.createElement("div");
    newRecipeElement.className = "recipe";
    newRecipeElement.innerHTML =
        `<h2 class="recipeTitle">${recipe.title} - <span class="recipeUsername">${recipe.username}</span></h2>
       <h3 class="recipeIngredientsHeading">Ingredients</h3>
       <ul class="recipeIngredients">
         ${recipe.ingredients.map((ingredient: string) => (`<li class="recipe-ingredient">${ingredient}</li>`))}
        </ul>
       <h3 class="recipePreparationHeading">Preparation</h3>
       <p class="recipePreparation">${recipe.preparation}</p>
       <button class="addToFavorites" onclick="addToFavorites()">♥</button>`;
    container.appendChild(newRecipeElement);
}


