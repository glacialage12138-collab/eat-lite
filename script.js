const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".bottom-nav button[data-target]");
const cameraButtons = document.querySelectorAll(".camera-tab, .log-thumb");
const dateStrip = document.querySelector("#dateStrip");
let dateButtons = [];
const foodInput = document.querySelector("#foodInput");
const foodPreview = document.querySelector("#foodPreview");
const sheetFood = document.querySelector("#sheetFood");
const captureSheet = document.querySelector("#captureSheet");
const closeSheet = document.querySelector("#closeSheet");
const confirmFood = document.querySelector("#confirmFood");
const noteText = document.querySelector("#noteText");
const todayKcal = document.querySelector("#todayKcal");
const targetKcal = document.querySelector("#targetKcal");
const thumbKcal = document.querySelector("#thumbKcal");
const sheetKcal = document.querySelector("#sheetKcal");
const kcalProgress = document.querySelector("#kcalProgress");
const logText = document.querySelector("#logText");
const activityButtons = document.querySelectorAll(".activity-tabs button");
const weightValue = document.querySelector("#weightValue");
const bmiValue = document.querySelector("#bmiValue");
const weightDelta = document.querySelector("#weightDelta");
const openWeightDialog = document.querySelector("#openWeightDialog");
const weightDialog = document.querySelector("#weightDialog");
const closeWeightDialog = document.querySelector("#closeWeightDialog");
const weightInput = document.querySelector("#weightInput");
const saveWeight = document.querySelector("#saveWeight");
const amountButtons = document.querySelectorAll(".amount-picker button");
const amountPicker = document.querySelector("#amountPicker");
const addWater = document.querySelector("#addWater");
const removeWater = document.querySelector("#removeWater");
const waterFill = document.querySelector("#waterFill");
const waterNow = document.querySelector("#waterNow");
const waterTotal = document.querySelector("#waterTotal");
const waterCount = document.querySelector("#waterCount");
const waterAverage = document.querySelector("#waterAverage");
const waterLast = document.querySelector("#waterLast");
const waterAmountHint = document.querySelector("#waterAmountHint");
const openTimeDialog = document.querySelector("#openTimeDialog");
const timeDialog = document.querySelector("#timeDialog");
const closeTimeDialog = document.querySelector("#closeTimeDialog");
const dateWheel = document.querySelector("#dateWheel");
const hourWheel = document.querySelector("#hourWheel");
const minuteWheel = document.querySelector("#minuteWheel");
const saveTime = document.querySelector("#saveTime");
const periodButtons = document.querySelectorAll(".period-tabs button");
const waterAverageCount = document.querySelector("#waterAverageCount");
const morningMl = document.querySelector("#morningMl");
const afternoonMl = document.querySelector("#afternoonMl");
const eveningMl = document.querySelector("#eveningMl");
const morningBar = document.querySelector("#morningBar");
const afternoonBar = document.querySelector("#afternoonBar");
const eveningBar = document.querySelector("#eveningBar");
const rulerTicks = document.querySelector("#rulerTicks");

let currentDate = "2026-06-29";
let currentImage = "";
let pendingKcal = 175;
let selectedWater = 100;
let waterMl = 900;
let waterLogs = [
  { amount: 250, date: "今天", hour: 8, minute: 20 },
  { amount: 250, date: "今天", hour: 11, minute: 10 },
  { amount: 300, date: "今天", hour: 14, minute: 40 },
  { amount: 100, date: "今天", hour: 15, minute: 36 },
];
let selectedWaterTime = { date: "今天", hour: 15, minute: 36 };
let waterPeriod = "week";

const profile = {
  heightCm: 171,
  weightKg: 83.7,
  activity: "high",
  weights: [84.2, 84.0, 84.1, 83.9, 83.8, 83.6, 83.7],
};

const activityLevels = {
  sedentary: { label: "久坐", factor: 26 },
  light: { label: "轻活动", factor: 28 },
  moderate: { label: "中等活动", factor: 30 },
  high: { label: "高活动", factor: 32 },
};

const dayPlans = {
  "2026-06-25": { kcal: 420, note: "早餐燕麦<br>午餐清淡<br>晚上少油", image: "", mealKcal: 220 },
  "2026-06-26": { kcal: 960, note: "外食日<br>记录了两餐<br>晚饭减量", image: "", mealKcal: 360 },
  "2026-06-27": { kcal: 1280, note: "周末正常吃<br>多走路<br>注意喝水", image: "", mealKcal: 510 },
  "2026-06-28": { kcal: 680, note: "轻食一天<br>水果加酸奶<br>晚餐待记录", image: "", mealKcal: 180 },
  "2026-06-29": { kcal: 175, note: "吊龙烤肉肩<br>测试用<br>吊龙猪肉铺", image: "", mealKcal: 175 },
  "2026-06-30": { kcal: 0, note: "这天还没有数据，请记录。", image: "", mealKcal: 0 },
  "2026-07-01": { kcal: 0, note: "这天还没有数据，请记录。", image: "", mealKcal: 0 },
  "2026-07-02": { kcal: 0, note: "这天还没有数据，请记录。", image: "", mealKcal: 0 },
  "2026-07-03": { kcal: 0, note: "这天还没有数据，请记录。", image: "", mealKcal: 0 },
  "2026-07-04": { kcal: 0, note: "这天还没有数据，请记录。", image: "", mealKcal: 0 },
};

