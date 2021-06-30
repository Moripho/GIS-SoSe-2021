const isLocal: boolean = true;     // Bei Upload in Cloud muss Wert als false gesetzt werden!
const url: string = isLocal ? "http://localhost:8100" : "https://gissomses2021.herokuapp.com";

interface Recipe {
    username: string;
    title: string;
    ingredients: string[];
    preparation: string;
}

function checkLogin(): void {
    if (!sessionStorage.getItem("username")) {
        window.location.href = "index.html";
    }
}

function authenticateUser(operation: string): void {
    // Username, password und message-Element aus dem HTML Dokument bekommen
    const uname: string = getInputValueById("uname");
    const password: string = getInputValueById("password");
    const messageElement: HTMLElement = <HTMLElement>document.getElementById(operation === "login" ? "loginMessage" : "serverMessage");

    let data: FormData = new FormData();            // FormData-Objekt anlegen, in welchem die Eingabeparameter des Nutzers gespeichert werden
    data.append("requestType", operation);
    data.append("uname", uname);
    data.append("password", password);

    talkToServer(data).then(response => {
        messageElement.innerText = response.message;    // der für die Serverantwort zuständige Teil auf der Login- bzw. Register-Seite wird mit dem Inhalt der Servermessage gefüllt
        messageElement.style.color = response.error ? "#a02128" : "#19e619";    // abhängig, ob erfolgreich oder nicht, erscheint der Text in grün oder rot

        if (!response.error) {
            sessionStorage.setItem("username", uname);
            window.location.href = "allRecipes.html";
        }
    });
}

function createRecipe(): void {
    // Username, recipeTitle, ingredientList und preparation aus dem HTML Dokument bekommen
    const uname: string = sessionStorage.getItem("username");
    const title: string = getInputValueById("title");
    const ingredients: string = getInputValueById("ingredients");
    const preparation: string = getInputValueById("preparation");

    let data: FormData = new FormData();            // FormData-Objekt anlegen, in welchem die Eingabeparameter des Nutzers gespeichert werden
    data.append("requestType", "createRecipe");
    data.append("uname", uname);
    data.append("title", title);
    data.append("ingredients", ingredients);
    data.append("preparation", preparation);

    talkToServer(data);
}

function deleteRecipe(): void {
    // Username, recipeTitle aus dem HTML Dokument bekommen
    const uname: string = sessionStorage.getItem("username");
    const title: string = getInputValueById("title");

    let data: FormData = new FormData();            // FormData-Objekt anlegen, in welchem die Eingabeparameter des Nutzers gespeichert werden
    data.append("requestType", "deleteRecipe");
    data.append("uname", uname);
    data.append("title", title);

    talkToServer(data);
}

function getRecipes(): void {
    const recipesElement: HTMLElement = <HTMLElement>document.getElementById("recipes");

    let data: FormData = new FormData();
    data.append("requestType", "getRecipe");

    talkToServer(data).then(response => {
        // vvv response möglicherweise nicht Liste von Recipes sondern List liegt in response.message oder response.data
        response.forEach((recipe: Recipe) => {
            const newRecipeElement: HTMLDivElement = document.createElement("recipeContainer");
            newRecipeElement.innerHTML =
                `<h2 class="recipe-title">${recipe.title}</h2>
                 <h3 class="recipe-username">${recipe.username}</h3>
                 <h3 class="recipe-ingredients-heading">Ingredients</h3>
                 <ul class="recipe-ingredients">
                    ${recipe.ingredients.map((ingredient: string) => (`<li class="recipe-ingredient">${ingredient}</li>`))}
                 </ul>
                 <h3 class="recipe-preparation-heading">Preparation</h3>
                 <p class="recipe-preparation">${recipe.preparation}</p>`;
            recipesElement.appendChild(newRecipeElement);
        });
        }
    );
}

// Funktion die die Eingabe des Users in einem HTML-Input-Element zurückgibt
function getInputValueById(elementId: string): string {
    const inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById(elementId);
    return inputElement.value;
}

// tslint:disable-next-line:no-any
async function talkToServer(data: FormData): Promise<any> {
    // tslint:disable-next-line:no-any
    const query: URLSearchParams = new URLSearchParams(<any>data);      // Umwandlung in URL-Parameter (url.com?key=value&key2=value2)
    return fetch(url + "?" + query.toString(), {                // Die in Zeile 2 deklarierte URL wird um die Request ergänzt, indem das obige Objekt um die Queries ergänzt wird (in Stringform)
        method: "GET"
    }).then(response => response.json()).catch(console.error);          // Jeder auftretende Fehler wird in die Konsole weitergeleitet
}


