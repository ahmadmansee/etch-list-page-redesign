const slides = Array.from(document.querySelectorAll('.slide'));
slides.forEach((slide, index) => {
  slide.querySelector('.slide-index').textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
});

document.addEventListener('keydown', (event) => {
  if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(event.key)) return;
  const midline = window.scrollY + window.innerHeight / 2;
  const current = slides.reduce((best, slide, index) => Math.abs(slide.offsetTop - midline) < Math.abs(slides[best].offsetTop - midline) ? index : best, 0);
  const direction = event.key === 'ArrowDown' || event.key === 'PageDown' ? 1 : -1;
  const next = Math.max(0, Math.min(slides.length - 1, current + direction));
  if (next !== current) {
    event.preventDefault();
    slides[next].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

const findingItems = Array.from(document.querySelectorAll('.audit-findings li'));
const findingTriggers = Array.from(document.querySelectorAll('[data-finding]'));
function selectFinding(id) {
  findingItems.forEach((item) => item.classList.toggle('is-active', item.id === id));
  findingTriggers.forEach((trigger) => {
    const selected = trigger.dataset.finding === id;
    trigger.classList.toggle('is-active', selected);
    if (trigger.classList.contains('marker')) trigger.setAttribute('aria-pressed', String(selected));
  });
}
window.selectFinding = selectFinding;
findingTriggers.forEach((trigger) => trigger.addEventListener('click', () => selectFinding(trigger.dataset.finding)));

const v2Points = {
  1: { kicker: 'Header information', title: 'Creator details dominate the first view.', body: 'Portrait, handle, location, contribution counts, rating, and actions take users through a lot of information before the first place.', direction: 'Keep lightweight attribution visible; move the fuller creator profile into a bottom sheet or profile link.' },
  2: { kicker: 'Cover height', title: 'The background image delays access to places.', body: 'The cover takes a large part of the entry view, but it does not help users compare or choose a place.', direction: 'Reduce the cover height and let the list content begin earlier.' },
  3: { kicker: 'Title association', title: 'The list title appears attached to the portrait.', body: 'A portrait normally signals the person named beside it. Here the large title names the list, which makes the relationship harder to parse.', direction: 'Separate the collection title from creator attribution and give each a clear role.' },
  4: { kicker: 'Primary navigation', title: 'Places, Map, and Comments need more emphasis.', body: 'These are the main ways to navigate the collection, but the rounded sheet and low contrast make them easy to overlook.', direction: 'Test a direct, full-width tab treatment on the white content area.' },
  5: { kicker: 'Filters', title: 'Quick filters are useful; deeper filters can stay on demand.', body: 'Categories help users narrow the list quickly. Sorting, ratings, and additional types do not need to take space in the first view.', direction: 'Keep a short row of useful pills and open the full filter set in a bottom sheet.' },
  6: { kicker: 'Place organisation', title: 'The grid does not show how places are grouped.', body: 'Every card receives the same visual weight, despite the list containing several types of places.', direction: 'Test category swimlanes with horizontal cards, such as Entertainment and Services.' }
};
const v2Markers = Array.from(document.querySelectorAll('.v2-marker'));
const v2Callout = document.querySelector('.v2-callout');
function showV2Point(id) {
  const point = v2Points[id];
  if (!point || !v2Callout) return;
  v2Markers.forEach((marker) => {
    const active = marker.dataset.v2 === String(id);
    marker.classList.toggle('is-active', active);
    marker.setAttribute('aria-pressed', String(active));
  });
  v2Callout.className = `v2-callout is-${id}`;
  v2Callout.querySelector('.v2-callout-number').textContent = String(id).padStart(2, '0');
  v2Callout.querySelector('.v2-callout-kicker').textContent = point.kicker;
  v2Callout.querySelector('h3').textContent = point.title;
  v2Callout.querySelector('p:not(.v2-callout-kicker):not(.v2-direction)').textContent = point.body;
  v2Callout.querySelector('.v2-direction').innerHTML = `<strong>Direction to test</strong> ${point.direction}`;
}
v2Markers.forEach((marker) => marker.addEventListener('click', () => showV2Point(marker.dataset.v2)));

const v3Points = {
  1: { label: 'Page identity', title: 'The header does not say which page this is.', body: 'Add a clear List page title in the iOS header.' },
  2: { label: 'Cover height', title: 'The cover takes too much of the first view.', body: 'Reduce its height so people reach the places sooner.' },
  3: { label: 'Creator attribution', title: 'The portrait and list title read as one unit.', body: 'Reduce the avatar and separate the list title from creator details.' },
  4: { label: 'Primary navigation', title: 'Places, Map, and Comments are easy to overlook.', body: 'Use direct, full-width tabs so the main ways to explore are clear.' },
  5: { label: 'Filters', title: 'Quick filters work, but deeper controls are missing.', body: 'Keep useful pills visible and open sorting and more filters on tap.' },
  6: { label: 'Place organisation', title: 'The grid does not show how places belong together.', body: 'Test category swimlanes with horizontal cards for each type of place.' },
  7: { label: 'Page identity', title: 'The profile page is missing a clear page title.', body: 'Add a page title to the iOS header so people know where they are.' },
  8: { label: 'Information hierarchy', title: 'The profile details are crowded at the top.', body: 'Group details and actions into clearer sections with more space.' }
};
const v3Dots = Array.from(document.querySelectorAll('.v3-dot'));
const v3Card = document.querySelector('.v3-example-card');
if (v3Dots.length && v3Card) {
  v3Dots.forEach((dot) => dot.addEventListener('click', () => {
    const id = dot.dataset.v3;
    const point = v3Points[id];
    if (!point) return;
    v3Dots.forEach((item) => {
      const active = item === dot;
      item.classList.toggle('is-open', active);
      item.setAttribute('aria-expanded', String(active));
    });
    v3Card.className = `v3-example-card is-open is-${id}`;
    v3Card.querySelector('span').textContent = String(id).padStart(2, '0');
    v3Card.querySelector('.v3-card-label').textContent = point.label;
    v3Card.querySelector('h3').textContent = point.title;
    v3Card.querySelector('p:last-child').textContent = point.body;
  }));
}

// Keep every audit point visibly connected to its active card.
const v3DynamicLeader = document.querySelector('.v3-dynamic-leader');
function updateV3Leader(dot) {
  if (!v3DynamicLeader || !v3Card || !dot) return;
  const artboard = document.querySelector('.v3-artboard');
  if (!artboard) return;
  const board = artboard.getBoundingClientRect();
  const source = dot.getBoundingClientRect();
  const target = v3Card.getBoundingClientRect();
  const startX = source.left - board.left + source.width / 2;
  const startY = source.top - board.top + source.height / 2;
  const targetX = startX < target.left - board.left ? target.left - board.left : target.right - board.left;
  const targetY = Math.max(target.top - board.top + 14, Math.min(startY, target.bottom - board.top - 14));
  const dx = targetX - startX;
  const dy = targetY - startY;
  v3DynamicLeader.style.width = `${Math.hypot(dx, dy)}px`;
  v3DynamicLeader.style.left = `${startX}px`;
  v3DynamicLeader.style.top = `${startY}px`;
  v3DynamicLeader.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
}
if (v3Dots.length && v3DynamicLeader) {
  const activeDot = () => document.querySelector('.v3-dot.is-open');
  v3Dots.forEach((dot) => dot.addEventListener('click', () => requestAnimationFrame(() => updateV3Leader(dot))));
  requestAnimationFrame(() => updateV3Leader(activeDot()));
  window.addEventListener('resize', () => updateV3Leader(activeDot()));
}
