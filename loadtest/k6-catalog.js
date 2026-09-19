/**
 * Prueba de carga del catálogo (lectura pública) con k6.
 *
 * Uso:
 *   export BASE_URL="https://yum-run-express.lovable.app"
 *   export SUPABASE_URL="https://<tu-backend>.supabase.co"
 *   export SUPABASE_ANON_KEY="<clave publicable>"
 *   k6 run loadtest/k6-catalog.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL;
const SUPABASE_URL = __ENV.SUPABASE_URL;
const ANON = __ENV.SUPABASE_ANON_KEY;

export const options = {
  scenarios: {
    // Pico repentino: de 0 a 1.000 usuarios en 1 minuto
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 1000 },
        { duration: '3m', target: 1000 },
        { duration: '1m', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
};

const headers = {
  apikey: ANON,
  Authorization: `Bearer ${ANON}`,
  Accept: 'application/json',
};

export default function () {
  // 1. Carga del HTML de la app
  const page = http.get(`${BASE_URL}/`);
  check(page, { 'app 200': (r) => r.status === 200 });

  // 2. Catálogo de productos (la consulta más repetida)
  const products = http.get(
    `${SUPABASE_URL}/rest/v1/products?select=*&available=eq.true&order=sort_order.asc`,
    { headers }
  );
  check(products, {
    'productos 200': (r) => r.status === 200,
    'productos < 800ms': (r) => r.timings.duration < 800,
  });

  // 3. Estado de cocina + imágenes de categorías
  http.get(`${SUPABASE_URL}/rest/v1/app_settings?select=key,value`, { headers });

  sleep(Math.random() * 3 + 1);
}
