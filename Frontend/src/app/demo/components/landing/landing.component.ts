import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Event } from 'src/app/demo/api/event.model';
import { Event2Service } from '../../service/event2.service';
import { ClientUserService } from '../../service/client-user.service';
import { AvisService } from '../../service/avis.service';
import { Avis } from 'src/app/demo/api/avis.model';
import { CategorieeventService } from '../../service/categorieevent.service';
import { Categorieevent } from '../../api/categorieevent.model';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
    events: Event[] = [];
    categories: Categorieevent[] = [];
    isLoggedIn: boolean = false;
    nomUser: string = '';
    prenomUser: string = '';
    dropdownOpen: boolean = false;
    participatedEventIds: number[] = [];
    userAvis: { [eventId: number]: Avis } = {}; // Store user's reviews by event ID
    currentAvis: Avis = { idAvis: 0, noteAvis: 0, commentaire: '', dateAvis: new Date() };
    reviewDialogVisible: boolean = false;
    currentEventId: number | null = null;
    selectedCategory: string | null = null;
    startDate: string | null = null;
    endDate: string | null = null;
    categoryOptions: { label: string, value: string }[] = [];
    sortOptions = [
        { label: 'Rating', value: 'rating' },
        { label: 'Start Date', value: 'startDate' },
        { label: 'End Date', value: 'endDate' },
        { label: 'Places Remaining', value: 'placesRestantes' }
    ];
    selectedSortOption: string = '';
    filteredEvents: Event[] = [];
    constructor(
        public layoutService: LayoutService,
        private categoryService: CategorieeventService,
        public router: Router,
        private eventService: Event2Service,
        private userService: ClientUserService,
        private avisService: AvisService
    ) {}
    
    ngOnInit(): void {
        this.checkLoginStatus();
        this.loadEvents();
        this.loadCategories();
    }
    sortEvents() {
        const sortKey = this.selectedSortOption;
        if (sortKey === 'rating') {
            this.filteredEvents.sort((a, b) => b.averageRating - a.averageRating);
        } else if (sortKey === 'startDate') {
            this.filteredEvents.sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime());
        } else if (sortKey === 'endDate') {
            this.filteredEvents.sort((a, b) => new Date(a.dateFin).getTime() - new Date(b.dateFin).getTime());
        } else if (sortKey === 'placesRestantes') {
            this.filteredEvents.sort((a, b) => b.placesRestantes - a.placesRestantes);
        }
    }

    filterEvents() {
        this.filteredEvents = this.events.filter(event => {
            const isCategoryMatch = this.selectedCategory === null || event.categevent?.nomCateg === this.selectedCategory;
            const isStartDateMatch = !this.startDate || new Date(event.dateDebut) >= new Date(this.startDate);
            const isEndDateMatch = !this.endDate || new Date(event.dateFin) <= new Date(this.endDate);
            return isCategoryMatch && isStartDateMatch && isEndDateMatch;
        });
        this.sortEvents();
    }
    
    checkLoginStatus(): void {
        const userId = localStorage.getItem('userId');
        
        if (userId) {
            this.isLoggedIn = true;
            this.userService.retrieveUser(Number(userId)).subscribe(
                user => {
                    this.nomUser = user.nomUser;
                    this.prenomUser = user.prenomUser;
                    this.loadUserParticipations(Number(userId));
                },
                error => console.error('Failed to retrieve user data', error)
            );
        } else {
            this.isLoggedIn = false;
        }
    }

    loadUserParticipations(userId: number): void {
        this.userService.getUserParticipations(userId).subscribe(
            (participations: Event[]) => {
                this.participatedEventIds = participations.map(event => event.idEvent);
                participations.forEach(event => this.loadUserAvis(event.idEvent)); // Load avis for each participated event
            },
            error => console.error('Failed to retrieve participations', error)
        );
    }

    loadUserAvis(eventId: number): void {
        this.avisService.retrieveAvisByEvent(eventId).subscribe(
            (avisList: Avis[]) => {
                const userId = Number(localStorage.getItem('userId'));
                const userAvis = avisList.find(avis => avis.clientUser?.idUser === userId);
                if (userAvis) {
                    this.userAvis[eventId] = userAvis;
                }
            },
            error => console.error('Failed to retrieve avis', error)
        );
    }


    navigateToLogin(): void {
        this.router.navigate(['/auth/login']);
    }

    toggleDropdown(): void {
        this.dropdownOpen = !this.dropdownOpen;
    }
    loadCategories(): void {
        this.categoryService.retrieveAllCategorieevent().subscribe(
            (data: Categorieevent[]) => {
                this.categories = data;
                this.categoryOptions = [{ label: 'All Categories', value: null }, ...data.map(category => ({ label: category.nomCateg, value: category.nomCateg }))];
            },
            error => console.error('Failed to load categories', error)
        );
    }
    
    logout(): void {
        localStorage.clear();
        this.isLoggedIn = false;
        this.router.navigate(['/auth/login']);
    }

    loadEvents() {
        this.eventService.retrieveAllEvent().subscribe(data => {
            this.events = data.map(event => ({
                ...event,
                averageRating: this.calculateAverageRating(event.avis)
            }));
            this.filteredEvents = [...this.events];
        });
    }
    

    participate(eventId: number) {
        const userId = localStorage.getItem('userId');
        
        if (userId) {
            this.userService.participerEvent(eventId).subscribe(
                response => {
                    console.log(response)
                    alert('Successfully registered for the event!');
                    this.participatedEventIds.push(eventId);
    
                    // Find the event and decrement placesRestantes locally
                    const event = this.events.find(e => e.idEvent === eventId);
                    if (event && event.placesRestantes > 0) {
                        event.placesRestantes--;
    
                        // If placesRestantes is now zero, update the status to FULL
                        if (event.placesRestantes === 0) {
                            event.status = 'FULL';
                        }
    
                        // Update the event in the database
                        this.loadUserParticipations(Number(userId));
                    }

                    // Load user avis for the event
                    this.loadUserAvis(eventId);
                    this.loadEvents();
                },
                error => {
                    console.error('Failed to participate', error);
                }
            );
        } else {
            this.router.navigate(['/auth/login']);
        }
    }

    calculateAverageRating(avis: Avis[]): number {
        if (!avis || avis.length === 0) {
            return 0;
        }
        const totalRating = avis.reduce((sum, current) => sum + current.noteAvis, 0);

        return totalRating / avis.length;
    }

    hasParticipated(eventId: number): boolean {
        return this.participatedEventIds.includes(eventId);
    }

    // Check if the user has reviewed this event
    hasReviewed(eventId: number): boolean {
        return !!this.userAvis[eventId];
    }
    openReviewDialog(eventId: number): void {
        this.currentEventId = eventId;
        this.currentAvis = this.userAvis[eventId] || { idAvis: 0, noteAvis: 0, commentaire: '', dateAvis: new Date() };
        this.reviewDialogVisible = true;
    }

    closeReviewDialog(): void {
        this.reviewDialogVisible = false;
        this.currentEventId = null;
    }
    // Add or update review for an event
    saveReview(): void {
        if (this.currentEventId !== null) {
            const userId = Number(localStorage.getItem('userId'));
    
            // Retrieve the full user details from the backend
            this.userService.retrieveUser(userId).subscribe(
                (user) => {
                    // Find the full event object from the events list
                    const fullEvent = this.events.find(e => e.idEvent === this.currentEventId);
                    
                    if (!fullEvent) {
                        console.error('Event not found');
                        return;
                    }
        
                    // Construct the avisToSave object with the full event and user details
                    const avisToSave: Avis = { 
                        ...this.currentAvis, 
                        event: fullEvent, 
                        clientUser: user // Use the full user object retrieved from the backend
                    };
        
                    const saveObservable = this.userAvis[this.currentEventId]
                        ? this.avisService.updateAvis(avisToSave)
                        : this.avisService.affecterAvisAEvent(userId, this.currentEventId, avisToSave.commentaire, avisToSave.noteAvis);
        
                    saveObservable.subscribe(
                        (savedAvis) => {
                            this.userAvis[this.currentEventId!] = savedAvis;
                            this.reviewDialogVisible = false;
                            //alert('Review saved successfully!');
                        },
                        error => console.error('Failed to save review', error)
                    );
                },
                error => console.error('Failed to retrieve user details', error)
            );
        }
    }
    
    
    // Delete review for an event
    deleteReview(eventId: number): void {
        const avis = this.userAvis[eventId];
        if (avis) {
            this.avisService.removeAvis(avis.idAvis).subscribe(
                () => {
                    delete this.userAvis[eventId];
                    alert('Review deleted successfully!');
                },
                error => console.error('Failed to delete review', error)
            );
        }
    }
    
}