function planForDate(date) {
  if (!dayPlans[date]) {
    dayPlans[date] = { kcal: 0, note: "这天还没有数据，请记录。", image: "", mealKcal: 0 };
  }
  return dayPlans[date];
}

const foodWords = [
  ["salad", 180],
  ["rice", 360],
  ["noodle", 520],
  ["cake", 430],
  ["pizza", 620],
  ["burger", 680],
  ["apple", 95],
  ["banana", 120],
  ["chicken", 460],
  ["fish", 310],
  ["pork", 175],
];

const waterHistory = {
  week: { days: 7, total: 6320, count: 28 },
  month: { days: 30, total: 27400, count: 126 },
  year: { days: 365, total: 318000, count: 1420 },
};

function showPage(name) {
  pages.forEach((page) => page.classList.toggle("active", page.dataset.page === name));
  navButtons.forEach((button) => button.classList.toggle("active", button.dataset.target === name));
}

function recommendedKcal(activity = profile.activity) {
  return Math.round(profile.weightKg * activityLevels[activity].factor);
}

function updateActivityTargets() {
  activityButtons.forEach((button) => {
    const key = button.dataset.activity;
    const value = recommendedKcal(key);
    button.querySelector("small").textContent = `${value}`;
    button.classList.toggle("active", key === profile.activity);
  });
  targetKcal.textContent = `${recommendedKcal()} kcal`;
}

function updateWeightInfo() {
  const heightM = profile.heightCm / 100;
  const bmi = profile.weightKg / (heightM * heightM);
  weightValue.textContent = profile.weightKg.toFixed(2);
  bmiValue.textContent = `BMI: ${bmi.toFixed(1)} ›`;
  const first = profile.weights[0];
  const last = profile.weights[profile.weights.length - 1];
  const delta = last - first;
  weightDelta.textContent = `近7天 ${delta >= 0 ? "+" : ""}${delta.toFixed(1)}kg`;
}

function updateCalories() {
  const plan = planForDate(currentDate);
  todayKcal.textContent = plan.kcal;
  thumbKcal.textContent = plan.mealKcal || pendingKcal;
  sheetKcal.textContent = pendingKcal;
  kcalProgress.style.width = `${Math.min(100, Math.round((plan.kcal / recommendedKcal()) * 100))}%`;
}

function renderDay() {
  const plan = planForDate(currentDate);
  logText.innerHTML = plan.note;
  updateCalories();

  if (plan.image) {
    foodPreview.src = plan.image;
    foodPreview.style.display = "block";
  } else {
    foodPreview.removeAttribute("src");
    foodPreview.style.display = "none";
  }
}

function selectDate(date, scroll = true) {
  currentDate = date;
  dateButtons.forEach((button) => button.classList.toggle("active", button.dataset.date === date));
  if (scroll) {
    document.querySelector(`.date-pill[data-date="${date}"]`)?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }
  renderDay();
}

function buildDateStrip() {
  const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const base = new Date(2026, 5, 29);
  dateStrip.innerHTML = "";
  for (let offset = -15; offset <= 15; offset += 1) {
    const date = new Date(base);
    date.setDate(base.getDate() + offset);
    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    const button = document.createElement("button");
    button.className = "date-pill";
    button.type = "button";
    button.dataset.date = key;
    button.innerHTML = `<span>${weekDays[date.getDay()]}</span><strong>${date.getDate()}</strong>`;
    button.addEventListener("click", () => selectDate(key));
    dateStrip.appendChild(button);
  }
  dateButtons = [...dateStrip.querySelectorAll(".date-pill")];
}

function estimateFromFile(file) {
  const name = file.name.toLowerCase();
  const hit = foodWords.find(([key]) => name.includes(key));
  if (hit) return hit[1];
  const sizeSignal = Math.min(360, Math.round(file.size / 5200));
  return Math.max(95, 160 + sizeSignal + Math.round(Math.random() * 90));
}

function updateFoodImage(url) {
  currentImage = url;
  [foodPreview, sheetFood].forEach((image) => {
    image.src = url;
    image.style.display = "block";
  });
}

