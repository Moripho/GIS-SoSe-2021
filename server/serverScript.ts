import * as Http from "http";               // HTTP-Modul, damit Server über HTTP Protokoll erreicht werden kann
import * as Url from "url";                 // URL-Modul, um query-String extrahieren und interpretieren zu können
import * as Mongo from "mongodb";           // MongoDB importieren, um Datenbankoperationen innerhalb der Node-Umgebung auszuführen


export namespace serverModulprüfung {       // export vor Namecpace, aufgrund Typescript Interpretation und um Erzeugung einer fehlerhaften js-Datei zu verhinden

    interface User {            // Interface für User mit Nutzernamen, Passwort und Favoritenliste
        username: string;
        password: string;
        favorites: Favorite[];
    }

    interface Favorite {            // Interface für Favoriten
        username: string;
        title: string;
    }

    interface Recipe {          // Interface für Rezepte mit Ersteller des Rezepts, Titel, Zutaten und Zubereitungsanweisung
        username: string;
        title: string;
        ingredients: string[];
        preparation: string;
    }

    interface ServerMeldung {   // Interface für Server Meldung
        error: boolean;         // Error Message, wenn Username vorhanden
        message: string;        // Nachricht, wenn User erfolgreich angelegt wurde
    }

    const databaseURL: string = "mongodb+srv://MoriphoADMIN:<9u44YeFMCJuX6ysf>@gissose2021.ddtxe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    let port: number = Number(process.env.PORT);    // Erstellen der Port-Adresse, Process-Objekt liefert Port. Kann aber auch string oder undefined sein, daher auf number casten
    if (!port) port = 8100;                         // Falls port keinen Wert hat, wird ihm 8100 zugewiesen

    let userCollection: Mongo.Collection;         // MongoDB-Collection mit allen Nutzerdaten
    let recipeCollection: Mongo.Collection;       // MongoDB-Collection mit allen Rezeptdaten

    startServer(port);
    connectToCollections();

    function startServer(_port: number): void {             // Funktion, um Server auf einem übergebenen Port zu starten
        let server: Http.Server = Http.createServer();      // Erstellen eines HTTP-Servers
        console.log("Server starting on port " + _port);    // Konsolenausgabe, die Port des Servers ausgibt
        server.listen(_port);                               // Portöffnung, durch listen-Funktion mit Referenz zu oben definiertem Port
        server.addListener("request", handleRequest);                       // Um Anfragen (requests) von Nutzern auf einem Server verarbeiten zu können, wird dieser Listener verwendet. Der Listener ruft für jede eingehende Nutzeranfrage bzw. request die handleRequest-Funktion auf
        server.addListener("listening", () => console.log("Listening"));    // Listener, der auf bestimmte Events (z. B. Klickevent) hört
    }

