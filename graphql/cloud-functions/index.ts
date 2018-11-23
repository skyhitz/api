import { HttpsFunction } from './types';
import { Request, Response } from 'express';

export function onRequest(handler: (req: Request, resp: Response) => void): HttpsFunction {
  // lets us add __trigger without altering handler:
  let cloudFunction: any = (req: Request, res: Response) => { handler(req, res); };
  cloudFunction.__trigger = {httpsTrigger: {}};

  return cloudFunction;
}