import { Event} from 'src/app/demo/api/event.model';
export interface Categorieevent {
    idCateg: number;
    nomCateg: string;
    descriptionCateg: string;
    events?: Event[]; 
}
