import serverless from "serverless-http";
import { app } from "../../server";

// Wrap our Express app inside serverless-http to run as a Netlify Serverless Function
export const handler = serverless(app);
