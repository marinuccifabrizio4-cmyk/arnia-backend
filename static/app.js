const API_URL = "/data";

let tempChart, humChart, weightChart;

// -------------------- FETCH DATA --------------------
async function fetchData() {
    const res = await fetch(API_URL);
    return await res.json();
}

// -------------------- PREPARE DATA --------------------
function prepareData(data) {
    return {
        labels: data.map(d =>
            new Date(d.timestamp * 1000).toLocaleTimeString()
        ),
        temperature: data.map(d => d.temperature),
        humidity: data.map(d => d.humidity),
        weight: data.map(d => d.weight)
    };
}

// -------------------- CREATE CHART --------------------
function createChart(ctx, label, values, labels) {
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: values,
                borderWidth: 2
            }]
        }
    });
}

// -------------------- LIVE VALUES --------------------
function updateLiveValues(latest) {
    document.getElementById("tempValue").innerText =
        latest.temperature + " C";

    document.getElementById("humValue").innerText =
        latest.humidity + " %";

    document.getElementById("weightValue").innerText =
        latest.weight + " kg";
}

// -------------------- CONNECTION STATUS --------------------
function updateConnectionStatus(connected) {
    const status = document.getElementById("status");

    if (connected) {
        status.innerText = "Connesso con arnia";
        status.style.backgroundColor = "green";
    } else {
        status.innerText = "Disconnesso";
        status.style.backgroundColor = "red";
    }
}

// -------------------- INIT --------------------
async function init() {
    const data = await fetchData();

    if (data.length === 0) return;

    const prepared = prepareData(data);
    const latest = data[data.length - 1];

    updateLiveValues(latest);
    updateConnectionStatus(true);

    tempChart = createChart(
        document.getElementById("tempChart"),
        "Temperatura (°C)",
        prepared.temperature,
        prepared.labels
    );

    humChart = createChart(
        document.getElementById("humChart"),
        "Umidita'(%)",
        prepared.humidity,
        prepared.labels
    );

    weightChart = createChart(
        document.getElementById("weightChart"),
        "Peso (kg)",
        prepared.weight,
        prepared.labels
    );
}

// -------------------- UPDATE LOOP --------------------
async function updateCharts() {
    try {
        const data = await fetchData();

        const prepared = prepareData(data);
        const latest = data[data.length - 1];

        updateLiveValues(latest);
        updateConnectionStatus(true);

        tempChart.data.labels = prepared.labels;
        tempChart.data.datasets[0].data = prepared.temperature;
        tempChart.update();

        humChart.data.labels = prepared.labels;
        humChart.data.datasets[0].data = prepared.humidity;
        humChart.update();

        weightChart.data.labels = prepared.labels;
        weightChart.data.datasets[0].data = prepared.weight;
        weightChart.update();

    } catch (err) {
        updateConnectionStatus(false);
        console.error(err);
    }
}

// -------------------- START --------------------
init();
setInterval(updateCharts, 5000);
