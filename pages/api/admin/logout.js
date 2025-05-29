// pages/api/admin/logout.js
export default function handler(req, res) {
  res.setHeader('Set-Cookie', `admin-auth=; Path=/; Max-Age=0`);
  return res.status(200).json({ message: 'ログアウトしました' });
}