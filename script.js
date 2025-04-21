import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCYjQsAwSuPCNq7vwt_la03kySrD_0OITM",
  authDomain: "ezpark-e7be7.firebaseapp.com",
  databaseURL: "https://ezpark-e7be7-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ezpark-e7be7",
  storageBucket: "ezpark-e7be7.appspot.com",
  messagingSenderId: "869927732294",
  appId: "1:869927732294:web:a66def40134dff6822b647"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const slotIds = ["A1", "A2", "A3", "A4"];

// Update UI
function updateSlotUI(slotId, status) {
  const slot = document.getElementById("slot-" + slotId);
  if (!slot) return;

  slot.style.backgroundColor = status ? "red" : "green";
  slot.innerHTML = `${slotId}<br>${status ? "Occupied" : "Free"}`;
}

// Init default slot values
function initializeSlotStatuses() {
  slotIds.forEach(slotId => {
    const slotRef = ref(db, "slots/" + slotId);
    onValue(slotRef, (snapshot) => {
      if (snapshot.val() === null) {
        set(slotRef, false);
      }
    }, { onlyOnce: true });
  });
}
initializeSlotStatuses();

// Real-time listener
slotIds.forEach(slotId => {
  const slotRef = ref(db, "slots/" + slotId);
  onValue(slotRef, (snapshot) => {
    updateSlotUI(slotId, snapshot.val());
  });
});

// Toggle slot manually
window.toggleSlot = function (slotId) {
  const slotRef = ref(db, "slots/" + slotId);
  onValue(slotRef, (snapshot) => {
    set(slotRef, !snapshot.val());
  }, { onlyOnce: true });
};

// SIMULATION
let simRunning = false;
let simulationInterval = null;

const simBtn = document.getElementById("start-sim-btn");
const simIndicator = document.getElementById("sim-indicator");

function startSimulation() {
  if (simRunning) {
    clearInterval(simulationInterval);
    simBtn.innerText = "Start Simulation";
    simIndicator.style.backgroundColor = "grey";
    simRunning = false;
  } else {
    simulationInterval = setInterval(() => {
      const randomSlot = slotIds[Math.floor(Math.random() * slotIds.length)];
      window.toggleSlot(randomSlot);
    }, 3000);

    simBtn.innerText = "Stop Simulation";
    simIndicator.style.backgroundColor = "yellow";
    simRunning = true;
  }
}

simBtn.addEventListener("click", startSimulation);
