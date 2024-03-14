import express, { Express, Request, Response } from 'express';
import RoutePlannerAdapter from './RoutePlannerAdapter';

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { DUService } from './services/DUService';
import { JobOffer } from './interfaces';

const app: Express = express();
const port = 8000;

const duService = new DUService();

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Route Planner API",
            description: "An API to plan routes using various transport means.",
            version: "1.0",

            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },

        },
        servers: [
            {
                url: "http://localhost:8000",
            },
        ],
    },
    apis: ["./server.ts"],
};

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);

app.use(express.json());

export interface Address {
    street: string;
    city: string;
    country: string;
}

export interface RouteDetails {
    estimatedTime: string;
    distance: string;
}

/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Job Offers and Routing API
 *   version: 1.0.0
 *   description: An API to authenticate users, request similar job offers, submit selected job offers, and calculate routes between locations.
 * servers:
 *   - url: 'http://localhost:3000'
 *     description: Development server
 * 
 * paths:
 *   /authenticateAndRequestSimilarOffers:
 *     post:
 *       summary: Authenticate user and request similar job offers.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - username
 *                 - password
 *                 - jobOffers
 *               properties:
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *                 jobOffers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobOffer'
 *       responses:
 *         '200':
 *           description: Successfully authenticated and returned similar offers.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/JobOffer'
 *         '401':
 *           description: Authentication failed.
 *         '400':
 *           description: Bad request (e.g., empty jobOffers array).
 * 
 *   /submitSelectedJob:
 *     post:
 *       summary: Submit a selected job offer.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - offerId
 *               properties:
 *                 offerId:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Job offer successfully marked as selected.
 *         '404':
 *           description: OfferId does not correspond to a valid job offer.
 *         '400':
 *           description: Bad request (e.g., invalid input data).
 * 
 *   /route:
 *     post:
 *       summary: Calculate route between two locations
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - startLocation
 *                 - targetLocation
 *                 - transportMeans
 *               properties:
 *                 startLocation:
 *                   $ref: '#/components/schemas/Address'
 *                 targetLocation:
 *                   $ref: '#/components/schemas/Address'
 *                 transportMeans:
 *                   type: string
 *                   enum: [driving, walking, bicycling, transit]
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/RouteDetails'
 *         '400':
 *           description: Invalid transport means specified
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         '500':
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 * 
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - street
 *         - city
 *         - country
 *       properties:
 *         street:
 *           type: string
 *         city:
 *           type: string
 *         country:
 *           type: string
 *     RouteDetails:
 *       type: object
 *       properties:
 *         estimatedTime:
 *           type: string
 *         distance:
 *           type: string
 *     JobOffer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         company:
 *           type: string
 *         location:
 *           type: string
 */


app.post('/route', async (req: Request, res: Response) => {
    const { startLocation, targetLocation, transportMeans } = req.body;

    // Validate transport means
    const validTransportMeans = ["driving", "walking", "bicycling", "transit"]; // Google Maps API expected values
    if (!validTransportMeans.includes(transportMeans)) {
        return res.status(400).send({ error: "Invalid transport means specified. Use 'driving', 'walking', 'bicycling', or 'transit'." });
    }

    const routerPlanner = new RoutePlannerAdapter();
    try {
        const routeDetails = await routerPlanner.requestRouteAndEstimates(startLocation, targetLocation, transportMeans);
        console.log({ routeDetails })
        res.json(routeDetails);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});


app.post('/authenticateAndRequestSimilarOffers', (req, res) => {
    const { username, password, jobOffers } = req.body;
    try {
        const similarOffers = duService.authenticateAndRequestSimilarOffers(username, password, jobOffers as JobOffer[]);
        res.json(similarOffers);
    } catch (error) {
        res.status(401).send(error);
    }
});

app.post('/submitSelectedJob', (req, res) => {
    const { offerId } = req.body;
    try {
        const success = duService.submitSelectedJob(offerId);
        if (success) {
            res.status(200).send({
                message: "Job offer successfully marked as selected"});
        } else {
            res.status(404).send({ error: "Job offer not found"});
        }
    } catch (error) {
        res.status(400).send({error});
    }
});

app.listen(port, () => {
    console.log(`Adapter running on port ${port}`);
});