function openCaptureSheet() {
  captureSheet.hidden = false;
}

function closeCaptureSheet() {
  captureSheet.hidden = true;
}

function updateWater() {
  waterMl = waterLogs.filter((log) => log.date === "今天").reduce((sum, log) => sum + log.amount, 0);
  const percent = Math.max(0, Math.min(100, Math.round((waterMl / 2000) * 100)));
  waterFill.style.height = `${Math.max(12, percent)}%`;
  document.documentElement.style.setProperty("--water-marker", `${100 - percent}%`);
  document.documentElement.style.setProperty("--water-marker-top", percent >= 100 ? "15px" : `${100 - percent}%`);
  document.documentElement.style.setProperty("--water-marker-shift", percent >= 100 ? "0" : "-50%");
  document.documentElement.style.setProperty("--water-surface", `${326 - (percent / 100) * 210}px`);
  waterNow.textContent = `${waterMl}ml`;
  updateRulerTicks(percent);
  waterTotal.textContent = waterMl;
  const todayLogs = waterLogs.filter((log) => log.date === "今天");
  waterCount.textContent = todayLogs.length;

  const period = waterHistory[waterPeriod];
  const periodTotal = period.total + waterMl;
  const periodCount = period.count + todayLogs.length;
  waterAverage.textContent = Math.round(periodTotal / period.days);
  waterAverageCount.textContent = Math.round(periodCount / period.days);
  updateWaterSegments(todayLogs);
}

function buildRulerTicks() {
  rulerTicks.innerHTML = "";
  for (let index = 0; index <= 20; index += 1) {
    const tick = document.createElement("i");
    if (index % 5 === 0) tick.className = "major";
    else if (index % 2 === 0) tick.className = "mid";
    rulerTicks.appendChild(tick);
  }
}

function updateRulerTicks(percent) {
  const ticks = [...rulerTicks.children];
  const activeCount = Math.round((percent / 100) * (ticks.length - 1));
  ticks.forEach((tick, index) => {
    const fromBottom = ticks.length - 1 - index;
    tick.classList.toggle("active", fromBottom <= activeCount);
  });
}

function waterHint(amount) {
  if (amount <= 50) return "约两口水";
  if (amount <= 100) return "约1个纸杯";
  if (amount <= 250) return "约半瓶矿泉水";
  if (amount <= 500) return "一瓶矿泉水";
  if (amount <= 800) return "两听可乐";
  return "两瓶矿泉水";
}

function selectWaterAmount(button, scroll = true) {
  amountButtons.forEach((item) => {
    item.classList.remove("active");
    item.querySelector("span")?.remove();
  });
  button.classList.add("active");
  selectedWater = Number.parseInt(button.dataset.amount || button.textContent, 10);
  const unit = document.createElement("span");
  unit.textContent = "ml";
  button.appendChild(unit);
  waterAmountHint.textContent = waterHint(selectedWater);
  if (scroll) {
    button.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }
}

function formatSelectedWaterTime() {
  const hour = String(selectedWaterTime.hour).padStart(2, "0");
  const minute = String(selectedWaterTime.minute).padStart(2, "0");
  return `${selectedWaterTime.date} ${hour}:${minute}`;
}

function updateWaterSegments(logs) {
  const segments = logs.reduce((acc, log) => {
    if (log.hour < 12) acc.morning += log.amount;
    else if (log.hour < 18) acc.afternoon += log.amount;
    else acc.evening += log.amount;
    return acc;
  }, { morning: 0, afternoon: 0, evening: 0 });
  const max = Math.max(segments.morning, segments.afternoon, segments.evening, 1);
  morningMl.textContent = `${segments.morning}ml`;
  afternoonMl.textContent = `${segments.afternoon}ml`;
  eveningMl.textContent = `${segments.evening}ml`;
  morningBar.style.width = `${Math.round((segments.morning / max) * 100)}%`;
  afternoonBar.style.width = `${Math.round((segments.afternoon / max) * 100)}%`;
  eveningBar.style.width = `${Math.round((segments.evening / max) * 100)}%`;
}

