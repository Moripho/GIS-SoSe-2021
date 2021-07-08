import * as Http from "http";               // HTTP-Modul, damit Server über HTTP Protokoll erreicht werden kann
import * as Url from "url";                 // URL-Modul, um query-String extrahieren und interpretieren zu können
import * as Mongo from "mongodb";           // MongoDB importieren, um Datenbankoperationen innerhalb der Node-Umgebung auszuführen


export namespace serverModulprüfung {       // export vor Namecpace, aufgrund Typescript Interpretation und um Erzeugung einer fehlerhaften js-Datei zu verhinden

    interface User {            // Interface für User mit Nutzernamen, Passwort und Favoritenliste
        username: string;
        password: string;
        favorites: string[];
    }

    interface Recipe {          // Interface für Rezepte mit Ersteller des Rezepts, Titel, Zutaten und Zubereitungsanweisung
        username: string;
        title: string;
        ingredients: string[];
        preparation: string;
    }

    interface ServerMeldung {   // Interface für Server Meldung
        error: string;          // Error Message, wenn Username vorhanden
        message: string;        // Nachricht, wenn User erfolgreich angelegt wurde
    }

    let userData: Mongo.Collection;         // MongoDB-Datenbank mit allen Nutzerdaten
    let recipeData: Mongo.Collection;       // MongoDB-Datenbank mit allen Rezeptdaten


    let port: number = Number(process.env.PORT);    // Erstellen der Port-Adresse, Process-Objekt liefert Port. Kann aber auch string oder undefined sein, daher auf number casten
    if (!port) port = 8100;                         // Falls port keinen Wert hat, wird ihm 8100 zugewiesen

    const isLocal: boolean = false;                 // Bei Upload in Cloud Wert als false setzen!
    const databaseURL: string = isLocal ? "mongodb://localhost:27017" : "mongodb+srv://MoriphoADMIN:<9u44YeFMCJuX6ysf>@gissose2021.ddtxe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    startServer(port);

    function startServer(_port: number): void {             // Funktion, um Server auf einem übergebenen Port zu starten
        let server: Http.Server = Http.createServer();      // Erstellen eines HTTP-Servers
        console.log("Server starting on port " + _port);    // Konsolenausgabe, die Port des Servers ausgibt
        server.listen(_port);                               // Portöffnung, durch listen-Funktion mit Referenz zu oben definiertem Port
        server.addListener("request", handleRequest);                       // Um Anfragen (requests) von Nutzern auf einem Server verarbeiten zu können, wird dieser Listener verwendet. Der Listener ruft für jede eingehende Nutzeranfrage bzw. request die handleRequest-Funktion auf
        server.addListener("listening", () => console.log("Listening"));    // Listener, der auf bestimmte Events (z. B. Klickevent) hört
    }

    async function connectToUserDb(_url: string): Promise<void> {
        let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();                                                // await da auf Promise gewartete wird
        userData = mongoClient.db("userData").collection("Users");
        console.log("Database connection:", userData != undefined);                 // Hat userData Definition -> true, sonst false als Indikator
    }

    async function connectToRecipeDb(_url: string): Promise<void> {
        let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();                                                // await da auf Promise gewartete wird
        recipeData = mongoClient.db("userData").collection("Recipes");
        console.log("Database connection:", recipeData != undefined);                 // Hat recipeData Definition -> true, sonst false als Indikator
    }

    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {  // Funktion, die die Serveranfragen durch Nutzer verarbeitet
        // LAUT VORLESUNGSMATERIALIEN:
        // handleRequest erwartet normalerweise zwei Parameter, ersteres vom Typ IncomingMessage, letzteres vom Typ ServerResponse (beide aus http-Modul)
        // IncomingMessage liefert Infos zum eingegangenen Request-Objekt (z. B. URL als String)
        // ServerResponse ist ein Objekt, welches Infos für die Serverantowrt sammelt. Die Info wird unterteilt in Header (Infos zur eigentlichen Nachricht) und Body (die Nachricht selbst)

        _response.setHeader("content-type", "text/html; charset=utf-8");         // über setHeader-Funktion wird Header-Information integriert. Header gibt an, dass die Serverantwort ein mit utf-8 kodierter Text ist.
        _response.setHeader("Access-Control-Allow-Origin", "*");                // jeder darf Nachricht öffnen, Asterisk "*" = alles

        if (_request.url) {                                                                 // if-Bedingung für den Fall einer eingehenden Request
            console.log("Received parameters");                                             // Bestätigung, dass Request stattgefunden hast
            const url: URLSearchParams = new URLSearchParams(_request.url.replace("/?", "")); // URL in Zeichenkette umwandeln, um daraus Requesttyp zu bekommen
            let response: string;
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
        _response.end();                // markiert Ende der Serverantwort
    }

    async function register(url: URLSearchParams): Promise<string> {
        const usernameExists: boolean = (await userData.findOne({ uname: url.get("uname") })) !== null;

        if (!usernameExists) {

            userData.insertOne({
                uname: url.get("uname"),
                password: url.get("password")
            });
            console.log(`Saved user ${url.get("fname")} to database`);    // Servernachricht, dass der Nutzer angelegt wurde.
        }

        return JSON.stringify({
            error: usernameExists,
            message: usernameExists ? "User existiert bereits!" : "Konto erstellt"
        });
    }

    async function login(url: URLSearchParams): Promise<string> {
        const uname: string = url.get("uname");
        const password: string = url.get("password");
        const loginSuccess: boolean = (await userData.findOne({ uname: uname, password: password })) !== null;
        return JSON.stringify({
            error: !loginSuccess,
            message: loginSuccess ? "Login successful" :  "Login failed"
        });
    }

    function createRecipe() {
        // check if recipe+username exists
    }
}