    async function connectToCollections(): Promise<void> {
        const options: Mongo.MongoClientOptions = {useNewUrlParser: true, useUnifiedTopology: true};
        const mongoClient: Mongo.MongoClient = new Mongo.MongoClient(databaseURL, options);
        await mongoClient.connect();                                                // await da auf Promise gewartete wird

        userCollection = mongoClient.db("userData").collection("Users");
        console.log("Database connection:", userCollection != undefined);                 // Hat userCollection Definition -> true, sonst false als Indikator

        recipeCollection = mongoClient.db("userData").collection("Recipes");
        console.log("Database connection:", recipeCollection != undefined);                 // Hat recipeCollection Definition -> true, sonst false als Indikator
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
            let response: ServerMeldung;
            switch (url.get("requestType")) {                                               // switch case, damit Server identifizieren kann, um welche Art von Request es sich handelt (also um welchen Fall) und was er aufgrund dessen tun soll
                case "register":
                    response = await register({
                        username: url.get("username"),
                        password: url.get("password"),
                        favorites: []
                    });
                    break;
                case "login":
                    response = await login(url.get("username"), url.get("password"));
                    break;
                case "getRecipes":
                    response = await getRecipes();
                    break;
                case "createRecipe":
                    response = await createRecipe({
                        username: url.get("username"),
                        title: url.get("title"),
                        ingredients: JSON.parse(url.get("ingredients")),
                        preparation: url.get("preparation")
                    });
                    break;
                case "deleteRecipe":
                    response = await deleteRecipe(url.get("username"), url.get("title"));
                    break;
                case "addToFavorites":
                    response = await addToFavorites(url.get("username"), {
                        title: url.get("favoriteTitle"),
                        username: url.get("favoriteUsername")
                    });
                    break;
                case "deleteFromFavorites":
                    response = await deleteFromFavorites(url.get("username"), {
                        title: url.get("favoriteTitle"),
                        username: url.get("favoriteUsername")
                    });
                    break;
                case "getFavorites":
                    response = await getFavorites(url.get("username"));
                    break;
                default:
                    response = {
                        error: true,
                        message: "Error: Unknown request type"
                    };
            }
            _response.write(JSON.stringify(response));          //Servermeldung wird in String konvertiert, um anschließend an Nutzer zurückgegeben werden zu können
        }
        _response.end();                // markiert Ende der Serverantwort
    }

    async function register(user: User): Promise<ServerMeldung> {
        const usernameExists: boolean = (await userCollection.findOne({username: user.username})) !== null;

        if (!usernameExists) {
            await userCollection.insertOne(user);
            console.log(`Saved user ${user.username} to database`);    // Konsolennachricht, dass der Nutzer angelegt wurde.
        }

        return {
            error: usernameExists,
            message: usernameExists ? "User existiert bereits!" : "Konto erstellt"
        };
    }

    async function login(username: string, password: string): Promise<ServerMeldung> {
        const loginSuccess: boolean = (await userCollection.findOne({username: username, password: password})) !== null;
        return {
            error: !loginSuccess,
            message: loginSuccess ? "Login erfolgreich" : "Login fehlgeschlagen!"
        };
    }

    async function createRecipe(recipe: Recipe): Promise<ServerMeldung> {       // Rezept wird übergeben und in der Rezeptedatenbank wird gecheckt, ob Rezept mit diesem Titel in Kombination mit Username existiert
        const recipeExists: boolean = (await recipeCollection.findOne({
            title: recipe.title,
            username: recipe.username
        })) !== null;

        if (!recipeExists) {
            await recipeCollection.insertOne(recipe);
            console.log(`Saved Recipe ${recipe.title} to database`); // Servernachricht, dass das Rezept angelegt und in Datenbank gespeichert wurde.
        }

        return {
            error: recipeExists,
            message: recipeExists ? "Rezept existiert bereits!" : "Rezept erstellt"
        };
    }

    async function getRecipes(): Promise<ServerMeldung> {
        const recipes: Promise<Recipe[]> = recipeCollection.find({}, {        // Hole mir alle Einträge aus meiner Datenbank, die Username, Titel, Zutaten und Zubereitsungsanweisung enthält (also Rezept ist)
            projection: {
                "_id": false,                       //Standarnmäßiger MongoDB-Parameter, der auf false gesetz werden muss, da dieser nicht im Rezept drin ist
                "username": true,
                "title": true,
                "ingredients": true,
                "preparation": true
            }
        }).toArray();                               //Packt alles in ein Array

        return {
            error: false,
            message: JSON.stringify(recipes)
        };
    }

    async function deleteRecipe(username: string, recipeTitle: string): Promise<ServerMeldung> {
        await recipeCollection.findOneAndDelete({username: username, recipteTitle: recipeTitle})

    ;
        return {
            error: false,
            message: "Rezept wurde gelöscht!"
        };
    }


    /* async function addToFavorites(username: string, favorite: Favorite): Promise<ServerMeldung> {


        return {
            error: false,
            message: ""
        };
    }

    async function deleteFromFavorites(username: string, favorite: Favorite): Promise<ServerMeldung> {


        return {
            error: false,
            message: ""
        };
    } */

    async function getFavorites(username: string): Promise<ServerMeldung> {
        const user: User = await userCollection.findOne({username: username});          // get User durch Usernamen
        const favorites: Favorite[] = user.favorites;                                       // Favorite[] von User bezogen
        const favoriteRecipes: Recipe[] = [];                                               // Recipe[], damit nicht nur Titel und Username des Erstellers angezeigt werden, sondern auhc Rest der Daten

        for (const favorite of favorites) {                                                 // für jeden favorite aus dem Favorite[] des Users
            favoriteRecipes.push(await recipeCollection.findOne({                       // wird das favoriteRecipes Recipe[] um das entsprechende Rezept (matching title und username) erweitert
                title: favorite.title,
                username: favorite.username
            }));
        }

        return {
            error: false,
            message: JSON.stringify(favoriteRecipes)
        };
    }
}
