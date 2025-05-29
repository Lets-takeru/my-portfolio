import { IronSessionOptions } from 'iron-session';

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// ヘルパー
export function withSession(handler) {
  const { withIronSessionApiRoute } = require('iron-session/next');
  return withIronSessionApiRoute(handler, sessionOptions);
}