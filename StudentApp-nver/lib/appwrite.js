import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

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

export { database, account, avatar };

// Fetch announcements from the Appwrite database
export const fetchAnnouncements = async () => {
  try {
    const response = await database.listDocuments('christDatabase', 'announcements');
    return response.documents;
  } catch (error) {
    throw new Error('Failed to fetch announcements: ' + error.message);
  }
};

// Sign-in function
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Forgot password handler
export const handleForgotPassword = async (email) => {
  try {
    const response = await account.createRecovery(
      email, 
      'http://localhost/reset-password' 
    );
    console.log(response);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
};

// Logout function
export const logOut = async () => {
  try {
    await account.deleteSession('current'); // Ends the current session
    return { success: true };
  } catch (error) {
    throw new Error('Failed to log out: ' + error.message);
  }
};
