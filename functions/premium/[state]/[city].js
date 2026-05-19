// /premium/{state}/{city} - premium / luxury property segment page
import { renderCity } from '../../_lib/city-renderer.js';
export async function onRequest(context) {
  return renderCity(context, 'premium');
}
