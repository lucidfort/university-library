import { Client as WorkflowClient } from "@upstash/workflow";
import emailjs, { EmailJSResponseStatus } from "@emailjs/nodejs";
import config from "./config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

emailjs.init({
  publicKey: config.env.emailjs.publicKey,
  privateKey: config.env.emailjs.privateKey,
  limitRate: {
    throttle: 10000,
  },
});

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  try {
    await emailjs.send(
      config.env.emailjs.serviceId,
      config.env.emailjs.templateId,
      { email, subject, message },
    );
  } catch (err) {
    if (err instanceof EmailJSResponseStatus) {
      console.log("EMAILJS FAILED...", err);
      return;
    }

    console.log("ERROR", err);
  }
};
