import { Avis } from "./avis.model";
import { Categorieevent } from "./categorieevent.model";
import { ClientUser } from "./client-user.model";

export interface Event {
    idEvent: number;
    titreEvent: string;
    descriptionEvent: string;
    dateDebut: Date;
    dateFin: Date;
    adresse: string;
    ville: string;
    capaciteMax: number;
    averageRating:number;
    placesRestantes: number;
    status: string;
    avis?: Avis[]; 
    categevent?: Categorieevent;
    clientUsers?: ClientUser[];  
    archived: boolean;
}
