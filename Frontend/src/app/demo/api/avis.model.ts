import { ClientUser } from "./client-user.model";
import { Event} from 'src/app/demo/api/event.model';
export interface Avis {
    idAvis: number;
    noteAvis: number;
    commentaire: string;
    dateAvis: Date;
    clientUser?: ClientUser;  
    event?: Event;  
}
