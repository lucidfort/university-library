import { Client as WorkflowClient } from "@upstash/workflow";
import emailjs from "@emailjs/browser";
import config from "./config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
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
  emailjs
    .send(
      "service_w1zq7xd",
      "template_0ldf3x5",
      {
        email,
        subject,
        message,
      },
      {
        publicKey: config.env.emailjs.publicKey,
        blockHeadless: true,
        limitRate: {
          id: "app",
          throttle: 10000,
        },
      },
    )
    .then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
      },
      (error) => {
        console.log("FAILED...", error);
      },
    );
};
