import { Avis } from "./avis.model";

export interface ClientUser {
    idUser: number;
    nomUser: string;
    prenomUser: string;
    emailUser: string;
    passwordUser: string;
    roleUser: string;
    dateNaissance: Date;
    avis?: Avis[];  
    events?: Event[];  
}
