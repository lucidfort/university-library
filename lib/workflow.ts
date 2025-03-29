import { Client as WorkflowClient } from "@upstash/workflow";
import emailjs from "@emailjs/browser";
import config from "./config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

// export const sendEmail = async ({
//   email,
//   subject,
//   message,
// }: {
//   email: string;
//   subject: string;
//   message: string;
// }) => {
//   emailjs
//     .send(
//       "service_w1zq7xd",
//       "template_0ldf3x5",
//       {
//         email,
//         subject,
//         message,
//       },
//       {
//         publicKey: config.env.emailjs.publicKey,
//         blockHeadless: true,
//         limitRate: {
//           id: "app",
//           throttle: 10000,
//         },
//       },
//     )
//     .then(
//       (response) => {
//         console.log("SUCCESS!", response.status, response.text);
//       },
//       (error) => {
//         console.log("FAILED...", error);
//       },
//     );
// };

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  console.log("Send Email launched");
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: config.env.emailjs.serviceId,
      template_id: config.env.emailjs.templateId,
      user_id: config.env.emailjs.publicKey,
      template_params: {
        email: email,
        subject: subject,
        message: message,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return { statusCode: 500, error: data };
  }

  return { statusCode: 200, data: JSON.stringify(data) };
};
