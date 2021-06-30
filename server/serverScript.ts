import * as Http from "http";
import * as Url from "url";

export namespace serverModulprüfung {
    interface User {
        uname: string;
        password: string;
    }

    interface ServerMeldung {
        error: string;          // Error Message, wenn Username vorhanden
        message: string;        // Nachricht, wenn User erfolgreich angelegt wurde
    }

    interface Recipe {
        username: string;
        title: string;
        ingredients: string[];
        preparation: string;
    }

    let recipeData: Mongo.Collection;

    let port: number = Number(process.env.PORT);    // Erstellen der Port-Adresse, Process-Objekt liefert Port. Kann aber auch string oder undefined sein, daher auf number casten
    if (!port) port = 8100;                         // Falls port keinen Wert hat, wird ihm 8100 zugewiesen.
}
