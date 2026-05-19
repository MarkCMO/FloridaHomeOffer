// /distressed/{state}/{city} - distressed property segment page
import { renderCity } from '../../_lib/city-renderer.js';
export async function onRequest(context) {
  return renderCity(context, 'distressed');
}
