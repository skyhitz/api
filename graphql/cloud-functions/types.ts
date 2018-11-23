import { Request, Response } from 'express';

/** TriggerAnnotated is used internally by the firebase CLI to understand what type of Cloud Function to deploy. */
export interface TriggerAnnotated {
  __trigger: {
    httpsTrigger?: {},
    eventTrigger?: {
      eventType: string;
      resource: string;
    }
  };
}

/**
 * An HttpsFunction is both an object that exports its trigger definitions at __trigger and
 * can be called as a function that takes an express.js Request and Response object.
 */
export type HttpsFunction = TriggerAnnotated & ((req: Request, resp: Response) => void);