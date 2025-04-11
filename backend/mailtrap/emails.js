import { mailtrapClient, sender } from "./mailtrap.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE
 } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationCode) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode),
            category: "Email Verification",
        });

        console.log("Email sent successfully", response);

        return response;
    } catch (error) {
        console.error(`Error sending verification email: email:${error}`);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};

export const sendWelcomeEmail = async (email, name, next) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "76d83b51-6cff-4af0-b6e6-8121ffbbe537",
            template_variables: {
                company_info_name: "Y-Tech",
                name: name,
            },
        });

        console.log("Email sent successfully", response);
        return response;
    } catch (error) {
        console.error(`Error sending verification email: email:${error}`);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};



export const sendPasswordResetEmail = async (email, resetURL) => {

    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset",
            html:  PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        })
    } catch (error) {
        console.error(`Error sending verification email: email:${error}`);
        throw new Error(`Error sending reset email: ${error.message}`);
    }
}


export const sendResetSuccessEmail = async(email) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Success",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        })

        console.log("Password reset email sent successfully", response);
    } catch (error) {
        console.error( `Error sending password reset email: email:${error}`);

        throw new Error (`Error sending password reset email: ${error.message}`);
    }
}