require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');

const { fibonacci, primeFilter, lcm, hcf } = require('./math');
const { askSingleWord } = require('./ai');

const app = express();

const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL || 'your_chitkara_email@example.com';
const PORT = Number(process.env.PORT) || 3000;

const allowedKeys = new Set(['fibonacci', 'prime', 'lcm', 'hcf', 'AI']);

app.disable('x-powered-by');
app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      is_success: false,
      error: 'Too many requests. Please try again later.',
    },
  }),
);
app.use(express.json({ limit: '32kb' }));

app.get('/health', (_req, res) => {
  return res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL,
  });
});

const fibonacciSchema = z.number().int().min(0).max(100000);
const integerArraySchema = z.array(z.number().int().finite()).nonempty();
const aiSchema = z.string().trim().min(1).max(2000);

app.post('/bfhl', async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({
        is_success: false,
        error: 'Request body must be a JSON object.',
      });
    }

    const keys = Object.keys(req.body);
    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        error: 'Request body must contain exactly one key.',
      });
    }

    const key = keys[0];
    if (!allowedKeys.has(key)) {
      return res.status(400).json({
        is_success: false,
        error: 'Invalid key. Allowed keys: fibonacci, prime, lcm, hcf, AI.',
      });
    }

    const value = req.body[key];
    let data;

    if (key === 'fibonacci') {
      data = fibonacci(fibonacciSchema.parse(value));
    } else if (key === 'prime') {
      data = primeFilter(integerArraySchema.parse(value));
    } else if (key === 'lcm') {
      data = lcm(integerArraySchema.parse(value));
    } else if (key === 'hcf') {
      data = hcf(integerArraySchema.parse(value));
    } else {
      const question = aiSchema.parse(value);
      try {
        data = await askSingleWord(question);
      } catch (error) {
        return res.status(500).json({
          is_success: false,
          error: `AI service failed: ${error.message}`,
        });
      }
    }

    return res.status(200).json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
      data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        is_success: false,
        error: error.issues[0]?.message || 'Invalid input.',
      });
    }

    return next(error);
  }
});

app.use((req, res) => {
  return res.status(404).json({
    is_success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      is_success: false,
      error: 'Invalid JSON payload.',
    });
  }

  console.error(error);

  return res.status(500).json({
    is_success: false,
    error: 'Internal server error.',
  });
});

module.exports = {
  app,
  PORT,
};
