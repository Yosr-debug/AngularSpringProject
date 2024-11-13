import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Categorieevent } from 'src/app/demo/api/categorieevent.model';
import { CategorieeventService } from 'src/app/demo/service/categorieevent.service';
import { Event2Service } from 'src/app/demo/service/event2.service';
import { Event as EventModel } from 'src/app/demo/api/event.model';
import { Avis } from 'src/app/demo/api/avis.model';
import { AvisService } from 'src/app/demo/service/avis.service';
@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {
    eventDialog: boolean = false;
    categoryDialog: boolean = false;
    avisDialog: boolean = false;
    deleteDialog: boolean = false;
    deleteSelectedDialog: boolean = false;

    events: EventModel[] = [];
    categories: Categorieevent[] = [];
    avisList: Avis[] = [];

    selectedEvents: EventModel[] = [];
    selectedCategories: Categorieevent[] = [];

    event: Partial<EventModel> = {};
    category: Partial<Categorieevent> = {};
    selectedCategoryId: number | null = null;

    cols: any[] = [];
    eventCols: any[] = [];
    categoryCols: any[] = [];
    submitted: boolean = false;
    entityType: 'event' | 'category' = 'event';  // Track which entity is being managed

    constructor(
        private eventService: Event2Service,
        private categoryService: CategorieeventService,
        private avisService: AvisService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadEntities();
        this.loadCategories();
        this.eventCols = [
            { field: 'titreEvent', header: 'Title' },
            { field: 'descriptionEvent', header: 'Description' },
            { field: 'dateDebut', header: 'Start Date' },
            { field: 'dateFin', header: 'End Date' },
            { field: 'adresse', header: 'Address' },
            { field: 'ville', header: 'City' },
            { field: 'capaciteMax', header: 'Max Capacity' },
            { field: 'placesRestantes', header: 'Remaining Places' },
            { field: 'archived', header: 'Archived' },
            { field: 'categorieevent', header: 'Category' },
        ];
    
        this.categoryCols = [
            { field: 'nomCateg', header: 'Category Name' },
            { field: 'descriptionCateg', header: 'Description' },
        ];
        this.updateColumns();
    }
    loadCategories() {
        this.categoryService.retrieveAllCategorieevent().subscribe(categories => {
          this.categories = categories;
        });
    }
    loadEntities() {
        if (this.entityType === 'event') {
            this.eventService.retrieveAllEvent().subscribe(data => this.events = data);
        } else {
            this.categoryService.retrieveAllCategorieevent().subscribe(data => this.categories = data);
        }
    }

    switchEntity(entity: 'event' | 'category') {
        this.entityType = entity;
        this.updateColumns();
        this.loadEntities();
    }
    updateColumns() {
        this.cols = this.entityType === 'event' ? this.eventCols : this.categoryCols;
    }

    openNew() {
        this.submitted = false;
        if (this.entityType === 'event') {
            this.event = {};
            
            this.selectedCategoryId = null;
            this.eventDialog = true;
        } else {
            this.category = {};
            this.categoryDialog = true;
        }
    }

    deleteSelected() {
        this.deleteSelectedDialog = true;
    }

    editEntity(entity: EventModel | Categorieevent) {
        this.submitted = false;
        if (this.entityType === 'event') {
            this.event = { ...entity as EventModel };
            this.eventDialog = true;
        } else {
            this.category = { ...entity as Categorieevent };
            this.categoryDialog = true;
        }
    }

    deleteEntity(entity: EventModel | Categorieevent) {
        this.submitted = false;
        if (this.entityType === 'event') {
            this.event = { ...entity as EventModel };
        } else {
            this.category = { ...entity as Categorieevent };
        }
        this.deleteDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteSelectedDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Selected Records Deleted', life: 3000 });
        this.selectedEvents = [];
        this.selectedCategories = [];
        this.loadEntities();
    }

    confirmDelete() {
        if (this.entityType === 'event') {
            this.eventService.removeEvent(this.event.idEvent as number).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Event Deleted', life: 3000 });
                this.loadEntities();
            });
        } else {
            this.categoryService.removeCategorieevent(this.category.idCateg!).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category Deleted', life: 3000 });
                this.loadEntities();
            });
        }
        this.deleteDialog = false;
    }

    saveEntity() {
        this.submitted = true;
        if (this.entityType === 'event') {
            if (this.event.idEvent) {
                this.eventService.updateEvent(this.event as EventModel).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Event Updated', life: 3000 });
                    this.loadEntities();
                });
            } else {
                this.event.placesRestantes=this.event.capaciteMax;
                this.eventService.addEventWithCategory(this.event as EventModel, this.selectedCategoryId).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Event Created', life: 3000 });
                    this.loadEntities();
                });
            }
            this.eventDialog = false;
        } else {
            if (this.category.idCateg) {
                this.categoryService.updateCategorieevent(this.category as Categorieevent).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category Updated', life: 3000 });
                    this.loadEntities();
                });
            } else {
                this.categoryService.addCategorieevent(this.category as Categorieevent).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Category Created', life: 3000 });
                    this.loadEntities();
                });
            }
            this.categoryDialog = false;
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    get selectedEntities() {
        return this.entityType === 'event' ? this.selectedEvents : this.selectedCategories;
    }
    set selectedEntities(value: EventModel[] | Categorieevent[]) {
        if (this.entityType === 'event') {
            this.selectedEvents = value as EventModel[];
        } else {
            this.selectedCategories = value as Categorieevent[];
        }
    }
    
    
    hideDialog() {
        this.eventDialog = false;
        this.categoryDialog = false;
        this.submitted = false;
    }
    viewAvis(event: EventModel) {
        this.avisService.retrieveAvisByEvent(event.idEvent!).subscribe(avisList => {
            this.avisList = avisList;
            this.avisDialog = true;
        });
    }
}
