import { loadEnvFile } from 'node:process';
loadEnvFile();

import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify({
  logger: true
});

// Register CORS to allow frontend to communicate with backend
await fastify.register(cors, {
  origin: 'http://localhost:5173' // Vite's default port
});

// Health check endpoint
fastify.get('/api/health', async (request, reply) => {
  return { status: 'ok', message: 'Server is running!' };
});

// NASA NEO Feed endpoint
fastify.get<{
  Querystring: { START_DATE: string; END_DATE: string; sort?: string }
}>('/api', async (request, reply) => {
  const { START_DATE, END_DATE, sort } = request.query;

  // Validate date format: only YYYY/MM/DD
  const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
  if (!START_DATE || !END_DATE) {
    return reply.status(400).send({ error: 'START_DATE and END_DATE are required' });
  }
  if (!dateRegex.test(START_DATE) || !dateRegex.test(END_DATE)) {
    return reply.status(400).send({ error: 'Dates must be in YYYY/MM/DD format' });
  }

  const normalizedSort = sort?.toLowerCase();
  const validSorts = ['size', 'closeness', 'velocity'];
  if (normalizedSort && !validSorts.includes(normalizedSort)) {
    return reply.status(400).send({ error: `sort must be one of: ${validSorts.join(', ')}` });
  }

  // Convert YYYY/MM/DD to YYYY-MM-DD for NASA API
  const startDate = START_DATE.replaceAll('/', '-');
  const endDate = END_DATE.replaceAll('/', '-');

  //api key taken form env file
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    return reply.status(500).send({ error: 'NASA_API_KEY is not configured' });
  }

  //API call
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;
  const response = await fetch(url);

  //if there is an error handle it
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    return reply.status(response.status).send({
      error: 'Failed to fetch data from NASA API',
      details: errorBody,
    });
  }

  //set up the data just for the information that is needed
  const data = await response.json() as {
    near_earth_objects: Record<string, Array<{
      name: string;
      name_limited?: string;
      estimated_diameter: {
        kilometers: { estimated_diameter_min: number; estimated_diameter_max: number };
        meters: { estimated_diameter_min: number; estimated_diameter_max: number };
        miles: { estimated_diameter_min: number; estimated_diameter_max: number };
        feet: { estimated_diameter_min: number; estimated_diameter_max: number };
      };
      close_approach_data: Array<{
        close_approach_date: string;
        relative_velocity: {
          kilometers_per_second: string;
          kilometers_per_hour: string;
          miles_per_hour: string;
        };
        miss_distance: {
          astronomical: string;
          lunar: string;
          kilometers: string;
          miles: string;
        };
      }>;
    }>>;
  };

  const allNeos = Object.values(data.near_earth_objects).flat();

  const filtered = allNeos.filter((neo) =>
    neo.close_approach_data.some((approach) => {
      const approachDate = approach.close_approach_date;
      return approachDate >= startDate && approachDate <= endDate;
    })
  );

  const sanitized = filtered.map((neo) => ({
    name: neo.name,
    name_limited: neo.name_limited,
    estimated_diameter: neo.estimated_diameter,
    close_approach_data: neo.close_approach_data,
  }));

  // Sort if requested
  if (normalizedSort === 'size') {
    sanitized.sort(
      (a, b) =>
        a.estimated_diameter.kilometers.estimated_diameter_max -
        b.estimated_diameter.kilometers.estimated_diameter_max
    );
  } else if (normalizedSort === 'closeness') {
    sanitized.sort(
      (a, b) =>
        parseFloat(a.close_approach_data[0]?.miss_distance.kilometers ?? '0') -
        parseFloat(b.close_approach_data[0]?.miss_distance.kilometers ?? '0')
    );
  } else if (normalizedSort === 'velocity') {
    sanitized.sort(
      (a, b) =>
        parseFloat(a.close_approach_data[0]?.relative_velocity.kilometers_per_second ?? '0') -
        parseFloat(b.close_approach_data[0]?.relative_velocity.kilometers_per_second ?? '0')
    );
  }

  return sanitized;
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
