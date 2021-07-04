import * as Http from "http";               // HTTP-Modul, damit Server über HTTP Protokoll erreicht werden kann
import * as Url from "url";                 // URL-Modul, um query-String extrahieren und interpretieren zu können

export namespace serverModulprüfung {       // export vor Namecpace, aufgrund Typescript Interpretation und um Erzeugung einer fehlerhaften js-Datei zu verhinden

    interface User {            // Interface für User mit Nutzernamen, Passwort und Favoritenliste
        username: string;
        password: string;
    }

    interface ServerMeldung {   // Interface für Server Meldung
        error: string;          // Error Message, wenn Username vorhanden
        message: string;        // Nachricht, wenn User erfolgreich angelegt wurde
    }

    let userData: Mongo.Collection;         // MongoDB-Datenbank mit allen Nutzerdaten
    let recipeData: Mongo.Collection;       // MongoDB-Datenbank mit allen Rezeptdaten


    let port: number = Number(process.env.PORT);    // Erstellen der Port-Adresse, Process-Objekt liefert Port. Kann aber auch string oder undefined sein, daher auf number casten
    if (!port) port = 8100;                         // Falls port keinen Wert hat, wird ihm 8100 zugewiesen.
}
