// src/services/DUService.ts

import { IDUAppDUService, JobOffer } from "../interfaces";

const jobOffers = [
    {
        "id": "1",
        "title": "Software Developer",
        "description": "Develop cutting-edge web applications.",
        "location": "New York, NY",
        "salaryRange": {
            "min": 70000,
            "max": 100000
        }
    },
    {
        "id": "2",
        "title": "Data Scientist",
        "description": "Analyze data and provide insights.",
        "location": "San Francisco, CA",
        "salaryRange": {
            "min": 80000,
            "max": 120000
        }
    },
    {
        "id": "3",
        "title": "Product Manager",
        "description": "Lead product development teams.",
        "location": "Seattle, WA",
        "salaryRange": {
            "min": 90000,
            "max": 130000
        }
    }
]

interface DriverJobs {
    driver: JobOffer[];
}

export class DUService implements IDUAppDUService {
    availableJobs: JobOffer[] = []; 
    currentDriverJobs: JobOffer[] = [];
    authenticateAndRequestSimilarOffers(username: string, password: string, jobOffers: JobOffer[]): JobOffer[] {
        // Here, you would implement your authentication logic
        // This example simply returns the jobOffers array for demonstration
        if (username === "user" && password === "pass") { // Placeholder check
            return jobOffers;
        }

        if(jobOffers.length === 0){
            throw new Error("Job offers list empty");
        }

        throw new Error("Authentication failed");
    }

    submitSelectedJob(offerId: string): boolean {
        // Implement logic to mark a job as selected
        // This example always returns true for demonstration
        const driverJob = jobOffers.find(job => job.id === offerId);
        
        if(driverJob){
            if(!this.currentDriverJobs.find(job => job.id === driverJob.id)){
                this.currentDriverJobs.push(driverJob)
            }
            return true;
        }
            
        return false;
    }
}
