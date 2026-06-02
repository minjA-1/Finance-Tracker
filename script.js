"use strict";

const opis = document.getElementById("f-opis");
const iznos = document.getElementById("f-iznos");
const tip = document.getElementById("f-tip");
const list = document.getElementById("fin-list");
const prihod = document.getElementById("m-prihod");
const rashod = document.getElementById("m-rashod");
const bilans = document.getElementById("m-bilans");
const addBtn = document.getElementById("btn-dodaj");

const financije = [];

opis.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addFinancija();
  }
});

iznos.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addFinancija();
  }
});

function addFinancija() {
  const addOpis = opis.value.trim();
  const addIznos = parseFloat(iznos.value.trim());
  const addTip = tip.value;

  if (addOpis === "") {
    alert("Molimo Vas da unesete podatke u polje!");
    return;
  }

  if (isNaN(addIznos) || addIznos < 0) {
    alert("Molimo Vas da unesete podatke u polje!");
    return;
  }

  financije.push({
    opis: addOpis,
    iznos: addIznos,
    tip: addTip,
    id: Date.now(),
  });

  opis.value = "";
  iznos.value = "";

  renderFinancije();
}

function delFinancija(id) {
  if (!confirm("Da li želite da obrišete stavku?")) {
    return;
  }

  const index = financije.findIndex((f) => f.id === id);

  if (index !== -1) {
    financije.splice(index, 1);
  }

  renderFinancije();
}

window.delFinancija = delFinancija;

function renderFinancije() {
  if (financije.length === 0) {
    list.innerHTML = '<div class="empty">Nema unosa — dodaj prvu stavku</div>';
    return;
  }
  list.innerHTML = financije
    .map(
      (f) => `
  <div class="list-item fin-row">
    <span>${f.opis}</span>
    <span>${f.iznos} RSD</span>
    <span><span class="badge badge-${f.tip}">${f.tip}</span></span>
    <button class="del" onclick="delFinancija(${f.id})">🗑</button>
  </div>
`,
    )
    .join("");

  updateMetrics();
}

function updateMetrics() {
  const sviPrihodi = financije
    .filter((n) => n.tip === "prihod")
    .reduce((acc, curr) => acc + curr.iznos, 0);
  // saberi sve rashode
  const sviRashodi = financije
    .filter((n) => n.tip === "rashod")
    .reduce((acc, curr) => acc + curr.iznos, 0);
  // izracunaj bilans = prihodi - rashodi
  const iznosBilansa = sviPrihodi - sviRashodi;
  bilans.textContent = iznosBilansa + " RSD";

  // azuriraj tekstove u m-prihod, m-rashod, m-bilans
  prihod.textContent = sviPrihodi + " RSD";
  rashod.textContent = sviRashodi + " RSD";
  // ako je bilans negativan, dodaj klasu 'red', inace 'green'
  if (iznosBilansa < 0) {
    bilans.classList.add("red");
    bilans.classList.remove("green");
  } else {
    bilans.classList.add("green");
    bilans.classList.remove("red");
  }
}
