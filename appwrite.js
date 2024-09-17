// appwrite.js
import { Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject('christiteproject'); // Your project ID

const databases = new Databases(client);

export { databases };
