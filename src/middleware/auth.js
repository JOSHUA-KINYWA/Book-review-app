import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';

export const createToken = (user) =>
  jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

export const getUserFromRequest = (req) => {
  if (req.session?.user) {
    return req.session.user;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  const [, token] = authHeader.split(' ');
  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { username: payload.username };
  } catch {
    return null;
  }
};

export const requireAuth = (req, res, next) => {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  req.user = user;
  return next();
};

