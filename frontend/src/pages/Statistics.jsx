import { useMemo, useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Activity, AlertCircle, BarChart3, Droplet, LineChart, PieChart, SlidersHorizontal } from 'lucide-react';
import './Statistics.css';

// Register all the chart types we plan to use
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Constants for our blood types and their corresponding chart colors
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const TYPE_COLORS = {
  'A+': '#c1121f',
  'A-': '#669bbc',
  'B+': '#780000',
  'B-': '#003049',
  'AB+': '#9b2226',
  'AB-': '#ee9b00',
  'O+': '#06a77d',
  'O-': '#1d3557',
};

/**
 * Statistics Page Component
 * 
 * Displays visual charts and data tables about blood donations.
 * NOTE FOR BEGINNERS: This file contains complex data processing and charting logic 
 * using 'Chart.js'. You do not need to understand all the math here unless you are 
 * specifically trying to modify how the charts are drawn!
 */
function Statistics() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthFilter, setMonthFilter] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');

  const isRtl = i18n.language === 'ar';
  const locale = isRtl ? 'ar-MA' : 'fr-FR';

  const monthsShort = t('stats_dashboard.months_short', { returnObjects: true }) || [];
  const monthsFull = t('stats_dashboard.months_full', { returnObjects: true }) || [];

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get('/stats/donations', { params: { year } });
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const filtered = useMemo(() => {
    if (!data?.monthly) return null;

    const monthly = data.monthly;
    const mIdx = monthFilter === '' ? null : Number(monthFilter) - 1;

    const sliceMonthly = mIdx !== null ? [monthly[mIdx]] : monthly;

    const lineLabels = monthsShort.length ? monthsShort : BLOOD_TYPES.map(() => '');
    const lineData = monthly.map((row) => {
      if (bloodFilter) return row.by_type[bloodFilter] ?? 0;
      return row.total;
    });

    let barLabels;
    let barDatasets;

    if (mIdx !== null) {
      const row = monthly[mIdx];
      barLabels = BLOOD_TYPES;
      const vals = BLOOD_TYPES.map((bt) => (bloodFilter && bt !== bloodFilter ? 0 : row.by_type[bt] ?? 0));
      barDatasets = [
        {
          label: monthsFull[mIdx] || `${mIdx + 1}`,
          data: vals,
          backgroundColor: BLOOD_TYPES.map((bt) => TYPE_COLORS[bt]),
          borderRadius: 8,
        },
      ];
    } else if (bloodFilter) {
      barLabels = lineLabels;
      barDatasets = [
        {
          label: bloodFilter,
          data: monthly.map((row) => row.by_type[bloodFilter] ?? 0),
          backgroundColor: TYPE_COLORS[bloodFilter] || '#c1121f',
          borderRadius: 8,
        },
      ];
    } else {
      barLabels = lineLabels;
      barDatasets = BLOOD_TYPES.map((bt) => ({
        label: bt,
        data: monthly.map((row) => row.by_type[bt] ?? 0),
        backgroundColor: TYPE_COLORS[bt],
        stack: 'don',
        borderRadius: 4,
      }));
    }

    let pieLabels = [];
    let pieData = [];
    let pieColors = [];
    if (!bloodFilter) {
      const src =
        mIdx !== null
          ? monthly[mIdx].by_type
          : data.totals_by_type;
      pieLabels = BLOOD_TYPES.filter((bt) => (src[bt] ?? 0) > 0);
      pieData = pieLabels.map((bt) => src[bt] ?? 0);
      pieColors = pieLabels.map((bt) => TYPE_COLORS[bt]);
      if (pieData.length === 0) {
        pieLabels = BLOOD_TYPES;
        pieData = BLOOD_TYPES.map(() => 0);
        pieColors = BLOOD_TYPES.map((bt) => TYPE_COLORS[bt]);
      }
    }

    const tableByMonth = monthly.map((row, i) => ({
      label: monthsFull[i] || `${i + 1}`,
      total: bloodFilter ? row.by_type[bloodFilter] ?? 0 : row.total,
    }));

    const tableByType = BLOOD_TYPES.map((bt) => {
      let sum = 0;
      sliceMonthly.forEach((row) => {
        sum += row.by_type[bt] ?? 0;
      });
      return { type: bt, total: bloodFilter && bt !== bloodFilter ? 0 : sum };
    }).filter((r) => !bloodFilter || r.type === bloodFilter);

    const displayGrand = tableByMonth.reduce((a, r) => a + r.total, 0);

    return {
      barLabels,
      barDatasets,
      lineLabels,
      lineData,
      pieLabels,
      pieData,
      pieColors,
      tableByMonth: mIdx !== null ? [tableByMonth[mIdx]] : tableByMonth,
      tableByType,
      displayGrand,
    };
  }, [data, monthFilter, bloodFilter, monthsShort, monthsFull]);

  const pluginsOnly = useMemo(
    () => ({
      legend: {
        position: 'bottom',
        rtl: isRtl,
        labels: { boxWidth: 12, font: { size: 11 } },
      },
      tooltip: {
        rtl: isRtl,
        callbacks: {
          label: (ctx) => {
            const raw = ctx.parsed;
            const n = typeof raw === 'number' ? raw : (raw?.y ?? raw?.r ?? 0);
            const prefix = ctx.dataset?.label ? `${ctx.dataset.label}: ` : '';
            return `${prefix}${n} ${t('bms.units')}`;
          },
        },
      },
    }),
    [isRtl, t]
  );

  const stackedBars = !monthFilter && !bloodFilter;

  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: pluginsOnly,
      scales: {
        x: {
          stacked: stackedBars,
          ticks: { font: { size: 11 } },
        },
        y: {
          stacked: stackedBars,
          beginAtZero: true,
          ticks: { precision: 0 },
        },
      },
    }),
    [pluginsOnly, stackedBars]
  );

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: pluginsOnly,
      scales: {
        x: { ticks: { font: { size: 11 } } },
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    }),
    [pluginsOnly]
  );

  const pieOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', rtl: isRtl },
        tooltip: {
          rtl: isRtl,
          callbacks: {
            label: (ctx) => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0) || 1;
              const val = typeof ctx.raw === 'number' ? ctx.raw : Number(ctx.parsed) || 0;
              const pct = Math.round((val / total) * 100);
              return `${ctx.label}: ${val} ${t('bms.units')} (${pct}%)`;
            },
          },
        },
      },
    }),
    [isRtl, t]
  );

  if (loading) {
    return (
      <div className="stats-dashboard stats-dashboard--center">
        <Activity className="stats-spin" size={48} color="var(--primary)" />
        <p className="stats-muted">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !data || !filtered) {
    return (
      <div className="stats-dashboard stats-dashboard--center stats-dashboard--error">
        <AlertCircle size={64} color="var(--primary)" style={{ opacity: 0.5 }} />
        <h2>{t('stats.error_title')}</h2>
        <p className="stats-muted">{t('stats.error_description')}</p>
        <button type="button" className="btn btn-primary stats-retry" onClick={fetchStats}>
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const yearOptions = [];
  const y0 = new Date().getFullYear();
  for (let y = y0 + 1; y >= y0 - 5; y--) yearOptions.push(y);

  const barChartData = {
    labels: filtered.barLabels,
    datasets: filtered.barDatasets,
  };

  const lineChartData = {
    labels: filtered.lineLabels,
    datasets: [
      {
        label: bloodFilter || t('stats_dashboard.summary_units_year'),
        data: filtered.lineData,
        borderColor: bloodFilter ? TYPE_COLORS[bloodFilter] : '#c1121f',
        backgroundColor: bloodFilter ? `${TYPE_COLORS[bloodFilter]}33` : 'rgba(193, 18, 31, 0.12)',
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const pieChartData = {
    labels: filtered.pieLabels,
    datasets: [
      {
        data: filtered.pieData,
        backgroundColor: filtered.pieColors,
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const barTitle =
    monthFilter !== ''
      ? t('stats_dashboard.chart_bar_month_detail')
      : t('stats_dashboard.chart_bar_stacked');

  return (
    <div className="stats-dashboard stats-dashboard--modern" dir={isRtl ? 'rtl' : 'ltr'}>
      <section className="stats-hero stats-hero--modern">
        <div className="container stats-hero__inner">
          <div className="stats-hero__text">
            <div className="stats-hero__badge">
              <Droplet size={18} />
              {t('bms.brand')}
            </div>
            <h1>{t('stats_dashboard.hero_title')}</h1>
            <p>{t('stats_dashboard.hero_subtitle')}</p>
          </div>
          <div className="stats-filters glass-panel">
            <div className="stats-filters__title">
              <SlidersHorizontal size={18} />
              {t('stats_dashboard.filters_title')}
            </div>
            <div className="stats-filters__grid">
              <label className="stats-filters__field">
                <span>{t('stats_dashboard.filter_year')}</span>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
              <label className="stats-filters__field">
                <span>{t('stats_dashboard.filter_month')}</span>
                <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                  <option value="">{t('stats_dashboard.all_months')}</option>
                  {monthsFull.map((name, i) => (
                    <option key={name} value={String(i + 1)}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="stats-filters__field">
                <span>{t('stats_dashboard.filter_blood')}</span>
                <select value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)}>
                  <option value="">{t('stats_dashboard.all_types')}</option>
                  {BLOOD_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      <div className="container stats-body">
        <div className="stats-kpi-grid">
          <div className="stats-kpi glass-panel">
            <Droplet className="stats-kpi__icon" size={22} />
            <div className="stats-kpi__value">{filtered.displayGrand.toLocaleString(locale)}</div>
            <div className="stats-kpi__label">{t('stats_dashboard.summary_units_year')}</div>
          </div>
          <div className="stats-kpi glass-panel">
            <Activity className="stats-kpi__icon" size={22} />
            <div className="stats-kpi__value">{(data.donation_records_count ?? 0).toLocaleString(locale)}</div>
            <div className="stats-kpi__label">{t('stats_dashboard.summary_records')}</div>
          </div>
          <div className="stats-kpi glass-panel">
            <BarChart3 className="stats-kpi__icon" size={22} />
            <div className="stats-kpi__value">{(data.total_users ?? 0).toLocaleString(locale)}</div>
            <div className="stats-kpi__label">{t('stats_dashboard.registered_users')}</div>
          </div>
          <div className="stats-kpi glass-panel">
            <PieChart className="stats-kpi__icon" size={22} />
            <div className="stats-kpi__value">{(data.available_donors ?? 0).toLocaleString(locale)}</div>
            <div className="stats-kpi__label">{t('stats_dashboard.eligible_donors')}</div>
          </div>
        </div>

        <div className="stats-charts-grid">
          <div className="stats-chart-card glass-panel">
            <h3 className="stats-chart-card__title">
              <BarChart3 size={20} color="var(--primary)" />
              {barTitle}
            </h3>
            <div className="stats-chart-card__canvas">
              <Bar data={barChartData} options={barOptions} />
            </div>
          </div>

          <div className="stats-chart-card glass-panel">
            <h3 className="stats-chart-card__title">
              <LineChart size={20} color="var(--primary)" />
              {t('stats_dashboard.chart_line')}
            </h3>
            <div className="stats-chart-card__canvas">
              <Line data={lineChartData} options={lineOptions} />
            </div>
          </div>

          <div className="stats-chart-card glass-panel stats-chart-card--pie">
            <h3 className="stats-chart-card__title">
              <PieChart size={20} color="var(--primary)" />
              {t('stats_dashboard.chart_pie')}
            </h3>
            {bloodFilter ? (
              <p className="stats-pie-hint">{t('stats_dashboard.pie_hidden_hint')}</p>
            ) : (
              <div className="stats-chart-card__canvas stats-chart-card__canvas--pie">
                <Pie data={pieChartData} options={pieOptions} />
              </div>
            )}
          </div>
        </div>

        <div className="stats-tables-grid">
          <div className="stats-table-card glass-panel">
            <h3>{t('stats_dashboard.table_by_month')}</h3>
            <div className="stats-table-wrap">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>{t('stats_dashboard.col_month')}</th>
                    <th>{t('stats_dashboard.col_units')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.tableByMonth.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      <td>{row.total.toLocaleString(locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="stats-table-card glass-panel">
            <h3>{t('stats_dashboard.table_by_type')}</h3>
            <div className="stats-table-wrap">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>{t('stats_dashboard.col_type')}</th>
                    <th>{t('stats_dashboard.col_units')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.tableByType.map((row) => (
                    <tr key={row.type}>
                      <td>
                        <span className="stats-type-pill" style={{ background: TYPE_COLORS[row.type] }} />
                        {row.type}
                      </td>
                      <td>{row.total.toLocaleString(locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
