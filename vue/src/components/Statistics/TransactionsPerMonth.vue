<template>
  <div>
    <!-- Verifica se os dados existem antes de exibir o gráfico -->
    <div v-if="stats && stats.length > 0">
      <Chart :options="chartOptions" />
    </div>
    <div v-else>
      <p class="font-bold text-center">No data available for the graph.</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, computed } from 'vue'
import { Chart } from 'highcharts-vue'
import Highcharts from 'highcharts'

// Definir separadores de milhar e ponto decimal
Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    thousandsSep: ',',
  },
})

// Verificar se o modo escuro está ativado
const isDarkMode = computed(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

const props = defineProps({
  stats: {
    type: Array,
    required: true
  }
})

const chartOptions = ref({})

onMounted(() => {
  if (props.stats && props.stats.length > 0) {
    const months = [] // Meses para o eixo X
    const transactions = [] // Número de transações para o eixo Y
    const years = [] // Para armazenar os anos

    // Processar os dados para o formato adequado para o gráfico
    props.stats.forEach(item => {
      const monthYear = `${item.year}-${item.month < 10 ? '0' + item.month : item.month}` // Formato "YYYY-MM"
      months.push(monthYear) // Adiciona os meses no eixo X
      transactions.push(item.total_transactions) // Número de transações
      if (!years.includes(item.year)) {
        years.push(item.year) // Adiciona o ano à lista, se ainda não estiver lá
      }
    })

    // Opções de configuração do gráfico
    chartOptions.value = {
      chart: {
        type: 'column', // Tipo do gráfico (colunas)
        backgroundColor: isDarkMode.value ? '#1f2937' : '#f4f7fc', // Fundo ajustado conforme o modo
        borderRadius: 10, // Bordas arredondadas
        borderWidth: 1,
        borderColor: isDarkMode.value ? '#555' : '#ccc', // Cor da borda
        animation: {
          duration: 1000 // Duração da animação
        }
      },
      title: {
        text: 'Transactions by Month', // Título do gráfico
        style: {
          color: isDarkMode.value ? '#fff' : '#333', // Cor do título
          fontSize: '20px',
          fontWeight: 'bold',
          letterSpacing: '0.5px', // Espaçamento entre as letras
        },
      },
      xAxis: {
        categories: months, // Meses no eixo X
        title: {
          text: 'Month', // Título do eixo X
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
          text: 'Total Transactions', // Título do eixo Y
          style: {
            color: isDarkMode.value ? '#fff' : '#333',
            fontWeight: 'bold', // Torna o título do eixo Y em negrito
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
            return this.value; // Formata os valores do eixo Y como números inteiros
          }
        },
        lineColor: isDarkMode.value ? '#555' : '#ccc', // Cor da linha do eixo Y
        gridLineColor: isDarkMode.value ? '#444' : '#eee', // Cor das linhas de grade
        gridLineWidth: 1, // Linhas de grade finas
      },
      series: [
        {
          name: 'Transactions', // Nome da série
          data: transactions, // Dados de número de transações
          color: '#3498db', // Cor das barras
        }
      ],
      tooltip: {
        shared: true,
        valueSuffix: ' transactions',
        backgroundColor: isDarkMode.value ? '#333' : '#fff', // Cor de fundo da tooltip
        borderWidth: 1,
        borderColor: isDarkMode.value ? '#2ecc71' : '#27ae60', // Cor da borda da tooltip
        style: {
          fontSize: '14px',
          color: isDarkMode.value ? '#fff' : '#333', // Cor do texto da tooltip
        },
      },
      credits: {
        enabled: false, // Desativa os créditos do Highcharts
      },
    }
  }
})
</script>

<style scoped>
/* Adicione estilos adicionais, se necessário */
</style>
