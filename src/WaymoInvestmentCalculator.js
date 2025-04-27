import { useState, useEffect, useCallback, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './WaymoInvestmentCalculator.css';
import logo from './logo.svg';

const WaymoInvestmentCalculator = () => {
  // Initial investment parameters
  const [baseVehicleCost, setBaseVehicleCost] = useState(73275);
  const [autonomousHardwareCost, setAutonomousHardwareCost] = useState(100000);
  const [costOfCapital, setCostOfCapital] = useState(8); // Used in calculations
  
  // Revenue parameters
  const [hoursPerDay, setHoursPerDay] = useState(12);
  const [daysPerWeek, setDaysPerWeek] = useState(6);
  const [tripLengthMiles, setTripLengthMiles] = useState(4);
  const [tripLengthMinutes, setTripLengthMinutes] = useState(15);
  const [initialFarePerMile, setInitialFarePerMile] = useState(11.84);
  const [fareDeclineRate, setFareDeclineRate] = useState(15);
  
  // Expense parameters
  const [depreciationRate, setDepreciationRate] = useState(33);
  const [maintenanceCosts, setMaintenanceCosts] = useState(5000);
  const [insuranceCosts, setInsuranceCosts] = useState(10000);
  const [cleaningCosts, setCleaningCosts] = useState(5000);
  const [chargingCosts, setChargingCosts] = useState(3000);
  const [softwareLicensing, setSoftwareLicensing] = useState(20000);
  
  // Market parameters
  const [baseVehicleCostDecline, setBaseVehicleCostDecline] = useState(10);
  const [autonomousHardwareDecline, setAutonomousHardwareDecline] = useState(20);
  
  // Competition parameters
  const [teslaCostAdvantage, setTeslaCostAdvantage] = useState(30);
  const [teslaPricingImpact, setTeslaPricingImpact] = useState(25);
  
  // Results
  const [yearsToProject, setYearsToProject] = useState(5);
  const [projectionData, setProjectionData] = useState([]);
  const [teslaCompetitionData, setTeslaCompetitionData] = useState([]);
  const [annualTrips, setAnnualTrips] = useState(0);
  const [annualMiles, setAnnualMiles] = useState(0);
  // Advanced metrics
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [npv, setNpv] = useState(0);
  const [irr, setIrr] = useState(0);
  // Snapshots
  const [snapshots, setSnapshots] = useState([]);
  // For dynamic highlighting
  const prevValues = useRef({ investment: 0, roi: 0, payback: '' });
  
  // Helper: NPV Calculation
  const calculateNpv = (cashFlows, discountRate) => {
    // Convert percentage to decimal
    const rate = discountRate / 100;
    let npv = cashFlows[0]; // Initial investment (negative value)
    
    // Start from index 1 (year 1) since index 0 is the initial investment
    for (let i = 1; i < cashFlows.length; i++) {
      npv += cashFlows[i] / Math.pow(1 + rate, i);
    }
    
    return npv;
  };

  // Helper: IRR Calculation (simple iterative approach)
  const calculateIrr = (cashFlows, guess = 0.1) => {
    let irr = guess;
    let iterations = 100;
    let tol = 0.0001;
    for (let i = 0; i < iterations; i++) {
      let npv = 0;
      for (let j = 0; j < cashFlows.length; j++) {
        npv += cashFlows[j] / Math.pow(1 + irr, j + 1);
      }
      if (Math.abs(npv) < tol) return irr * 100;
      irr += npv > 0 ? 0.001 : -0.001;
    }
    return irr * 100;
  };

  // Core business logic
  const calculateProjections = useCallback(() => {
    // Calculate utilization
    const tripsPerDay = Math.floor(hoursPerDay * 60 / tripLengthMinutes);
    const annualTripsCalc = tripsPerDay * daysPerWeek * 52;
    const annualMilesCalc = annualTripsCalc * tripLengthMiles;
    
    setAnnualTrips(annualTripsCalc);
    setAnnualMiles(annualMilesCalc);
    
    // Initial investment
    const totalInitialInvestment = baseVehicleCost + autonomousHardwareCost;
    
    // Standard projection
    const standardData = [];
    const teslaData = [];
    
    let currentFare = initialFarePerMile;
    let currentTeslaFare = initialFarePerMile;
    let vehicleValue = totalInitialInvestment;
    let maintenanceCost = maintenanceCosts;
    let softwareCost = softwareLicensing;
    let hardwareCost = baseVehicleCost + autonomousHardwareCost;
    
    for (let year = 1; year <= yearsToProject; year++) {
      // Standard projection calculations
      const annualRevenue = annualMilesCalc * currentFare;
      const depreciation = vehicleValue * (depreciationRate / 100);
      const capitalCost = totalInitialInvestment * (costOfCapital / 100);
      const totalExpenses = depreciation + maintenanceCost + insuranceCosts + 
                           cleaningCosts + chargingCosts + softwareCost + capitalCost;
      const annualProfit = annualRevenue - totalExpenses;
      const roi = (annualProfit / totalInitialInvestment) * 100;
      
      // Tesla competition calculations
      const teslaRevenue = annualMilesCalc * currentTeslaFare;
      const teslaTotalExpenses = totalExpenses * (1 - teslaCostAdvantage / 100);
      const teslaProfit = teslaRevenue - teslaTotalExpenses;
      const teslaRoi = (teslaProfit / (totalInitialInvestment * (1 - teslaCostAdvantage / 100))) * 100;
      
      // Add data points
      standardData.push({
        year,
        hardwareCost: Math.round(hardwareCost),
        vehicleValue: Math.round(vehicleValue),
        farePerMile: parseFloat(currentFare.toFixed(2)),
        annualRevenue: Math.round(annualRevenue),
        capitalCost: Math.round(capitalCost),
        annualExpenses: Math.round(totalExpenses),
        annualProfit: Math.round(annualProfit),
        roi: parseFloat(roi.toFixed(1))
      });
      
      teslaData.push({
        year,
        farePerMile: parseFloat(currentTeslaFare.toFixed(2)),
        annualRevenue: Math.round(teslaRevenue),
        annualExpenses: Math.round(teslaTotalExpenses),
        annualProfit: Math.round(teslaProfit),
        roi: parseFloat(teslaRoi.toFixed(1))
      });
      
      // Update values for next year
      vehicleValue -= depreciation;
      currentFare *= (1 - fareDeclineRate / 100);
      currentTeslaFare *= (1 - teslaPricingImpact / 100);
      maintenanceCost *= 1.1; // 10% annual increase
      softwareCost *= 0.9; // 10% annual decrease
      
      // Hardware cost declines for next generation
      const newVehicleCost = baseVehicleCost * Math.pow(1 - baseVehicleCostDecline / 100, year);
      const newHardwareCost = autonomousHardwareCost * Math.pow(1 - autonomousHardwareDecline / 100, year);
      hardwareCost = newVehicleCost + newHardwareCost;
    }
    
    setProjectionData(standardData);
    setTeslaCompetitionData(teslaData);
  }, [
    baseVehicleCost, autonomousHardwareCost, costOfCapital, hoursPerDay, daysPerWeek, 
    tripLengthMiles, tripLengthMinutes, initialFarePerMile, depreciationRate, 
    maintenanceCosts, insuranceCosts, cleaningCosts, chargingCosts, softwareLicensing, 
    baseVehicleCostDecline, autonomousHardwareDecline, fareDeclineRate,
    teslaCostAdvantage, teslaPricingImpact, yearsToProject
  ]);
  
  // Calculate projections whenever inputs change
  useEffect(() => {
    calculateProjections();
    // eslint-disable-next-line
  }, [baseVehicleCost, autonomousHardwareCost, costOfCapital, hoursPerDay, daysPerWeek, tripLengthMiles, tripLengthMinutes, initialFarePerMile, fareDeclineRate, depreciationRate, maintenanceCosts, insuranceCosts, cleaningCosts, chargingCosts, softwareLicensing, baseVehicleCostDecline, autonomousHardwareDecline, teslaCostAdvantage, teslaPricingImpact, yearsToProject]);

  // Calculate advanced metrics when projection data updates
  useEffect(() => {
    if (projectionData.length > 0) {
      const investment = baseVehicleCost + autonomousHardwareCost;
      const cashFlows = [-investment, ...projectionData.map(d => d.annualProfit)];
      setNpv(Math.round(calculateNpv(cashFlows, costOfCapital)));
      setIrr(Number.isFinite(calculateIrr(cashFlows)) ? calculateIrr(cashFlows) : null);
    }
  }, [projectionData, baseVehicleCost, autonomousHardwareCost, costOfCapital]);

  // Dynamic highlighting for summary values
  useEffect(() => {
    const investment = baseVehicleCost + autonomousHardwareCost;
    const roi = projectionData[0]?.roi;
    let paybackYear = (() => {
      let cumulativeProfit = 0;
      let payback = 0;
      for (let i = 0; i < projectionData.length; i++) {
        cumulativeProfit += projectionData[i].annualProfit;
        if (cumulativeProfit >= investment && payback === 0) {
          payback = i + 1;
          break;
        }
      }
      return payback ? `${payback} years` : 'Beyond projection';
    })();

    const highlight = (id, changed) => {
      const el = document.getElementById(id);
      if (el && changed) {
        el.classList.add('pulse-highlight');
        setTimeout(() => el.classList.remove('pulse-highlight'), 1200);
      }
    };
    highlight('initial-investment-value', prevValues.current.investment !== investment);
    highlight('year1-roi-value', prevValues.current.roi !== roi);
    highlight('payback-value', prevValues.current.payback !== paybackYear);
    prevValues.current = { investment, roi, payback: paybackYear };
  }, [baseVehicleCost, autonomousHardwareCost, projectionData]);

  // Scenario snapshot handling
  const handleSaveSnapshot = () => {
    const investment = baseVehicleCost + autonomousHardwareCost;
    let paybackYear = (() => {
      let cumulativeProfit = 0;
      let payback = 0;
      for (let i = 0; i < projectionData.length; i++) {
        cumulativeProfit += projectionData[i].annualProfit;
        if (cumulativeProfit >= investment && payback === 0) {
          payback = i + 1;
          break;
        }
      }
      return payback ? `${payback} years` : 'Beyond projection';
    })();
    setSnapshots([
      ...snapshots,
      {
        timestamp: new Date().toLocaleString(),
        initialInvestment: investment,
        year1ROI: projectionData[0]?.roi?.toFixed(1) ?? '--',
        payback: paybackYear,
        npv: npv,
        irr: irr ?? '--',
      },
    ]);
  };

  // Formatting helpers
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };
  
  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Waymo Robotaxi Investment Calculator</h1>
      </div>
      
      {/* How to Use Banner */}
      <div className="info-banner">
        <div className="mb-2">
          <h2 className="text-lg font-medium">How to Use This Calculator</h2>
        </div>
        
        <div className="text-sm text-gray-700">
          <p className="mb-2">
            <strong>Investment Timing:</strong> This calculator models a one-time investment made today. Hardware cost decline projections show market intelligence for future investments, not direct benefits to your initial vehicle.
          </p>
          <p className="mb-2">
            <strong>Key Metrics:</strong> Focus on Year 1 ROI and Payback Period as primary decision factors. Adjust parameters like depreciation rate (typically 33% for high-mileage commercial vehicles) and fare per mile to see sensitivity to different variables.
          </p>
          <p>
            <strong>Market Evolution:</strong> The Tesla competition section helps you understand how long premium pricing might last before competition intensifies. Adjust parameters to evaluate whether early market entry justifies premium technology prices.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Investment Parameters */}
        <div className="panel">
          <h2 className="panel-header">Investment Parameters</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">
                Base Vehicle Cost - Jaguar I-PACE 2025
              </label>
              <input
                type="number"
                value={baseVehicleCost}
                onChange={(e) => setBaseVehicleCost(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Autonomous Hardware Cost
              </label>
              <input
                type="number"
                value={autonomousHardwareCost}
                onChange={(e) => setAutonomousHardwareCost(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
          </div>
          
          <div className="mt-4 bg-gray-50 p-3 rounded">
            <p className="text-sm font-medium">Total Initial Investment: <span className="font-bold">{formatCurrency(baseVehicleCost + autonomousHardwareCost)}</span></p>
          </div>
        </div>
        
        {/* Revenue Parameters */}
        <div className="panel">
          <h2 className="panel-header">Revenue Parameters</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">
                Hours Per Day
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Days Per Week
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Trip Length (Miles)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={tripLengthMiles}
                onChange={(e) => setTripLengthMiles(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Trip Length (Minutes)
              </label>
              <input
                type="number"
                min="1"
                value={tripLengthMinutes}
                onChange={(e) => setTripLengthMinutes(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Initial Fare Per Mile ($)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.01"
                value={initialFarePerMile}
                onChange={(e) => setInitialFarePerMile(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Fare Decline Rate (% per year)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={fareDeclineRate}
                onChange={(e) => setFareDeclineRate(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
          </div>
          
          <div className="mt-4 bg-gray-50 p-3 rounded">
            <p className="text-sm font-medium mb-1">Annual Trips: <span className="font-bold">{formatNumber(annualTrips)}</span></p>
            <p className="text-sm font-medium">Annual Miles: <span className="font-bold">{formatNumber(annualMiles)}</span></p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Expense Parameters */}
        <div className="panel">
          <h2 className="panel-header">Expense Parameters</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">
                Depreciation Rate (% per year)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={depreciationRate}
                onChange={(e) => setDepreciationRate(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Maintenance Costs ($/year)
              </label>
              <input
                type="number"
                min="0"
                value={maintenanceCosts}
                onChange={(e) => setMaintenanceCosts(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Insurance Costs ($/year)
              </label>
              <input
                type="number"
                min="0"
                value={insuranceCosts}
                onChange={(e) => setInsuranceCosts(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Cleaning Costs ($/year)
              </label>
              <input
                type="number"
                min="0"
                value={cleaningCosts}
                onChange={(e) => setCleaningCosts(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Charging Costs ($/year)
              </label>
              <input
                type="number"
                min="0"
                value={chargingCosts}
                onChange={(e) => setChargingCosts(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Software Licensing ($/year)
              </label>
              <input
                type="number"
                min="0"
                value={softwareLicensing}
                onChange={(e) => setSoftwareLicensing(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Cost of Capital (%)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={costOfCapital}
                onChange={(e) => setCostOfCapital(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
          </div>
        </div>
        
        {/* Market & Competition */}
        <div className="panel">
          <h2 className="panel-header">Market & Competition</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">
                Base Vehicle Cost Decline (% per year)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={baseVehicleCostDecline}
                onChange={(e) => setBaseVehicleCostDecline(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Autonomous Hardware Decline (% per year)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={autonomousHardwareDecline}
                onChange={(e) => setAutonomousHardwareDecline(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Tesla Cost Advantage (%)
              </label>
              <input
                type="number"
                min="0"
                max="90"
                value={teslaCostAdvantage}
                onChange={(e) => setTeslaCostAdvantage(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Tesla Pricing Impact (% per year)
              </label>
              <input
                type="number"
                min="0"
                max="90"
                value={teslaPricingImpact}
                onChange={(e) => setTeslaPricingImpact(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                Years to Project
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={yearsToProject}
                onChange={(e) => setYearsToProject(Number(e.target.value))}
                className="calculator-input"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Investment Metrics */}
      {/* Sticky Summary Panel with Advanced Metrics Toggle */}
      <div className="summary-panel-sticky">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Initial Investment Card */}
          <div className="summary-card" tabIndex={0} aria-label="Initial Investment">
            <div className="summary-header">
              <img src={logo} alt="Investment" className="summary-icon" />
              <h3 className="summary-title">Initial Investment
                <span className="info-icon" tabIndex={0} title="The total upfront cost, including the base vehicle and autonomous hardware.">ℹ️</span>
              </h3>
            </div>
            <p className="summary-value highlight-on-change" id="initial-investment-value">
              {formatCurrency(baseVehicleCost + autonomousHardwareCost)}
            </p>
            <p className="summary-note">Total initial cost <span className="benchmark">(Industry avg: $180k–$250k)</span></p>
          </div>

          {/* Year 1 Return Card */}
          <div className="summary-card" tabIndex={0} aria-label="Year 1 Return">
            <div className="summary-header">
              <img src={logo} alt="ROI" className="summary-icon" />
              <h3 className="summary-title">Year 1 Return
                <span className="info-icon" tabIndex={0} title="Return on investment for the first year, calculated as net profit divided by initial investment.">ℹ️</span>
              </h3>
            </div>
            <p className={`summary-value highlight-on-change ${projectionData[0]?.roi >= 0 ? 'positive-value' : 'negative-value'}`} id="year1-roi-value">
              {projectionData[0]?.roi?.toFixed(1) ?? '--'}%
            </p>
            <p className="summary-note">First year ROI <span className="benchmark">(Target: 20%+)</span></p>
          </div>

          {/* Payback Period Card */}
          <div className="summary-card" tabIndex={0} aria-label="Payback Period">
            <div className="summary-header">
              <img src={logo} alt="Payback" className="summary-icon" />
              <h3 className="summary-title">Payback Period
                <span className="info-icon" tabIndex={0} title="The number of years it takes for cumulative profit to cover the initial investment.">ℹ️</span>
              </h3>
            </div>
            {(() => {
              let investment = baseVehicleCost + autonomousHardwareCost;
              let cumulativeProfit = 0;
              let paybackYear = 0;
              for (let i = 0; i < projectionData.length; i++) {
                cumulativeProfit += projectionData[i].annualProfit;
                if (cumulativeProfit >= investment && paybackYear === 0) {
                  paybackYear = i + 1;
                  break;
                }
              }
              return (
                <>
                  <p className="summary-value highlight-on-change" id="payback-value">
                    {paybackYear ? `${paybackYear} years` : 'Beyond projection'}
                  </p>
                  <p className="summary-note">Time to recover investment <span className="benchmark">(Typical: 2–4 yrs)</span></p>
                </>
              );
            })()}
          </div>
        </div>
        {/* Advanced Metrics Toggle */}
        <div className="flex items-center gap-4 mb-4">
          <label htmlFor="advanced-metrics-toggle" className="font-medium text-sm">Show Advanced Metrics (NPV, IRR)</label>
          <input type="checkbox" id="advanced-metrics-toggle" checked={showAdvanced} onChange={() => setShowAdvanced(!showAdvanced)} />
        </div>
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="summary-card" tabIndex={0} aria-label="Net Present Value">
              <div className="summary-header">
                <img src={logo} alt="NPV" className="summary-icon" />
                <h3 className="summary-title">NPV
                  <span className="info-icon" tabIndex={0} title="Net Present Value of all projected cash flows, discounted at your cost of capital.">ℹ️</span>
                </h3>
              </div>
              <p className={`summary-value highlight-on-change ${npv >= 0 ? 'positive-value' : 'negative-value'}`}>{formatCurrency(npv)}</p>
              <p className="summary-note">Net Present Value <span className="benchmark">(Positive = Attractive)</span></p>
            </div>
            <div className="summary-card" tabIndex={0} aria-label="Internal Rate of Return">
              <div className="summary-header">
                <img src={logo} alt="IRR" className="summary-icon" />
                <h3 className="summary-title">IRR
                  <span className="info-icon" tabIndex={0} title="Internal Rate of Return: the discount rate that makes the NPV of all cash flows zero.">ℹ️</span>
                </h3>
              </div>
              <p className={`summary-value highlight-on-change ${irr >= 0 ? 'positive-value' : 'negative-value'}`}>{irr !== null ? irr.toFixed(1) + '%' : '--'}</p>
              <p className="summary-note">Internal Rate of Return <span className="benchmark">(Target: 15%+)</span></p>
            </div>
          </div>
        )}
        {/* Scenario Snapshots */}
        <div className="mb-4">
          <button className="snapshot-btn" onClick={handleSaveSnapshot}>Save Scenario Snapshot</button>
          {snapshots.length > 0 && (
            <div className="snapshot-table-container">
              <h4 className="font-semibold text-base mb-2">Scenario Snapshots</h4>
              <table className="snapshot-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Initial Investment</th>
                    <th>Year 1 ROI</th>
                    <th>Payback</th>
                    <th>NPV</th>
                    <th>IRR</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshots.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.timestamp}</td>
                      <td>{formatCurrency(s.initialInvestment)}</td>
                      <td>{s.year1ROI}%</td>
                      <td>{s.payback}</td>
                      <td>{formatCurrency(s.npv)}</td>
                      <td>{s.irr}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      
      {/* Results Table */}
      <div className="panel mb-8">
        <h2 className="panel-header">Investment Projection</h2>
        
        <div className="overflow-x-auto">
          <table className="results-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Hardware Cost</th>
                <th>Vehicle Value</th>
                <th>Fare/Mile</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Profit</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody>
              {projectionData.map((data, index) => (
                <tr key={data.year}>
                  <td>{data.year}</td>
                  <td>{formatCurrency(data.hardwareCost)}</td>
                  <td>{formatCurrency(data.vehicleValue)}</td>
                  <td>${data.farePerMile.toFixed(2)}</td>
                  <td>{formatCurrency(data.annualRevenue)}</td>
                  <td>{formatCurrency(data.annualExpenses)}</td>
                  <td className={data.annualProfit >= 0 ? 'positive-value' : 'negative-value'}>
                    {formatCurrency(data.annualProfit)}
                  </td>
                  <td className={data.roi >= 0 ? 'positive-value' : 'negative-value'}>
                    {data.roi.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="chart-container">
          <h2 className="chart-title">Profit Projection</h2>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="annualRevenue" name="Revenue" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="annualExpenses" name="Expenses" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="annualProfit" name="Profit" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="chart-container">
          <h2 className="chart-title">ROI Comparison</h2>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value, name) => [name === "farePerMile" ? `$${value}` : `${value}%`, name === "farePerMile" ? "Fare per Mile" : "ROI"]} />
                <Legend />
                <Line type="monotone" dataKey="roi" name="Standard ROI" stroke="#0ea5e9" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="farePerMile" name="Fare per Mile" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tesla Competition */}
      <div className="panel mb-8">
        <h2 className="panel-header">Competition with Tesla</h2>
        
        <div className="overflow-x-auto">
          <table className="results-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Waymo Fare</th>
                <th>Waymo ROI</th>
                <th>Tesla Fare</th>
                <th>Tesla ROI</th>
              </tr>
            </thead>
            <tbody>
              {projectionData.map((data, index) => (
                <tr key={data.year}>
                  <td>{data.year}</td>
                  <td>${data.farePerMile.toFixed(2)}</td>
                  <td className={data.roi >= 0 ? 'positive-value' : 'negative-value'}>
                    {data.roi.toFixed(1)}%
                  </td>
                  <td>${teslaCompetitionData[index].farePerMile.toFixed(2)}</td>
                  <td className={teslaCompetitionData[index].roi >= 0 ? 'positive-value' : 'negative-value'}>
                    {teslaCompetitionData[index].roi.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WaymoInvestmentCalculator;
