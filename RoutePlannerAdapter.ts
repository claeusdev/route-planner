import axios from "axios";
import { Address, RouteDetails } from "./server";
import { IDUServiceRoutePlanner } from "./interfaces";
import { formatAsAddress } from "./utils";
import 'dotenv/config'

// Adapter class for a route planning service
export default class RoutePlannerAdapter implements IDUServiceRoutePlanner {
    async requestRouteAndEstimates(startLocation: Address, targetLocation: Address, transportMeans: string): Promise<RouteDetails> {
        const apiKey = process.env.ENV_MAP_KEYS;
        const origin = formatAsAddress(startLocation);
        const destination = formatAsAddress(targetLocation);
        const mode = transportMeans; // Google Maps API expects 'driving', 'walking', 'bicycling', or 'transit'

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            const result = response.data.routes[0].legs[0]; // Assuming the first route and its first leg is what we're interested in
            return {
                estimatedTime: result.duration.text,
                distance: result.distance.text,
            };
        } catch (error) {
            console.error('Error fetching route details from Google Maps:', error);
            throw new Error('Failed to fetch route details from Google Maps.');
        }
    }
}