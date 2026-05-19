// /sell/{state}/{city} - sell-your-house-fast page
import { renderCity } from '../../_lib/city-renderer.js';
export async function onRequest(context) {
  return renderCity(context, 'sell');
}
