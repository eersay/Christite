import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

// Destructure the configuration values from appwriteConfig
const { endpoint, projectID, platform } = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.christite.studentapp',
  projectID: 'christiteproject',
  christiteappBucketID: 'christiteappBucket',
  databaseID: 'christDatabase',
  studentCollectionID: 'students',
  announcementsCollectionID: 'announcements'
};

const client = new Client();
client
    .setEndpoint(endpoint) // Your Appwrite Endpoint
    .setProject(projectID) // Your project ID
    .setPlatform(platform); // Your application ID or bundle ID

const database = new Databases(client);
const avatar = new Avatars(client);
const account = new Account(client);

export async function signIn(email, password) {
    try {
        // Optionally check for existing session
        // (This would require additional code to implement in Appwrite SDK)
        
        // Attempt to create a new session
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
            throw new Error(error.message);
        }
    }

    export const handleForgotPassword = async (email) => {
        try {
          const response = await account.createRecovery(
            email, 
            'http://localhost/reset-password' // Change this to an allowed host like localhost or cloud.appwrite.io
          );
          console.log(response);  // Successful response from Appwrite
          return { success: true };
        } catch (error) {
          console.error(error);
          return { success: false, error: error.message };
        }
      };