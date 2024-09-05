
export const sendEmail = async ({ to, subject, body }) => {
    try {
        // Тук може да използвате външна услуга като SendGrid или собствен сървър за изпращане на имейли
        console.log(`Sending email to ${to} with subject "${subject}" and body "${body}"`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
