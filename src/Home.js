// Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// Animated Counters
function animateCounter(id, target) {
  let count = 0;
  let interval = setInterval(() => {
    if (count >= target) clearInterval(interval);
    document.getElementById(id).innerText = count;
    count++;
  }, 30);
}

animateCounter("plastic", 50);
animateCounter("trees", 20);
animateCounter("coins", 100);

// Chart.js Demo
const ctx = document.getElementById('ecoChart');
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Eco-friendly', 'Plastic'],
    datasets: [{
      data: [70, 30],
      backgroundColor: ['#43a047', '#ef5350']
    }]
  }
});

// Leaderboard Input
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

    // Badge Unlock
    let badgeMsg = document.getElementById("badgeMsg");
    if (coins >= 100) badgeMsg.innerText = "🏆 Congrats! You unlocked Green Legend!";
    else if (coins >= 50) badgeMsg.innerText = "🥈 You unlocked Eco Hero!";
    else if (coins >= 10) badgeMsg.innerText = "🥉 You unlocked Plastic Buster!";
    else badgeMsg.innerText = "Keep scanning to unlock badges!";
  }
}

// Carbon Calculator
function calculateCarbon() {
  let travel = parseFloat(document.getElementById("travel").value) || 0;
  let plastic = parseFloat(document.getElementById("plasticUse").value) || 0;
  let electricity = parseFloat(document.getElementById("electricity").value) || 0;

  let result = (travel * 0.12) + (plastic * 0.05) + (electricity * 0.8);
  document.getElementById("carbonResult").innerText = 
    `Your Carbon Footprint: ${result.toFixed(2)} kg CO₂/day`;
}

// Init AOS
AOS.init();