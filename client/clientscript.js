"use strict";
const isLocal = true; // Bei Upload in Cloud muss Wert als false gesetzt werden!
const url = isLocal ? "http://localhost:8100" : "https://gissomses2021.herokuapp.com"; // URL des zu kontaktierenden Servers definieren
function authenticateUser(operation) {
    // Username, password und message-Element aus dem HTML Dokument bekommen
    const username = getInputValueById("username");
    const password = getInputValueById("password");
    const messageElement = document.getElementById(operation === "login" ? "loginMessage" : "serverMessage");
    let data = new FormData(); // FormData-Objekt anlegen, in welchem die Login-Daten des Nutzers gespeichert werden
    data.append("requestType", operation);
    data.append("username", username);
    data.append("password", password);
    talkToServer(data).then(response => {
        messageElement.innerText = response.message; // der für die Serverantwort zuständige Teil auf der Login- bzw. Register-Seite wird mit dem Inhalt der Servermessage gefüllt
        messageElement.style.color = response.error ? "#a02128" : "#19e619"; // abhängig, ob erfolgreich oder nicht, erscheint der Text in grün oder rot
        if (!response.error) { // ist Login erfolgreich und kam es zu keinem Fehler Fehler, wird Nutzer automatisch auf die Seite mit allen Rezepten weitergeleitet
            sessionStorage.setItem("username", username);
            window.location.href = "allRecipes.html";
        }
    });
}
function createRecipe() {
    // Username, recipeTitle, ingredientList und preparation aus dem HTML Dokument bekommen
    const username = sessionStorage.getItem("username");
    const title = getInputValueById("title");
    const ingredients = getInputValueById("ingredients");
    const preparation = getInputValueById("preparation");
    let data = new FormData(); // FormData-Objekt anlegen, in welchem die Eingabeparameter des Nutzers gespeichert werden
    data.append("requestType", "createRecipe"); // Requesttyp definieren
    data.append("username", username);
    data.append("title", title);
    data.append("ingredients", ingredients);
    data.append("preparation", preparation);
    talkToServer(data);
}
function deleteRecipe() {
    // Username, recipeTitle aus dem HTML Dokument bekommen
    const username = sessionStorage.getItem("username");
    const title = getInputValueById("title");
    let data = new FormData(); // FormData-Objekt anlegen, in welchem die Eingabeparameter des Nutzers gespeichert werden
    data.append("requestType", "deleteRecipe");
    data.append("username", username);
    data.append("title", title);
    talkToServer(data);
}
function getRecipes() {
    const recipesContainer = document.getElementById("allRecipes");
    let data = new FormData();
    data.append("requestType", "getRecipes");
    talkToServer(data).then(response => {
        JSON.parse(response.message).forEach((recipe) => renderRecipe(recipesContainer, recipe));
    });
}
function addToFavorites() {
    const username = sessionStorage.getItem("username");
    const title = getInputValueById("title");
    const ingredients = getInputValueById("ingredients");
    const preparation = getInputValueById("preparation");
    let data = new FormData(); // FormData-Objekt anlegen, in welchem die Eingabeparameter des Nutzers gespeichert werden
    data.append("requestType", "addToFavorites"); // Requesttyp definieren
    data.append("username", username);
    data.append("title", title);
    data.append("ingredients", ingredients);
    data.append("preparation", preparation);
    talkToServer(data);
}
// Funktion die die Eingabe des Users in einem HTML-Input-Element zurückgibt
function getInputValueById(elementId) {
    const inputElement = document.getElementById(elementId);
    return inputElement.value;
}
async function talkToServer(data) {
    // tslint:disable-next-line:no-any
    const query = new URLSearchParams(data); // Umwandlung in URL-Parameter (url.com?key=value&key2=value2)
    return fetch(url + "?" + query.toString(), {
        method: "GET"
    }).then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    });
}
function renderRecipe(container, recipe) {
    const newRecipeElement = document.createElement("div");
    newRecipeElement.className = "recipe";
    newRecipeElement.innerHTML =
        `<h2 class="recipeTitle">${recipe.title} - <span class="recipeUsername">${recipe.username}</span></h2>
       <h3 class="recipeIngredientsHeading">Ingredients</h3>
       <ul class="recipeIngredients">
         ${recipe.ingredients.map((ingredient) => (`<li class="recipe-ingredient">${ingredient}</li>`))}
        </ul>
       <h3 class="recipe-preparation-heading">Preparation</h3>
       <p class="recipe-preparation">${recipe.preparation}</p>
       <button class="addToFavorites">♥</button>`;
    container.appendChild(newRecipeElement);
}
//# sourceMappingURL=clientScript.js.map