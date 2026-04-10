/* ============================================
   CALENDAR 2026 — JavaScript
   Handles rendering, navigation, and toggling
   ============================================ */

const MONTHS = [
  "January", "February", "March",    "April",
  "May",     "June",     "July",     "August",
  "September","October", "November", "December"
];

const YEAR  = 2026;
const today = new Date();

let cur = 0;   // current month index (0 = January)
let sel = null; // selected date { m, d }

/* ── UTILITY: check if a given year/month/day is today ── */
function isToday(m, d) {
  return (
    today.getFullYear() === YEAR &&
    today.getMonth()    === m    &&
    today.getDate()     === d
  );
}

/* ────────────────────────────────────────────
   BUILD CALENDAR TABLE BODY
   mi   = month index (0-11)
   mini = true when rendering the small all-months cards
──────────────────────────────────────────── */
function buildBody(mi, mini) {
  const firstDay  = new Date(YEAR, mi, 1).getDay();        // weekday of 1st
  const totalDays = new Date(YEAR, mi + 1, 0).getDate();   // days in month
  const prevDays  = new Date(YEAR, mi, 0).getDate();       // days in prev month

  let html = '';
  let d    = 1;   // current month day counter
  let nd   = 1;   // next month day counter

  const rows = (firstDay + totalDays > 35) ? 6 : 5;

  for (let r = 0; r < rows; r++) {
    html += '<tr>';

    for (let c = 0; c < 7; c++) {
      const cell = r * 7 + c;

      if (cell < firstDay) {
        /* — trailing days from previous month — */
        const pd = prevDays - firstDay + c + 1;
        html += `<td class="om"><span class="di">${pd}</span></td>`;

      } else if (d <= totalDays) {
        /* — days in current month — */
        let cls = '';
        if (isToday(mi, d)) {
          cls = 'today';
        } else if (!mini && sel && sel.m === mi && sel.d === d) {
          cls = 'sel';
        }

        const dataAttrs = mini ? '' : ` data-m="${mi}" data-d="${d}"`;
        html += `<td class="${cls}"${dataAttrs}><span class="di">${d}</span></td>`;
        d++;

      } else {
        /* — leading days from next month — */
        html += `<td class="om"><span class="di">${nd++}</span></td>`;
      }
    }

    html += '</tr>';
  }

  return html;
}

/* ────────────────────────────────────────────
   RENDER SINGLE MONTH VIEW
──────────────────────────────────────────── */
function renderSingle() {
  // Update heading
  document.getElementById('month-label').textContent = MONTHS[cur] + ' ' + YEAR;

  // Update table body
  document.getElementById('cal-body').innerHTML = buildBody(cur, false);

  // Update active tab
  document.querySelectorAll('.m-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === cur);
  });

  // Attach click events to each day cell
  document.querySelectorAll('#cal-body td[data-d]').forEach(td => {
    td.addEventListener('click', () => {
      sel = { m: parseInt(td.dataset.m), d: parseInt(td.dataset.d) };
      renderSingle();
    });
  });
}

/* ────────────────────────────────────────────
   BUILD MONTH TAB BUTTONS  (Jan … Dec)
──────────────────────────────────────────── */
const tabsEl = document.getElementById('month-tabs');

MONTHS.forEach((name, i) => {
  const btn = document.createElement('button');
  btn.className   = 'm-tab' + (i === 0 ? ' active' : '');
  btn.textContent = name.slice(0, 3); // "Jan", "Feb", etc.
  btn.addEventListener('click', () => {
    cur = i;
    renderSingle();
  });
  tabsEl.appendChild(btn);
});

/* ── Prev / Next navigation ── */
document.getElementById('prev').addEventListener('click', () => {
  cur = (cur - 1 + 12) % 12;
  renderSingle();
});

document.getElementById('next').addEventListener('click', () => {
  cur = (cur + 1) % 12;
  renderSingle();
});

/* Initial render */
renderSingle();

/* ────────────────────────────────────────────
   RENDER ALL 12 MONTHS VIEW
──────────────────────────────────────────── */
function renderAll() {
  const grid = document.getElementById('months-grid');
  grid.innerHTML = '';

  MONTHS.forEach((name, i) => {
    const card = document.createElement('div');
    card.className = 'mini-card';
    card.innerHTML = `
      <div class="cal-header mb-3">
        <span class="cal-month-title">${name} ${YEAR}</span>
      </div>
      <table class="cal-table table">
        <thead>
          <tr>
            <th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th>
          </tr>
        </thead>
        <tbody>${buildBody(i, true)}</tbody>
      </table>
    `;
    grid.appendChild(card);
  });
}

/* ────────────────────────────────────────────
   VIEW TOGGLE  (Single Month ↔ All 12 Months)
──────────────────────────────────────────── */
const singleView = document.getElementById('single-view');
const allView    = document.getElementById('all-view');
const btnSingle  = document.getElementById('btn-single');
const btnAll     = document.getElementById('btn-all');

btnSingle.addEventListener('click', function () {
  singleView.style.display = '';
  allView.classList.remove('show');
  btnSingle.classList.add('active');
  btnAll.classList.remove('active');
});

btnAll.addEventListener('click', function () {
  singleView.style.display = 'none';
  allView.classList.add('show');
  btnAll.classList.add('active');
  btnSingle.classList.remove('active');
  renderAll();
});
