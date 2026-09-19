# Pruebas de estrés — Tryb Burger

## 1. Antes de lanzar

```bash
# Instalar k6
brew install k6          # macOS
# o: nix run nixpkgs#k6 -- run loadtest/k6-catalog.js

export BASE_URL="https://yum-run-express.lovable.app"
export SUPABASE_URL="https://<backend>.supabase.co"
export SUPABASE_ANON_KEY="<clave publicable>"

k6 run loadtest/k6-catalog.js
```

Criterios de aprobación (ya definidos como `thresholds` en el script):
- menos del 1 % de peticiones fallidas
- p95 de latencia por debajo de 800 ms

## 2. Escritura (pedidos) — hacerlo en un entorno de prueba

No lances escrituras masivas contra producción: generarías pedidos reales y
tickets impresos en cocina. Para probar el flujo de pedido, duplica el
proyecto o limita el escenario a 20-50 VUs y borra después desde el
panel de administración (pestaña Historial).

## 3. Lighthouse (rendimiento percibido)

```bash
npx lighthouse https://yum-run-express.lovable.app \
  --preset=desktop --output=html --output-path=./lh-desktop.html
npx lighthouse https://yum-run-express.lovable.app \
  --form-factor=mobile --throttling.cpuSlowdownMultiplier=4 \
  --output=html --output-path=./lh-mobile.html
```

Objetivos móviles: LCP < 2,5 s, CLS < 0,1, TBT < 300 ms.

## 4. Qué vigilar durante la prueba

- Saturación de conexiones y memoria del backend (herramienta de salud de la base de datos).
- Consultas lentas: si aparece un `seq scan` sobre `orders`, falta un índice.
- Canales de realtime: cada pestaña de administración abre uno; no abras 20 pestañas de cocina.

## 5. Si la prueba falla

| Síntoma | Causa probable | Acción |
|---|---|---|
| p95 > 2 s en `/rest/v1/products` | falta de caché / instancia pequeña | subir tamaño de instancia de Lovable Cloud |
| errores 546 / timeouts | agotamiento del pool de conexiones | subir instancia; revisar suscripciones realtime |
| "disk full" (53100) | disco de datos lleno | ampliar disco |
| LCP alto en móvil | imágenes grandes subidas por el admin | ya se comprimen al subir; revisar imágenes antiguas |