function buildWheel(column, values, current, formatter = (value) => value) {
  column.innerHTML = "";
  values.forEach((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.value = value;
    button.textContent = formatter(value);
    button.classList.toggle("active", String(value) === String(current));
    button.addEventListener("click", () => {
      [...column.children].forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      button.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    column.appendChild(button);
  });
  column.onscroll = () => {
    window.requestAnimationFrame(() => {
      const center = column.getBoundingClientRect().top + column.clientHeight / 2;
      let nearest = null;
      let nearestDistance = Number.POSITIVE_INFINITY;
      [...column.children].forEach((button) => {
        const rect = button.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - center);
        if (distance < nearestDistance) {
          nearest = button;
          nearestDistance = distance;
        }
      });
      if (nearest) {
        [...column.children].forEach((item) => item.classList.toggle("active", item === nearest));
      }
    });
  };
}

function selectedWheelValue(column) {
  return column.querySelector(".active")?.dataset.value;
}

function waterDateOptions() {
  const result = [];
  const base = new Date(2026, 5, 29);
  for (let offset = 0; offset < 30; offset += 1) {
    const date = new Date(base);
    date.setDate(base.getDate() - offset);
    if (offset === 0) result.push("今天");
    else if (offset === 1) result.push("昨天");
    else result.push(`${date.getMonth() + 1}月${date.getDate()}日`);
  }
  return result;
}

function openWaterTimeWheel() {
  buildWheel(dateWheel, waterDateOptions(), selectedWaterTime.date);
  buildWheel(hourWheel, Array.from({ length: 24 }, (_, index) => index), selectedWaterTime.hour, (value) => `${String(value).padStart(2, "0")}时`);
  buildWheel(minuteWheel, Array.from({ length: 60 }, (_, index) => index), selectedWaterTime.minute, (value) => `${String(value).padStart(2, "0")}分`);
  timeDialog.hidden = false;
  [dateWheel, hourWheel, minuteWheel].forEach((column) => {
    column.querySelector(".active")?.scrollIntoView({ block: "center" });
  });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.target));
});

dateStrip.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
    dateStrip.scrollLeft += event.deltaY;
  }
}, { passive: true });

activityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    profile.activity = button.dataset.activity;
    updateActivityTargets();
    updateCalories();
  });
});

openWeightDialog.addEventListener("click", () => {
  weightInput.value = profile.weightKg.toFixed(1);
  weightDialog.hidden = false;
  weightInput.focus();
});

closeWeightDialog.addEventListener("click", () => {
  weightDialog.hidden = true;
});

saveWeight.addEventListener("click", () => {
  const nextWeight = Number.parseFloat(weightInput.value);
  if (!Number.isFinite(nextWeight) || nextWeight < 30 || nextWeight > 220) return;
  profile.weightKg = nextWeight;
  profile.weights = [...profile.weights.slice(1), nextWeight];
  updateWeightInfo();
  updateActivityTargets();
  updateCalories();
  weightDialog.hidden = true;
});

cameraButtons.forEach((button) => {
  button.addEventListener("click", () => foodInput.click());
});

foodInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;
  pendingKcal = estimateFromFile(file);
  updateFoodImage(URL.createObjectURL(file));
  updateCalories();
  openCaptureSheet();
});

closeSheet.addEventListener("click", closeCaptureSheet);

confirmFood.addEventListener("click", () => {
  const plan = planForDate(currentDate);
  const note = noteText.value.trim() || "测试用";
  plan.kcal += pendingKcal;
  plan.mealKcal = pendingKcal;
  plan.image = currentImage;
  plan.note = `吊龙烤肉肩<br>${note}<br>自动识别食物主体`;
  renderDay();
  closeCaptureSheet();
  showPage("today");
});

amountButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectWaterAmount(button);
  });
});

amountPicker.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
    amountPicker.scrollLeft += event.deltaY;
  }
}, { passive: true });

addWater.addEventListener("click", () => {
  waterLogs.push({ amount: selectedWater, ...selectedWaterTime });
  updateWater();
});

removeWater.addEventListener("click", () => {
  const index = waterLogs.findLastIndex((log) => log.date === "今天");
  if (index >= 0) waterLogs.splice(index, 1);
  updateWater();
});

openTimeDialog.addEventListener("click", () => {
  openWaterTimeWheel();
});

closeTimeDialog.addEventListener("click", () => {
  timeDialog.hidden = true;
});

saveTime.addEventListener("click", () => {
  selectedWaterTime = {
    date: selectedWheelValue(dateWheel) || "今天",
    hour: Number.parseInt(selectedWheelValue(hourWheel), 10) || 0,
    minute: Number.parseInt(selectedWheelValue(minuteWheel), 10) || 0,
  };
  openTimeDialog.textContent = `${formatSelectedWaterTime()}⌄`;
  timeDialog.hidden = true;
});

periodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    waterPeriod = button.dataset.period;
    periodButtons.forEach((item) => item.classList.toggle("active", item === button));
    updateWater();
  });
});

updateWeightInfo();
updateActivityTargets();
buildDateStrip();
selectDate(currentDate, false);
document.querySelector(`.date-pill[data-date="${currentDate}"]`)?.scrollIntoView({ inline: "center", block: "nearest" });
selectWaterAmount(document.querySelector('.amount-picker button[data-amount="100"]'), false);
openTimeDialog.textContent = `${formatSelectedWaterTime()}⌄`;
buildRulerTicks();
updateWater();
