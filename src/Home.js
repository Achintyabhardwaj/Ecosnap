// =======================
// Dark Mode
// =======================
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// =======================
// Animated Counters
// =======================
function animateCounter(id, target) {
  let count = 0;
  let step = Math.ceil(target / 100);
  let interval = setInterval(() => {
    count += step;
    if (count >= target) {
      count = target;
      clearInterval(interval);
    }
    document.getElementById(id).innerText = count;
  }, 20);
}

animateCounter("plastic", 50);
animateCounter("trees", 20);
animateCounter("coins", 100);

// =======================
// Leaderboard
// =======================
let leaderboardData = [];
function addToLeaderboard() {
  const name = document.getElementById("username").value;
  const coins = document.getElementById("usercoins").value;

  if (name && coins) {
    leaderboardData.push({ name, coins: parseInt(coins) });
    leaderboardData.sort((a, b) => b.coins - a.coins);

    let table = document.getElementById("leaderboardTable");
    table.innerHTML = "<tr><th>Rank</th><th>User</th><th>Coins</th></tr>";

    leaderboardData.forEach((user, index) => {
      table.innerHTML += `<tr><td>${index + 1}</td><td>${user.name}</td><td>${user.coins}</td></tr>`;
    });

    document.getElementById("username").value = "";
    document.getElementById("usercoins").value = "";
  }
}

// =======================
// Eco Impact Helper
// =======================
function getEcoImpact(packaging = "") {
  const pkg = packaging.toLowerCase();
  if (pkg.includes("plastic") || pkg.includes("cellophane")) return { level: "High Impact 🔴", color: "red" };
  if (pkg.includes("paper") || pkg.includes("cardboard")) return { level: "Low Impact 🟢", color: "green" };
  if (pkg.includes("glass") || pkg.includes("metal")) return { level: "Medium Impact 🟡", color: "orange" };
  return { level: "Unknown ⚪", color: "gray" };
}

// =======================
// API Calls
// =======================

// Open Food Facts API
async function fetchFromOpenFoodFacts(barcode) {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await res.json();
    if (data.status === 1) {
      return {
        source: "Open Food Facts",
        name: data.product.product_name || "Unknown Product",
        packaging: data.product.packaging || "No packaging info",
        image: data.product.image_url || "",
      };
    }
  } catch (err) {
    console.error("OFF API error:", err);
  }
  return null;
}

// Amazon Product Advertising API (requires credentials)
async function fetchFromAmazon(barcode) {
  // ⚠️ You must replace with your signed API call (this is just placeholder)
  console.log("Fetching from Amazon API for", barcode);
  return {
    source: "Amazon",
    name: "Amazon Product Example",
    packaging: "Plastic Wrap",
    image: "https://m.media-amazon.com/images/I/71g2ednj0JL._AC_UF1000,1000_QL80_.jpg"
  };
}

// Ecolabel Index API
async function fetchFromEcolabel(name) {
  try {
    const res = await fetch(`https://api.ecolabelindex.com/labels?query=${encodeURIComponent(name)}`);
    const data = await res.json();
    if (data && data.length > 0) {
      return data.map(label => label.name).join(", ");
    }
  } catch (err) {
    console.error("Ecolabel API error:", err);
  }
  return "No eco-certification found.";
}

// =======================
// Display Product
// =======================
async function displayProduct(barcode) {
  let product = await fetchFromOpenFoodFacts(barcode);

  if (!product) {
    product = await fetchFromAmazon(barcode); // fallback
  }

  if (!product) {
    document.getElementById("barcodeResult").innerHTML = `❌ Product not found for barcode: ${barcode}`;
    return;
  }

  const impact = getEcoImpact(product.packaging);
  const ecoLabels = await fetchFromEcolabel(product.name);

  const resultHTML = `
    <div style="text-align:center;">
      <h3>${product.name} (Barcode: ${barcode})</h3>
      ${product.image ? `<img src="${product.image}" width="120" style="border-radius:10px; margin:10px 0;">` : ""}
      <p>📦 Packaging: ${product.packaging}</p>
      <p style="color:${impact.color}; font-weight:bold;">${impact.level}</p>
      <p>🌍 Eco Certifications: ${ecoLabels}</p>
    </div>
  `;

  document.getElementById("barcodeResult").innerHTML = resultHTML;
  addToHistory(resultHTML);
  showAlternative(barcode);
}

// =======================
// Manual Barcode
// =======================
function processBarcode() {
  const code = document.getElementById("barcodeText").value;
  if (code) {
    displayProduct(code);
  }
}

// =======================
// Barcode Scanner
// =======================
function startScanner() {
  const codeReader = new ZXing.BrowserMultiFormatReader();
  const preview = document.getElementById("scannerPreview");
  preview.style.display = "block";

  codeReader.decodeFromVideoDevice(null, "scannerPreview", async (result, err) => {
    if (result) {
      await displayProduct(result.text);
      codeReader.reset();
    }
  });
}

// =======================
// History
// =======================
function addToHistory(htmlContent) {
  const historyList = document.getElementById("barcodeHistory");
  const li = document.createElement("li");
  li.innerHTML = htmlContent;
  historyList.prepend(li);
}

// =======================
// Eco Tips
// =======================
const tips = [
  "Use reusable bottles instead of plastic ones.",
  "Carry your own shopping bag to avoid single-use plastics.",
  "Choose products with minimal packaging.",
  "Recycle plastic containers properly.",
  "Support brands with eco-friendly packaging."
];

let tipIndex = 0;
function nextTip() {
  tipIndex = (tipIndex + 1) % tips.length;
  document.getElementById("tipText").innerText = tips[tipIndex];
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("tipText").innerText = tips[0];
});

// =======================
// Alternatives
// =======================
const alternatives = {
  "737628064502": "🍜 Try a reusable meal kit with compostable packaging.",
  "4902430782916": "🥤 Switch to a reusable water bottle instead of PET plastic.",
  "5449000000996": "🥤 Choose glass bottled drinks over plastic Coke bottles."
};

function showAlternative(barcode) {
  const suggestion = alternatives[barcode] || "🌱 No alternative found. Try reducing single-use plastic!";
  document.getElementById("alternativeResult").innerText = suggestion;
}
// =======================
// Social Sharing
// =======================
function shareOnTwitter(message) {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&hashtags=EcoSnap,GoGreen`;
  window.open(url, "_blank");
}

function shareOnWhatsApp(message) {
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function shareOnFacebook(message) {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function shareOnLinkedIn(message) {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// =======================
// Init AOS
// =======================
AOS.init();