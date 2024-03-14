// src/models/JobOffer.ts
export interface JobOffer {
    id: string;
    title: string;
    description: string;
    location: string;
    salaryRange: {
        min: number;
        max: number;
    };
}

// src/services/IDUAppDUService.ts
export interface IDUAppDUService {
    authenticateAndRequestSimilarOffers(username: string, password: string, jobOffers: JobOffer[]): JobOffer[];
    submitSelectedJob(offerId: string): boolean;
}
import { Address, RouteDetails } from "../server";

export interface IDUServiceRoutePlanner {
    requestRouteAndEstimates(startLocation: Address, targetLocation: Address, transportMeans: string): Promise<RouteDetails>;
}
