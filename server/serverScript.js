"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverModulprüfung = void 0;
const Http = require("http"); // HTTP-Modul, damit Server über HTTP Protokoll erreicht werden kann
const Mongo = require("mongodb"); // MongoDB importieren, um Datenbankoperationen innerhalb der Node-Umgebung auszuführen
var serverModulprüfung;
(function (serverModulprüfung) {
    let userData; // MongoDB-Datenbank mit allen Nutzerdaten
    let recipeData; // MongoDB-Datenbank mit allen Rezeptdaten
    let port = Number(process.env.PORT); // Erstellen der Port-Adresse, Process-Objekt liefert Port. Kann aber auch string oder undefined sein, daher auf number casten
    if (!port)
        port = 8100; // Falls port keinen Wert hat, wird ihm 8100 zugewiesen
    const isLocal = false; // Bei Upload in Cloud Wert als false setzen!
    const databaseURL = isLocal ? "mongodb://localhost:27017" : "mongodb+srv://MoriphoADMIN:<9u44YeFMCJuX6ysf>@gissose2021.ddtxe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    startServer(port);
    function startServer(_port) {
        let server = Http.createServer(); // Erstellen eines HTTP-Servers
        console.log("Server starting on port " + _port); // Konsolenausgabe, die Port des Servers ausgibt
        server.listen(_port); // Portöffnung, durch listen-Funktion mit Referenz zu oben definiertem Port
        server.addListener("request", handleRequest); // Um Anfragen (requests) von Nutzern auf einem Server verarbeiten zu können, wird dieser Listener verwendet. Der Listener ruft für jede eingehende Nutzeranfrage bzw. request die handleRequest-Funktion auf
        server.addListener("listening", () => console.log("Listening")); // Listener, der auf bestimmte Events (z. B. Klickevent) hört
    }
    async function connectToUserDb(_url) {
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect(); // await da auf Promise gewartete wird
        userData = mongoClient.db("userData").collection("Users");
        console.log("Database connection:", userData != undefined); // Hat userData Definition -> true, sonst false als Indikator
    }
    async function connectToRecipeDb(_url) {
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect(); // await da auf Promise gewartete wird
        recipeData = mongoClient.db("userData").collection("Recipes");
        console.log("Database connection:", recipeData != undefined); // Hat recipeData Definition -> true, sonst false als Indikator
    }
    async function handleRequest(_request, _response) {
        // LAUT VORLESUNGSMATERIALIEN:
        // handleRequest erwartet normalerweise zwei Parameter, ersteres vom Typ IncomingMessage, letzteres vom Typ ServerResponse (beide aus http-Modul)
        // IncomingMessage liefert Infos zum eingegangenen Request-Objekt (z. B. URL als String)
        // ServerResponse ist ein Objekt, welches Infos für die Serverantowrt sammelt. Die Info wird unterteilt in Header (Infos zur eigentlichen Nachricht) und Body (die Nachricht selbst)
        _response.setHeader("content-type", "text/html; charset=utf-8"); // über setHeader-Funktion wird Header-Information integriert. Header gibt an, dass die Serverantwort ein mit utf-8 kodierter Text ist.
        _response.setHeader("Access-Control-Allow-Origin", "*"); // jeder darf Nachricht öffnen, Asterisk "*" = alles
        if (_request.url) { // if-Bedingung für den Fall einer eingehenden Request
            console.log("Received parameters"); // Bestätigung, dass Request stattgefunden hast
            const url = new URLSearchParams(_request.url.replace("/?", "")); // URL in Zeichenkette umwandeln, um daraus Requesttyp zu bekommen
            let response;
            switch (url.get("requestType")) {
                case "register":
                    response = await register(url);
                    break;
                case "login":
                    response = await login(url);
                    break;
                case "getRecipes":
                    response = await getRecipes();
                    break;
                default:
                    response = JSON.stringify({
                        error: true,
                        message: "Error: Unknown request type"
                    });
            }
            _response.write(response);
        }
        _response.end(); // markiert Ende der Serverantwort
    }
    async function register(url) {
        const usernameExists = (await userData.findOne({ uname: url.get("uname") })) !== null;
        if (!usernameExists) {
            userData.insertOne({
                uname: url.get("uname"),
                password: url.get("password")
            });
            console.log(`Saved user ${url.get("fname")} to database`); // Servernachricht, dass der Nutzer angelegt wurde.
        }
        return JSON.stringify({
            error: usernameExists,
            message: usernameExists ? "User existiert bereits!" : "Konto erstellt"
        });
    }
    async function login(url) {
        const uname = url.get("uname");
        const password = url.get("password");
        const loginSuccess = (await userData.findOne({ uname: uname, password: password })) !== null;
        return JSON.stringify({
            error: !loginSuccess,
            message: loginSuccess ? "Login successful" : "Login failed"
        });
    }
    function createRecipe() {
        // check if recipe+username exists
    }
})(serverModulprüfung = exports.serverModulprüfung || (exports.serverModulprüfung = {}));
//# sourceMappingURL=serverScript.js.map