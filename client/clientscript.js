"use strict";
const isLocal = true; // Bei Upload in Cloud muss Wert als false gesetzt werden!
const url = isLocal ? "http://localhost:8100" : "https://gissomses2021.herokuapp.com"; // URL des zu kontaktierenden Servers definieren
function checkLogin() {
    if (!sessionStorage.getItem("username")) {
        window.location.href = "index.html";
    }
}
function authenticateUser(operation) {
    // Username, password und message-Element aus dem HTML Dokument bekommen
    const uname = getInputValueById("uname");
    const password = getInputValueById("password");
    const messageElement = document.getElementById(operation === "login" ? "loginMessage" : "serverMessage");
    let data = new FormData(); // FormData-Objekt anlegen, in welchem die Eingabeparameter des Nutzers gespeichert werden
    data.append("requestType", operation);
    data.append("uname", uname);
    data.append("password", password);
    talkToServer(data).then(response => {
        messageElement.innerText = response.message; // der für die Serverantwort zuständige Teil auf der Login- bzw. Register-Seite wird mit dem Inhalt der Servermessage gefüllt
        messageElement.style.color = response.error ? "#a02128" : "#19e619"; // abhängig, ob erfolgreich oder nicht, erscheint der Text in grün oder rot
        if (!response.error) {
            sessionStorage.setItem("username", uname);
            window.location.href = "allRecipes.html";
        }
    });
}
function createRecipe() {
    // Username, recipeTitle, ingredientList und preparation aus dem HTML Dokument bekommen
    const uname = sessionStorage.getItem("username");
    const title = getInputValueById("title");
    const ingredients = getInputValueById("ingredients");
    const preparation = getInputValueById("preparation");
    let data = new FormData(); // FormData-Objekt anlegen, in welchem die Eingabeparameter des Nutzers gespeichert werden
    data.append("requestType", "createRecipe");
    data.append("uname", uname);
    data.append("title", title);
    data.append("ingredients", ingredients);
    data.append("preparation", preparation);
    talkToServer(data);
}
function deleteRecipe() {
    // Username, recipeTitle aus dem HTML Dokument bekommen
    const uname = sessionStorage.getItem("username");
    const title = getInputValueById("title");
    let data = new FormData(); // FormData-Objekt anlegen, in welchem die Eingabeparameter des Nutzers gespeichert werden
    data.append("requestType", "deleteRecipe");
    data.append("uname", uname);
    data.append("title", title);
    talkToServer(data);
}
function getRecipes() {
    const recipesElement = document.getElementById("recipes");
    let data = new FormData();
    data.append("requestType", "getRecipe");
    talkToServer(data).then(response => {
        // vvv response möglicherweise nicht Liste von Recipes sondern List liegt in response.message oder response.data
        response.forEach((recipe) => {
            const newRecipeElement = document.createElement("recipeContainer");
            newRecipeElement.innerHTML =
                `<div class="recipe">
                   <h2 class="recipeTitle">${recipe.title}</h2>
                   <h3 class="recipeUsername">${recipe.username}</h3>
                   <h3 class="recipeIngredientsHeading">Ingredients</h3>
                   <ul class="recipeIngredients">
                     ${recipe.ingredients.map((ingredient) => (`<li class="recipe-ingredient">${ingredient}</li>`))}
                    </ul>
                   <h3 class="recipe-preparation-heading">Preparation</h3>
                   <p class="recipe-preparation">${recipe.preparation}</p>
                </div`;
            recipesElement.appendChild(newRecipeElement);
        });
    });
}
// Funktion die die Eingabe des Users in einem HTML-Input-Element zurückgibt
function getInputValueById(elementId) {
    const inputElement = document.getElementById(elementId);
    return inputElement.value;
}
// tslint:disable-next-line:no-any
async function talkToServer(data) {
    // tslint:disable-next-line:no-any
    const query = new URLSearchParams(data); // Umwandlung in URL-Parameter (url.com?key=value&key2=value2)
    return fetch(url + "?" + query.toString(), {
        method: "GET"
    }).then(response => response.json()).catch(console.error); // Jeder auftretende Fehler wird in die Konsole weitergeleitet
}
//# sourceMappingURL=clientScript.js.map