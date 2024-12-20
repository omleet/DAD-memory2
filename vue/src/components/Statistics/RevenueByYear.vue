<template>
    <div>
      <!-- Verifique se os dados estão presentes -->
      <div v-if="stats && stats.length > 0">
        <Chart :options="chartOptions" />
      </div>
      <div v-else>
        <p class="font-bold text-center">No data available for the graph.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, ref, onMounted, computed } from 'vue';
  import { Chart } from 'highcharts-vue';
  import Highcharts from 'highcharts';
  
  // Definir separadores de milhar e ponto decimal
  Highcharts.setOptions({
    lang: {
      decimalPoint: '.',
      thousandsSep: ',',
    },
  });
  
  // Verificar se o modo escuro está ativado
  const isDarkMode = computed(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const props = defineProps({
    stats: {
      type: Array,
      required: true,
    },
  });
  
  const chartOptions = ref({});
  
  onMounted(() => {
    if (props.stats && props.stats.length > 0) {
      const years = [];
      const revenues = [];
  
      // Transformando os dados para o formato correto para o gráfico
      props.stats.forEach(item => {
        years.push(item.year); // Ano no eixo X
        revenues.push(parseFloat(item.total_revenue)); // Converte a receita para número (float)
      });
  
      // Definindo as opções do gráfico
      chartOptions.value = {
        chart: {
          type: 'column',
          backgroundColor: isDarkMode.value ? '#1f2937' : '#f4f7fc', // Fundo ajustado conforme o modo
          borderRadius: 10, // Bordas arredondadas
          borderWidth: 1,
          borderColor: isDarkMode.value ? '#555' : '#ccc', // Cor da borda
          animation: {
            duration: 1000, // Duração da animação
          },
        },
        title: {
          text: 'Revenue by Year',
          style: {
            color: isDarkMode.value ? '#fff' : '#333', // Cor do título
            fontSize: '20px',
            fontWeight: 'bold',
            letterSpacing: '0.5px', // Espaçamento entre as letras
          },
        },
        xAxis: {
          categories: years, // Anos no eixo X
          title: {
            text: 'Year',
          },
          labels: {
            style: {
              color: isDarkMode.value ? '#fff' : '#333', // Cor dos rótulos do eixo X
              fontSize: '12px',
              fontWeight: 'bold', // Rótulos em negrito
            },
            rotation: -45, // Rotaciona as labels para melhor legibilidade
            align: 'right', // Alinha as labels à direita
          },
          lineColor: isDarkMode.value ? '#555' : '#ccc', // Cor da linha do eixo X
          tickWidth: 0, // Remove os ticks do eixo X
          gridLineWidth: 1, // Linhas de grade finas
          gridLineColor: isDarkMode.value ? '#444' : '#ddd', // Cor das linhas de grade
        },
        yAxis: {
          title: {
            text: 'Total Revenue (€)',
            style: {
              color: isDarkMode.value ? '#fff' : '#333', // Cor do título do eixo Y
              fontWeight: 'bold',
              fontSize: '14px',
            },
          },
          labels: {
            style: {
              color: isDarkMode.value ? '#fff' : '#333', // Cor dos rótulos do eixo Y
              fontSize: '12px',
              fontWeight: 'bold',
            },
            formatter: function () {
              return this.value + '€'; // Adiciona o símbolo de euro ao valor do eixo Y
            },
          },
          lineColor: isDarkMode.value ? '#555' : '#ccc', // Cor da linha do eixo Y
          gridLineColor: isDarkMode.value ? '#444' : '#eee', // Cor das linhas de grade
          gridLineWidth: 1, // Linhas de grade finas
        },
        series: [
          {
            name: 'Revenue',
            data: revenues,
            color: '#4CAF50', // Cor da série de dados
          },
        ],
        tooltip: {
          backgroundColor: isDarkMode.value ? '#333' : '#fff', // Cor de fundo da tooltip
          style: {
            color: isDarkMode.value ? '#fff' : '#000', // Cor do texto da tooltip
            fontSize: '14px',
            fontWeight: 'bold',
          },
          borderWidth: 1,
          borderColor: isDarkMode.value ? '#2ecc71' : '#27ae60',
          shadow: true, // Sombra sutil na tooltip
        },
        credits: {
          enabled: false, // Desativa a exibição dos créditos do Highcharts
        },
      };
    }
  });
  </script>
  