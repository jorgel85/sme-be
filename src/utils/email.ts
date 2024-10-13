import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-ses";

const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const senderEmail = process.env.SENDER_EMAIL_ADDRESS;

if (!secretAccessKey || !accessKeyId || !senderEmail) {
  throw new Error(
    "Environment variables AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, and SENDER_EMAIL_ADDRESS must be set."
  );
}

const sesClient = new SESClient({
  credentials: {
    secretAccessKey,
    accessKeyId,
  },
  region: "us-west-2",
});

export const sendEmail = async (
  to: string,
  subject: string,
  html?: string,
  text?: string
): Promise<void> => {
  try {
    const params: SendEmailCommandInput = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: html,
          },
          Text: {
            Charset: "UTF-8",
            Data: text,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: senderEmail,
    };

    const command = new SendEmailCommand(params);
    await sesClient.send(command);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
