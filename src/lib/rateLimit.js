const rateLimitMap = new Map();

export function rateLimit(ip, { windowMs = 60000, max = 5 } = {}) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }

  record.count++;
  rateLimitMap.set(ip, record);

  return record.count > max;
}
