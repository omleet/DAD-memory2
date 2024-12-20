<script setup>
import { defineProps, ref, computed } from 'vue';
import { Chart } from 'highcharts-vue';
import Highcharts from "highcharts";

// it is necessary to set the decimal point and thousands separator
Highcharts.setOptions({
  lang: {
    decimalPoint: ".",
    thousandsSep: ",",
  },
});

// Check if dark mode is enabled using media query
const isDarkMode = computed(() => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

const props = defineProps({
    stats: Array,
})

const options = ref({
    chart: {
        type: "area",
        backgroundColor: isDarkMode.value ? "#1f2937" : "#f4f7fc",  // Light background in light mode, dark in dark mode
        borderRadius: 10,  // Rounded corners for the chart
        borderWidth: 1,
        borderColor: isDarkMode.value ? "#555" : "#ccc",  // Soft border color
    },
    title: {
        text: "Games Played by Week",  // Alterado para 'Games Played by Week'
        style: {
            color: isDarkMode.value ? "#fff" : "#333",  // Title color
            fontSize: '20px',
            fontWeight: 'bold',
            letterSpacing: '0.5px',  // Add spacing to letters
        },
    },
    xAxis: {
        categories: props.stats.map((item) => `Week ${item.week} - ${item.year}`),
        labels: {
            style: {
                color: isDarkMode.value ? "#fff" : "#333",  // Axis label color
                fontSize: '12px',  // Slightly smaller font size
                fontWeight: 'bold',  // Make labels bold
            },
            rotation: -45,  // Tilt labels for better readability
            align: 'right',  // Align labels to the right
        },
        lineColor: isDarkMode.value ? "#555" : "#ccc",  // Axis line color
        tickWidth: 0,  // Remove axis ticks for a cleaner look
        gridLineWidth: 1,  // Thin grid lines for neatness
        gridLineColor: isDarkMode.value ? "#444" : "#ddd",  // Subtle grid line color
    },
    yAxis: {
        title: {
            text: "Total Games",
            style: {
                color: isDarkMode.value ? "#fff" : "#333",
                fontWeight: 'bold',  // Make the title bold
                fontSize: '14px',
            },
        },
        labels: {
            style: {
                color: isDarkMode.value ? "#fff" : "#333",
                fontSize: '12px',
                fontWeight: 'bold',
            },
        },
        lineColor: isDarkMode.value ? "#555" : "#ccc",
        gridLineColor: isDarkMode.value ? "#444" : "#eee",  // Soft grid line color
        gridLineWidth: 1,  // Thin grid lines for a clean look
    },
    series: [
        {
            name: "Games",
            data: props.stats.map((item) => item.total_games),
            color: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },  // Gradiente da esquerda para a direita
                stops: [
                    [0, '#2ecc71'], // Verde claro no início
                    [1, '#27ae60'], // Verde escuro no final
                ]
            },
            lineWidth: 3,
            fillOpacity: 0.2,
            marker: {
                symbol: 'circle',
                radius: 4,
                fillColor: 'url(#grad)',  // Usando o gradiente
                lineWidth: 2,
                lineColor: '#27ae60',  // Cor da borda do marcador
            },
        },
    ],
    tooltip: {
        backgroundColor: isDarkMode.value ? "#333" : "#fff",  // Tooltip background color
        style: {
            color: isDarkMode.value ? "#fff" : "#000",  // Tooltip text color
            fontSize: '14px',
            fontWeight: 'bold',  // Bold text for tooltips
        },
        borderWidth: 1,  // Slight border around the tooltip
        borderColor: isDarkMode.value ? "#2ecc71" : "#27ae60",  // Border color based on mode
        shadow: true,  // Add subtle shadow for depth
    },
    plotOptions: {
        area: {
            marker: {
                enabled: true,  // Show markers for each data point
                lineWidth: 2,  // Marker border width
            },
        },
    },
    credits: {
        enabled: false,  // Hide the Highcharts credits logo
    },
})
</script>

<template>
    <p v-if="stats.length == 0" class="font-bold text-center">
            No registered games on the platform yet.
    </p>
    <Chart v-else :options="options" />
</template>
