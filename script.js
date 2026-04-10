const MONTHS = [
  "January", "February", "March",    "April",
  "May",     "June",     "July",     "August",
  "September","October", "November", "December"
];

const YEAR  = 2026;
const today = new Date();

let cur = 0;   
let sel = null; 

function isToday(m, d) {
  return (
    today.getFullYear() === YEAR &&
    today.getMonth()    === m    &&
    today.getDate()     === d
  );
}

function buildBody(mi, mini) {
  const firstDay  = new Date(YEAR, mi, 1).getDay();        
  const totalDays = new Date(YEAR, mi + 1, 0).getDate();   
  const prevDays  = new Date(YEAR, mi, 0).getDate();       

  let html = '';
  let d    = 1;   
  let nd   = 1;   

  const rows = (firstDay + totalDays > 35) ? 6 : 5;

  for (let r = 0; r < rows; r++) {
    html += '<tr>';

    for (let c = 0; c < 7; c++) {
      const cell = r * 7 + c;

      if (cell < firstDay) {
        const pd = prevDays - firstDay + c + 1;
        html += `<td class="om"><span class="di">${pd}</span></td>`;

      } else if (d <= totalDays) {
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
        
        html += `<td class="om"><span class="di">${nd++}</span></td>`;
      }
    }

    html += '</tr>';
  }

  return html;
}

function renderSingle() {
  document.getElementById('month-label').textContent = MONTHS[cur] + ' ' + YEAR;

  document.getElementById('cal-body').innerHTML = buildBody(cur, false);


  document.querySelectorAll('.m-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === cur);
  });
   
  document.querySelectorAll('#cal-body td[data-d]').forEach(td => {
    td.addEventListener('click', () => {
      sel = { m: parseInt(td.dataset.m), d: parseInt(td.dataset.d) };
      renderSingle();
    });
  });
}

const tabsEl = document.getElementById('month-tabs');

MONTHS.forEach((name, i) => {
  const btn = document.createElement('button');
  btn.className   = 'm-tab' + (i === 0 ? ' active' : '');
  btn.textContent = name.slice(0, 3); 
  btn.addEventListener('click', () => {
    cur = i;
    renderSingle();
  });
  tabsEl.appendChild(btn);
});

document.getElementById('prev').addEventListener('click', () => {
  cur = (cur - 1 + 12) % 12;
  renderSingle();
});

document.getElementById('next').addEventListener('click', () => {
  cur = (cur + 1) % 12;
  renderSingle();
});


renderSingle();

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
