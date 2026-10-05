import {clearCookie} from '@/lib/auth';

function leave(req: Request) {
  const url = new URL(req.url);
  return new Response(null, {status: 303, headers: {location: '/', 'set-cookie': clearCookie(url.protocol === 'https:'), 'cache-control': 'no-store'}});
}
export const GET = leave;
export const POST = leave;
