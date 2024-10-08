import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';
import { Query } from 'react-native-appwrite';
import { router } from 'expo-router';


export const config={
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.christite.studentapp',
  projectID: 'christiteproject',
  christiteappBucketID: 'christiteappBucket',
  databaseID: 'christDatabase',
  studentCollectionID: 'students',
  announcementsCollectionID: 'announcements',
  settingsCollectionID:'settings',
  subjectCollectionID:'subjects',
  attendanceCollectionID:'attendance',
  courseCollectionID:'courses'
};

const client = new Client();
client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectID) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID

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


export const getCurrentUser=async()=>{
  try{
    const currentAccount=await account.get();
    if(!currentAccount) throw Error;
    const currentUser=await database.listDocuments(
      config.databaseID,
      config.studentCollectionID,
      [Query.equal('registerNumber',currentAccount.$id)])

      if(!currentUser) throw Error;
      return currentUser.documents[0];
  }catch(error){
    console.log(error)
  }
}


// Query to get attendance for a student by subject
export const getAttendanceSummaryForSubject = async (registerNumber, subjectId) => {
  try {
    const attendanceRecords = await database.listDocuments(
      config.databaseID,
      config.attendanceCollectionID, // Ensure the attendance collection ID is used here
      [
        Query.equal('registerNumber', registerNumber),
        Query.equal('subject_id', subjectId)
      ]
    );

    let totalHoursConducted = 0;
    let hoursAttended = 0;
    let hoursAbsent = 0;

    // Loop through attendance records and calculate hours
    attendanceRecords.documents.forEach(record => {
      totalHoursConducted += record.hours_conducted;
      if (record.is_present) {
        hoursAttended += record.hours_conducted;
      } else {
        hoursAbsent += record.hours_conducted;
      }
    });

    const attendancePercentage = (hoursAttended / totalHoursConducted) * 100;

    return {
      totalHoursConducted,
      hoursAttended,
      hoursAbsent,
      attendancePercentage
    };
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    throw new Error('Failed to fetch attendance summary');
  }
};

// Query to get attendance distribution for all subjects for a student
export const getAttendanceDistributionForStudent = async (registerNumber) => {
  try {
    // Fetch list of subjects
    const subjects = await database.listDocuments(config.databaseID, config.subjectCollectionID); // Make sure this collection ID is correct

    const attendanceDistribution = [];

    // Loop through each subject and get attendance summary
    for (const subject of subjects.documents) {
      const attendanceSummary = await getAttendanceSummaryForSubject(registerNumber, subject.$id);
      attendanceDistribution.push({
        subject_name: subject.name,
        subject_id: subject.$id,
        ...attendanceSummary
      });
    }

    return attendanceDistribution;
  } catch (error) {
    console.error('Error fetching attendance distribution:', error);
    throw new Error('Failed to fetch attendance distribution');
  }
};

export const getCourseNameByCode = async (courseCode) => {
  try {
    // Make sure courseCode is available and valid
    if (!courseCode) {
      throw new Error('Invalid course code');
    }

    // Using Query.equal to find the document with the given courseCode
    const query = [Query.equal('course_id', courseCode)]; // Make sure 'courseCode' is a valid field in the collection
    const response = await database.listDocuments(
      config.databaseID, 
      config.courseCollectionID, 
      query
    );
    
    // Check if any documents were returned
    if (response.documents.length > 0) {
      // Assuming the document has a 'name' field representing the course name
      return response.documents[0].name;
    } else {
      // No document found with the given courseCode
      return null;
    }
  } catch (error) {
    // Handle any errors that occur during the query
    console.error('Error fetching course:', error);
    return null; // Return null in case of an error
  }
};

export const updatePhoneNumber = async (userId, newPhone) => {
  try {
    const updatedUser = await database.updateDocument(
      config.databaseID,      // Replace with your Appwrite Database ID
      config.studentCollectionID, // Replace with your Collection ID
      userId,             // The document (user) ID
      { phNo: newPhone }  // The new phone number field to update
    );
    return updatedUser;
  } catch (error) {
    console.error('Failed to update phone number:', error);
    throw error;
  }
};