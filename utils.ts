import { Address } from "./server";

export const formatAsAddress = ({ street, city, country}: Address) => `${street}, ${city}, ${country}`
