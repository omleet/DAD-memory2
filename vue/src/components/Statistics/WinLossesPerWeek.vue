<script setup>
  import { defineProps, ref, onMounted, computed } from 'vue';
  import { Chart } from 'highcharts-vue';
  import Highcharts from 'highcharts';

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
    stats: {
      type: Array,
      required: true
    }
  });

  // Estado reativo para armazenar a configuração do gráfico
  const chartOptions = ref({});

  onMounted(() => {
    if (props.stats && props.stats.length > 0) {
      // Arrays para armazenar os dados de vitórias, derrotas e semanas
      const winsData = [];
      const lossesData = [];
      const categories = [];

      // Processa os dados recebidos
      props.stats.forEach(item => {
        const weekLabel = `Week ${item.week} - ${item.year}`; // Formata o label da semana
        categories.push(weekLabel);  // Semana no eixo X
        winsData.push(parseInt(item.total_wins));  // Total de vitórias
        lossesData.push(parseInt(item.total_losses));  // Total de derrotas
      });

      // Configuração do gráfico
      chartOptions.value = {
        chart: {
          type: 'column', // Tipo de gráfico (coluna)
          backgroundColor: isDarkMode.value ? "#1f2937" : "#f4f7fc",  // Light background in light mode, dark in dark mode
          borderRadius: 10,  // Rounded corners for the chart
          borderWidth: 1,
          borderColor: isDarkMode.value ? "#555" : "#ccc",  // Soft border color
          animation: {
            duration: 1000 // Animação para transição suave
          },
        },
        title: {
          text: 'Wins and Losses per Week',
          style: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: isDarkMode.value ? "#fff" : "#333"  // Título
          }
        },
        subtitle: {
          text: 'Comparison of wins and losses per week.',
          style: {
            fontSize: '14px',
            color: isDarkMode.value ? "#ccc" : "#666"
          }
        },
        xAxis: {
          categories: categories, // Semanas no eixo X
          title: {
            text: 'Week',
            style: {
              fontSize: '16px',
              color: isDarkMode.value ? "#fff" : "#333"
            }
          },
          labels: {
            style: {
              fontSize: '12px',
              color: isDarkMode.value ? "#fff" : "#333"
            },
            rotation: -45,  // Inclina as labels para melhor leitura
            align: 'right'  // Alinha as labels à direita
          },
          lineColor: isDarkMode.value ? "#555" : "#ccc",  // Eixo X
          tickWidth: 0,  // Remove os ticks para uma aparência mais limpa
          gridLineWidth: 1,  // Linhas finas de grid
          gridLineColor: isDarkMode.value ? "#444" : "#ddd",  // Cor das linhas de grid
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Total Games',
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: isDarkMode.value ? "#fff" : "#333"
            }
          },
          labels: {
            style: {
              fontSize: '12px',
              fontWeight: 'bold',
              color: isDarkMode.value ? "#fff" : "#333"
            }
          },
          lineColor: isDarkMode.value ? "#555" : "#ccc",
          gridLineColor: isDarkMode.value ? "#444" : "#ddd",  // Cor das linhas de grid
          gridLineWidth: 1,  // Linhas finas de grid
        },
        tooltip: {
          shared: true,
          valueSuffix: ' games',
          backgroundColor: isDarkMode.value ? "#333" : "#fff",  // Cor de fundo do tooltip
          style: {
            color: isDarkMode.value ? "#fff" : "#000",  // Cor do texto do tooltip
            fontSize: '14px',
            fontWeight: 'bold',  // Texto em negrito no tooltip
          },
          borderWidth: 1,
          borderColor: isDarkMode.value ? "#2ecc71" : "#27ae60",  // Cor da borda do tooltip
          shadow: true,  // Adiciona sombra para profundidade
        },
        plotOptions: {
          column: {
            stacking: 'normal', // Empilhar as barras
            pointPadding: 0.1,  // Espaçamento entre as barras
            borderRadius: 5,  // Bordas arredondadas para as barras
            borderWidth: 1,  // Borda para as barras
            shadow: true,  // Sombra para as barras
          }
        },
        series: [
          {
            name: 'Wins',
            data: winsData,
            color: '#28a745',  // Cor verde para vitórias
            borderColor: '#fff',  // Cor da borda das barras
            borderWidth: 2
          },
          {
            name: 'Losses',
            data: lossesData,
            color: '#dc3545',  // Cor vermelha para derrotas
            borderColor: '#fff',  // Cor da borda das barras
            borderWidth: 2
          }
        ],
        credits: {
          enabled: false,  // Desabilitar a logo do Highcharts
        },
        legend: {
          align: 'center',  // Alinhamento central da legenda
          verticalAlign: 'bottom',  // Posição da legenda na parte inferior
          itemStyle: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: isDarkMode.value ? "#fff" : "#333",
          }
        }
      };
    }
  });
</script>

<template>
  <div v-if="props.stats && props.stats.length > 0">
    <!-- Se houver dados, renderiza o gráfico -->
    <Chart :options="chartOptions" />
  </div>
  <div v-else>
    <!-- Se não houver dados, mostra uma mensagem -->
    <p class="font-bold text-center">No data available for wins and losses per week.</p>
  </div>
</template>
