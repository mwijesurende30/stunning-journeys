/**
 * mapRenderer.js – Draws a tile‑map onto a <canvas>.
 *
 * Brawl Stars‑style visuals:
 *   GROUND (0) – brownish‑red base terrain (walkable)
 *   GRASS  (1) – green bush patch (walkable, hides players)
 *   ROCK   (2) – solid grey wall (blocks movement & attacks)
 *   WATER  (3) – dark blue, impassable
 *
 * Usage:
 *   renderMap(canvas, mapIndex, tileSize?)  – full render
 *   renderMapThumb(canvas, mapIndex)         – small thumbnail
 */

/* ── Colour palette ──────────────────────────────────────── */
const GROUND_BASE   = '#b47640';   // warm brown‑orange
const GROUND_ACCENT = '#c4884f';   // lighter grain
const GROUND_DARK   = '#9a6535';   // shadow crack

const GRASS_BASE    = '#3b8c2a';   // rich green bush
const GRASS_ACCENT  = '#4da83a';   // lighter leaf highlight
const GRASS_DARK    = '#2e6e20';   // dark leaf shadow

const ROCK_BASE     = '#5c5c5c';   // grey wall
const ROCK_TOP      = '#787878';   // top‑face highlight
const ROCK_SHADOW   = '#3e3e3e';   // bottom‑face shadow

const WATER_BASE    = '#2a6cb8';   // deep blue
const WATER_ACCENT  = '#3e8ae0';   // wave crest

function renderMap(canvas, mapIndex, tileSize) {
  const map = MAPS[mapIndex];
  if (!map) return;
  tileSize = tileSize || 16;
  canvas.width  = map.cols * tileSize;
  canvas.height = map.rows * tileSize;
  const ctx = canvas.getContext('2d');

  for (let r = 0; r < map.rows; r++) {
    for (let c = 0; c < map.cols; c++) {
      const tile = map.tiles[r][c];
      const x = c * tileSize;
      const y = r * tileSize;

      // Always draw ground underneath every tile first
      drawGround(ctx, x, y, tileSize);

      // Then overlay the specific tile type
      if (tile === TILE.GRASS) {
        drawGrass(ctx, x, y, tileSize, r, c);
      } else if (tile === TILE.ROCK) {
        drawRock(ctx, x, y, tileSize);
      } else if (tile === TILE.WATER) {
        drawWater(ctx, x, y, tileSize, r, c);
      }
      // GROUND (0) already drawn
    }
  }
}

/* ── Ground tile ─────────────────────────────────────────── */
function drawGround(ctx, x, y, s) {
  ctx.fillStyle = GROUND_BASE;
  ctx.fillRect(x, y, s, s);

  // Subtle grain texture – two small accent rects
  ctx.fillStyle = GROUND_ACCENT;
  ctx.fillRect(x + s * 0.15, y + s * 0.2, s * 0.2, s * 0.12);
  ctx.fillRect(x + s * 0.6,  y + s * 0.65, s * 0.22, s * 0.1);

  // Tiny dark crack
  ctx.fillStyle = GROUND_DARK;
  ctx.fillRect(x + s * 0.45, y + s * 0.4, s * 0.12, 1);

  // Faint grid line
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  ctx.strokeRect(x, y, s, s);
}

/* ── Grass (bush) tile ───────────────────────────────────── */
function drawGrass(ctx, x, y, s, r, c) {
  // Bush background
  ctx.fillStyle = GRASS_BASE;
  ctx.fillRect(x, y, s, s);

  // Leaf clusters – a few overlapping circles for bushy look
  const cx = x + s / 2;
  const cy = y + s / 2;
  const rad = s * 0.32;

  ctx.fillStyle = GRASS_ACCENT;
  ctx.beginPath();
  ctx.arc(cx - s * 0.15, cy - s * 0.1, rad, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx + s * 0.15, cy + s * 0.05, rad * 0.9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = GRASS_DARK;
  ctx.beginPath();
  ctx.arc(cx + s * 0.05, cy + s * 0.18, rad * 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Hard edge to show it's a distinct gameplay element
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.strokeRect(x, y, s, s);
}

/* ── Rock (wall) tile ────────────────────────────────────── */
function drawRock(ctx, x, y, s) {
  // Main body
  ctx.fillStyle = ROCK_BASE;
  ctx.fillRect(x, y, s, s);

  // Top face highlight (raised look)
  ctx.fillStyle = ROCK_TOP;
  ctx.fillRect(x + 1, y + 1, s - 2, s * 0.35);

  // Bottom / right shadow
  ctx.fillStyle = ROCK_SHADOW;
  ctx.fillRect(x, y + s * 0.75, s, s * 0.25);
  ctx.fillRect(x + s * 0.8, y + s * 0.35, s * 0.2, s * 0.4);

  // Edge
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.strokeRect(x, y, s, s);
}

/* ── Water tile ──────────────────────────────────────────── */
function drawWater(ctx, x, y, s, r, c) {
  ctx.fillStyle = WATER_BASE;
  ctx.fillRect(x, y, s, s);

  // Animated‑looking wave line (static but offset by row for variety)
  ctx.strokeStyle = WATER_ACCENT;
  ctx.lineWidth = Math.max(1, s * 0.06);
  const offset = ((r + c) % 3) * s * 0.12;
  ctx.beginPath();
  ctx.moveTo(x + 2, y + s * 0.45 + offset);
  ctx.quadraticCurveTo(x + s / 2, y + s * 0.25 + offset, x + s - 2, y + s * 0.45 + offset);
  ctx.stroke();
  ctx.lineWidth = 1;

  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.strokeRect(x, y, s, s);
}

function renderMapThumb(canvas, mapIndex) {
  renderMap(canvas, mapIndex, 8);
}
