// ดึง element ต่าง ๆ จาก DOM
let redBtn = document.getElementById('redBtn');
let greenBtn = document.getElementById('greenBtn');
let alertBox = document.getElementById('alertBox');
let alertContent = document.getElementById('alertContent');
let provinceDataDiv = document.getElementById('provinceData');
let toggleAlertBtn = document.getElementById('toggleAlertBtn');

// สร้างแผนที่ด้วย Leaflet และตั้งค่าเริ่มต้น
let map = L.map('map').setView([19, 99], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ข้อมูล 5 จังหวัด (เหมือนกันทั้ง red และ green)
const provincesData = [
  {
    name: "Chiang Mai",
    latlng: [18.79, 98.98],
    red: { riskLevel: "D", riskDesc: "High Risk", temperature: 39, humidity: 21, windSpeed: 18, rainfall: 30, hotspotCount: 15, popup: "Chiang Mai - High Risk (Level D)" },
    green: { forestLevel: "C", forestDesc: "Moderate Forest", temperature: 32, humidity: 55, windSpeed: 10, rainfall: 80, popup: "Chiang Mai - Moderate Forest (Level C)" }
  },
  {
    name: "Lampang",
    latlng: [18.29, 99.49],
    red: { riskLevel: "B", riskDesc: "Moderate Risk", temperature: 38, humidity: 25, windSpeed: 15, rainfall: 40, hotspotCount: 10, popup: "Lampang - Moderate Risk (Level B)" },
    green: { forestLevel: "B", forestDesc: "Good Forest", temperature: 33, humidity: 60, windSpeed: 12, rainfall: 90, popup: "Lampang - Good Forest (Level B)" }
  },
  {
    name: "Phrae",
    latlng: [18.15, 100.14],
    red: { riskLevel: "E", riskDesc: "Very High Risk", temperature: 40, humidity: 18, windSpeed: 20, rainfall: 25, hotspotCount: 20, popup: "Phrae - Very High Risk (Level E)" },
    green: { forestLevel: "D", forestDesc: "Fair Forest", temperature: 34, humidity: 50, windSpeed: 13, rainfall: 70, popup: "Phrae - Fair Forest (Level D)" }
  },
  {
    name: "Chiang Rai",
    latlng: [19.91, 99.83],
    red: { riskLevel: "C", riskDesc: "High Risk", temperature: 37, humidity: 23, windSpeed: 16, rainfall: 35, hotspotCount: 12, popup: "Chiang Rai - High Risk (Level C)" },
    green: { forestLevel: "B", forestDesc: "Good Forest", temperature: 31, humidity: 58, windSpeed: 11, rainfall: 85, popup: "Chiang Rai - Good Forest (Level B)" }
  },
  {
    name: "Phayao",
    latlng: [19.16, 99.89],
    red: { riskLevel: "A", riskDesc: "Moderate Risk", temperature: 36, humidity: 27, windSpeed: 14, rainfall: 45, hotspotCount: 8, popup: "Phayao - Moderate Risk (Level A)" },
    green: { forestLevel: "A", forestDesc: "Excellent Forest", temperature: 30, humidity: 65, windSpeed: 9, rainfall: 95, popup: "Phayao - Excellent Forest (Level A)" }
  }
];

// ตัวแปรเก็บ markers
let redMarkers = [];
let greenMarkers = [];

// ฟังก์ชันคืนค่าสีตามระดับความเสี่ยง (A-F)
function getRiskColor(level) {
  switch (level) {
    case "A": return "#ffcccc";
    case "B": return "#ff6666";
    case "C": return "#ff3300";
    case "D": return "#cc0000";
    case "E": return "#990000";
    case "F": return "#660000";
    default: return "#ff0000";
  }
}

// ฟังก์ชันคืนค่าสีสำหรับ green zone (forest level)
function getForestColor(level) {
  switch (level) {
    case "A": return "#2d6514";
    case "B": return "#7c9d39";
    case "C": return "#ffc746";
    case "D": return "#faad00";
    case "E": return "#aa4cda";
    case "F": return "#8f3432";
    default: return "#74c476";
  }
}

// สร้าง markers สำหรับ red zone
function addRedMarkers() {
  redMarkers.forEach(m => map.removeLayer(m));
  redMarkers = [];

  provincesData.forEach(prov => {
    const marker = L.circle(prov.latlng, {
      radius: 10000,
      color: getRiskColor(prov.red.riskLevel),
      fillColor: getRiskColor(prov.red.riskLevel),
      fillOpacity: 0.7,
      weight: 2,
    }).addTo(map).bindPopup(prov.red.popup);
    redMarkers.push(marker);
  });
}

// สร้าง markers สำหรับ green zone
function addGreenMarkers() {
  greenMarkers.forEach(m => map.removeLayer(m));
  greenMarkers = [];

  provincesData.forEach(prov => {
    const marker = L.circle(prov.latlng, {
      radius: 10000,
      color: getForestColor(prov.green.forestLevel),
      fillColor: getForestColor(prov.green.forestLevel),
      fillOpacity: 0.7,
      weight: 2,
    }).addTo(map).bindPopup(prov.green.popup);
    greenMarkers.push(marker);
  });
}


// แสดงข้อมูลจังหวัดตามโซนที่เลือก
function showProvinceData(zone) {
  provinceDataDiv.innerHTML = ""; // เคลียร์ข้อมูลเก่า

  if (zone === "red") {
    provincesData.forEach(prov => {
      provinceDataDiv.innerHTML += `
        <div class="card">
          <h3>${prov.name}</h3>
          <p><strong>🔥 Risk Level:</strong> ${prov.red.riskLevel} (${prov.red.riskDesc})</p>
          <p>🌡️ Temp: ${prov.red.temperature} °C</p>
          <p>💧 Humidity: ${prov.red.humidity}%</p>
          <p>💨 Wind Speed: ${prov.red.windSpeed} km/h</p>
          <p>🔥 Hotspots: ${prov.red.hotspotCount}</p>
        </div>
      `;
    });
  } else {
    provincesData.forEach(prov => {
      provinceDataDiv.innerHTML += `
        <div class="card">
          <h3>${prov.name}</h3>
          <p><strong>🌲 Forest Level:</strong> ${prov.green.forestLevel} (${prov.green.forestDesc})</p>
          <p>🌡️ Temp: ${prov.green.temperature} °C</p>
          <p>💧 Humidity: ${prov.green.humidity}%</p>
          <p>💨 Wind Speed: ${prov.green.windSpeed} km/h</p>
          <p>🌧️ Rainfall: ${prov.green.rainfall} mm</p>
        </div>
      `;
    });
  }
}



// ฟังก์ชันแจ้งเตือนระดับความเสี่ยงต่ำกว่า C ใน red zone
function updateAlert(zone) {
  if (zone === "red") {
    let alertMsg = "";
    provincesData.forEach(prov => {
      const level = prov.red.riskLevel.charCodeAt(0);
      if (level > "C".charCodeAt(0)) {
        alertMsg += `<p>⚠️ <strong>Alert:</strong> ${prov.name} has high fire risk (${prov.red.riskLevel}) 🔥</p>`;
      }
    });
    alertContent.innerHTML = alertMsg || "<p>⚠️ No Alert.</p>";
  } else {
    alertContent.innerHTML = "<p>⚠️ Alert: Phrae Low abundance is concerning.</p>";
  }
}

// ตัวแปรเก็บกราฟ
let temperatureChart, humidityChart, hotspotChart;

// ฟังก์ชันสร้างกราฟ Chart.js
function initCharts(zone) {
  let labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let temperatureData = [], humidityData = [], hotspotData = [];

  if (zone === "red") {
    provincesData.forEach(prov => {
      temperatureData.push(prov.red.temperature);
      humidityData.push(prov.red.humidity);
      hotspotData.push(prov.red.hotspotCount);
    });
  } else {
    provincesData.forEach(prov => {
      temperatureData.push(prov.green.temperature);
      humidityData.push(prov.green.humidity);
      hotspotData.push(prov.green.rainfall);
    });
  }

  let avgTemp = temperatureData.reduce((a, b) => a + b, 0) / temperatureData.length;
  let avgHumidity = humidityData.reduce((a, b) => a + b, 0) / humidityData.length;
  let avgHotspot = hotspotData.reduce((a, b) => a + b, 0) / hotspotData.length;

  let tempDataset = Array(7).fill().map(() => avgTemp + (Math.random() * 2 - 1));
  let humDataset = Array(7).fill().map(() => avgHumidity + (Math.random() * 5 - 2.5));
  let hotDataset = Array(7).fill().map(() => avgHotspot + (Math.random() * 3 - 1.5));

  if (temperatureChart) temperatureChart.destroy();
  if (humidityChart) humidityChart.destroy();
  if (hotspotChart) hotspotChart.destroy();

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: window.devicePixelRatio || 1,
    plugins: {
      legend: {
        labels: {
          color: "#333",
          font: { size: 20, family: "Arial, sans-serif", weight: 'bold' }  // ฟอนต์ใหญ่และหนาขึ้น
        }
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "#ccc",
        borderWidth: 1,
        bodyFont: { size: 18, family: "Arial, sans-serif", weight: 'bold' },
        titleFont: { size: 20, family: "Arial, sans-serif", weight: 'bold' }
      }
    },
    scales: {
      x: {
        ticks: { color: "#555", font: { size: 18, family: "Arial, sans-serif", weight: 'bold' } },
        grid: { color: "rgba(200,200,200,0.2)" }
      },
      y: {
        ticks: { color: "#555", font: { size: 18, family: "Arial, sans-serif", weight: 'bold' } },
        grid: { color: "rgba(200,200,200,0.2)" }
      }
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 4  // เส้นหนาขึ้น
      },
      point: {
        radius: 6,
        hoverRadius: 8,
        backgroundColor: "#fff",
        borderWidth: 3
      }
    }
  };
  
  
  const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
  temperatureChart = new Chart(ctxTemp, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Temperature (°C)',
        data: tempDataset,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        pointBorderColor: 'rgba(255, 99, 132, 1)',
        pointHoverBackgroundColor: 'rgba(255, 99, 132, 1)',
      }]
    },
    options: commonOptions
  });

  const ctxHum = document.getElementById('humidityChart').getContext('2d');
  humidityChart = new Chart(ctxHum, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Humidity (%)',
        data: humDataset,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        pointBorderColor: 'rgba(54, 162, 235, 1)',
        pointHoverBackgroundColor: 'rgba(54, 162, 235, 1)',
      }]
    },
    options: commonOptions
  });

  const ctxHot = document.getElementById('hotspotChart').getContext('2d');
  hotspotChart = new Chart(ctxHot, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: zone === "red" ? 'Hotspots' : 'Rainfall (mm)',
        data: hotDataset,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.1)',
        pointBorderColor: 'rgba(255, 206, 86, 1)',
        pointHoverBackgroundColor: 'rgba(255, 206, 86, 1)',
      }]
    },
    options: commonOptions
  });
} 

// ฟังก์ชันสลับโซน Red / Green
function switchZone(zone) {
  if (zone === "red") {
    redBtn.classList.add("active");
    greenBtn.classList.remove("active");
    addRedMarkers();
    greenMarkers.forEach(m => map.removeLayer(m));
  } else {
    greenBtn.classList.add("active");
    redBtn.classList.remove("active");
    addGreenMarkers();
    redMarkers.forEach(m => map.removeLayer(m));
  }
  showProvinceData(zone);
  updateAlert(zone);
  initCharts(zone);
  // ซูมแผนที่ไปยังภาคเหนือ (เฉลี่ยจุด)
  map.setView([19, 99], 7);
}

// Event listener สำหรับปุ่มเลือกโซน
redBtn.addEventListener("click", () => switchZone("red"));
greenBtn.addEventListener("click", () => switchZone("green"));

// ฟังก์ชัน toggle การแสดง/ซ่อน alert box
function toggleAlert() {
  if (alertContent.classList.contains("hidden")) {
    alertContent.classList.remove("hidden");
  } else {
    alertContent.classList.add("hidden");
  }
}

