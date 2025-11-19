// 🌍 International languages you want
const LANGS = [
  {code:'en', name:'English', flag:'EN'},
  {code:'hi', name:'Hindi', flag:'हि'},
  {code:'ru', name:'Russian', flag:'RU'},
  {code:'pt', name:'Portuguese (Brazil)', flag:'BR'},
  {code:'es', name:'Spanish', flag:'ES'},
  {code:'fr', name:'French', flag:'FR'},
  {code:'ko', name:'Korean', flag:'KR'}
];

const grid = document.getElementById('langGrid');

// Build tiles
function makeTile(lang){
  const d = document.createElement('div');
  d.className = 'lang';
  d.tabIndex = 0;
  d.setAttribute('role','button');
  d.innerHTML = `
    <div class="flag">${lang.flag}</div>
    <div class="meta"><b>${lang.name}</b></div>
  `;
  d.onclick = () => selectLang(lang.code);
  return d;
}

LANGS.forEach(l => grid.appendChild(makeTile(l)));


// 🔥 CORRECT + UPDATED VERSION
function selectLang(code) {
  localStorage.setItem("selected_lang", code);
  window.location.href = `contact.html?lang=${encodeURIComponent(code)}`;
}

document.getElementById("btnContinue").onclick = () => {
  const stored = localStorage.getItem("selected_lang") || "en";
  window.location.href = `contact.html?lang=${encodeURIComponent(stored)}`;
};
