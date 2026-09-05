import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

const angularAppEngine = new AngularAppEngine();

export async function handler(request: Request): Promise<Response> {
  const result = await angularAppEngine.handle(request);
  return result || new Response('Not found', { status: 404 });
}

export const reqHandler = createRequestHandler(handler);
