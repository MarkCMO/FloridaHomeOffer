// /commercial/{state}/{city}/{asset-class} - CRE asset-class-specific landing
import { renderCommercialCity } from '../../../_lib/commercial-renderer.js';
export async function onRequest(context) {
  return renderCommercialCity(context, null); // asset is read from params.asset inside renderer
}
