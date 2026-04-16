/**
 * obras.js — Fuente única de verdad para los datos de las obras.
 *
 * modelPath: ruta al archivo GLB.
 *   - Misma ruta del servidor:    './models/escultura_001.glb'
 *   - CDN / servidor externo:     'https://cdn.tusitio.com/models/escultura_001.glb'
 *   - Ruta absoluta del servidor: '/assets/models/escultura_001.glb'
 *
 * fallback: geometría procedural Three.js que se usa si el GLB no está disponible.
 * Abierto a extensión (O de SOLID): añade una obra nueva aquí sin tocar ningún otro archivo.
 */
export const OBRAS = [
  {
    num: '001',
    titulo: 'Forma en el Vacío',
    artista: 'Anónimo',
    desc: 'Bronce patinado sobre base de mármol. La pieza explora la tensión entre masa y espacio negativo.',
    precio: 'MXN 48,000',
    // Para servidor externo: 'https://cdn.tusitio.com/models/escultura_001.glb'
    modelPath: './models/watermelon.glb',
    fallback:  { type: 'TorusKnot',    args: [0.55, 0.18, 128, 16] },
    material:  { color: 0xb8860b, metalness: 0.9, roughness: 0.2 },
    position:  { x: -4, y: 1.6, z: -1 },
    animType:  'rotate',
  },
  {
    num: '002',
    titulo: 'Fragmento Suspendido',
    artista: 'L. Vargas',
    desc: 'Resina y pigmento mineral. Serie de geometrías irregulares inspiradas en formaciones rocosas del altiplano.',
    precio: 'MXN 32,500',
    // Para servidor externo: 'https://cdn.tusitio.com/models/escultura_002.glb'
    modelPath: './models/pineapple.glb',
    fallback:  { type: 'Dodecahedron', args: [0.65, 1] },
    material:  { color: 0x8888bb, metalness: 0.3, roughness: 0.6 },
    position:  { x: 0, y: 1.6, z: -1 },
    animType:  'float',
  },
  {
    num: '003',
    titulo: 'Espiral Continua',
    artista: 'M. Orozco',
    desc: 'Acero inoxidable pulido. La superficie reflectante hace al espectador parte de la obra.',
    precio: 'MXN 95,000',
    // Para servidor externo: 'https://cdn.tusitio.com/models/escultura_003.glb'
    modelPath: './models/escultura_003.glb',
    fallback:  { type: 'Cone',         args: [0.5, 1.4, 5] },
    material:  { color: 0xddddee, metalness: 0.95, roughness: 0.05 },
    position:  { x: 4, y: 1.6, z: -1 },
    animType:  'pulse',
  },
];
