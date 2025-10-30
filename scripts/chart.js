function parseCSV(text) {
    return text
        .trim()
        .split("\n")
        .map((line) => line.split(",").map((cell) => cell.trim()));
}

export async function renderChart(container, file) {
    container.innerHTML = "";

    const canvas = document.createElement("canvas");

    container.appendChild(canvas);

    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length < 2 || rows[0].length < 2) {
        container.innerHTML =
            "<p>Недостаточно данных для построения графика.</p>";
        return;
    }

    const headers = rows[0];
    const labels = rows.slice(1).map((row) => row[0]);

    const datasets = headers.slice(1).map((colName, colIndex) => {
        const data = rows.slice(1).map((row) => parseFloat(row[colIndex + 1]));
        return {
            label: colName,
            data,
            fill: false,
            borderColor: "#373062",
            tension: 0.1,
        };
    });

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true,
                        },
                        mode: "x",
                    },
                    pan: {
                        enabled: false,
                    },
                },
            },
        },
    });

    container.style.height = "600px";
}
