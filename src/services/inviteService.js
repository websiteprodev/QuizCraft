
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/configs/firebase';
import { sendEmail } from '@/utils/emailService'; 

export const sendInvitation = async (quizId) => {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const emails = usersSnapshot.docs.map(doc => doc.data().email);

        const promises = emails.map(email =>
            sendEmail({
                to: email,
                subject: `Invitation to take quiz ${quizId}`,
                body: `You have been invited to take a quiz. Click here to start: /quiz/${quizId}`,
            })
        );

        await Promise.all(promises);
    } catch (error) {
        console.error('Error sending invitations:', error);
        throw error;
    }
};
