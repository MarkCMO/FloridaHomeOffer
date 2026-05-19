// /commercial/{state}/{city} - city-level CRE landing
import { renderCommercialCity } from '../../_lib/commercial-renderer.js';
export async function onRequest(context) {
  return renderCommercialCity(context, null);
}
