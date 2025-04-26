import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WaymoInvestmentCalculator = () => {
  // Initial investment parameters
  const [baseVehicleCost, setBaseVehicleCost] = useState(73275);
  const [autonomousHardwareCost, setAutonomousHardwareCost] = useState(100000);
  const [costOfCapital, setCostOfCapital] = useState(8);
  
  // Revenue parameters
  const [hoursPerDay, setHoursPerDay] = useState(12);
  const [daysPerWeek, setDaysPerWeek] = useState(6);
  const [tripLengthMiles, setTripLengthMiles] = useState(4);
  const [tripLengthMinutes, setTripLengthMinutes] = useState(15);
  const [initialFarePerMile, setInitialFarePerMile] = useState(11.84);
  
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
  const [fareDeclineRate, setFareDeclineRate] = useState(15);
  
  // Competition parameters
  const [teslaCostAdvantage, setTeslaCostAdvantage] = useState(30);
  const [teslaPricingImpact, setTeslaPricingImpact] = useState(25);
  
  // Results
  const [yearsToProject, setYearsToProject] = useState(5);
  const [projectionData, setProjectionData] = useState([]);
  const [teslaCompetitionData, setTeslaCompetitionData] = useState([]);
  const [annualTrips, setAnnualTrips] = useState(0);
  const [annualMiles, setAnnualMiles] = useState(0);
  
  // Calculate projections whenever inputs change
  useEffect(() => {
    calculateProjections();
  }, [
    baseVehicleCost, autonomousHardwareCost, hoursPerDay, daysPerWeek, 
    tripLengthMiles, tripLengthMinutes, initialFarePerMile, depreciationRate, 
    maintenanceCosts, insuranceCosts, cleaningCosts, chargingCosts, softwareLicensing, 
    baseVehicleCostDecline, autonomousHardwareDecline, fareDeclineRate,
    teslaCostAdvantage, teslaPricingImpact, yearsToProject
  ]);
  
  // Core business logic
  const calculateProjections = () => {
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
  
  const formatPercent = (value) => {
    return `${value}%`;
  };
  
  return (
    <div className="flex flex-col p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Waymo Robotaxi Investment Calculator</h1>
      
      {/* Dashboard Guide Banner */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <h2 className="text-md font-semibold mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          How to Use This Calculator
        </h2>
        <div className="text-sm text-gray-700">
          <p className="mb-2">
            <strong>Investment Timing:</strong> This calculator models a one-time investment made today. Hardware cost decline projections 
            show market intelligence for future investments, not direct benefits to your initial vehicle.
          </p>
          <p className="mb-2">
            <strong>Key Metrics:</strong> Focus on Year 1 ROI and Payback Period as primary decision factors. 
            Adjust parameters like depreciation rate (typically 33% for high-mileage commercial vehicles) and fare per mile to see 
            sensitivity to different variables.
          </p>
          <p>
            <strong>Market Evolution:</strong> The Tesla competition section helps you understand how long premium pricing might last 
            before competition intensifies. Adjust parameters to evaluate whether early market entry justifies premium technology prices.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Investment Parameters */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Investment Parameters</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Vehicle Cost
              </label>
              <input
                type="number"
                value={baseVehicleCost}
                onChange={(e) => setBaseVehicleCost(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autonomous Hardware Cost
              </label>
              <input
                type="number"
                value={autonomousHardwareCost}
                onChange={(e) => setAutonomousHardwareCost(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="col-span-2">
              <p className="text-sm font-medium mb-1">Total Initial Investment: {formatCurrency(baseVehicleCost + autonomousHardwareCost)}</p>
            </div>
          </div>
        </div>
        
        {/* Revenue Parameters */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Revenue Parameters</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours Per Day
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days Per Week
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trip Length (Miles)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={tripLengthMiles}
                onChange={(e) => setTripLengthMiles(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trip Length (Minutes)
              </label>
              <input
                type="number"
                min="1"
                value={tripLengthMinutes}
                onChange={(e) => setTripLengthMinutes(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Fare Per Mile ($)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.01"
                value={initialFarePerMile}
                onChange={(e) => setInitialFarePerMile(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fare Decline Rate (% per year)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={fareDeclineRate}
                onChange={(e) => setFareDeclineRate(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="col-span-2">
              <p className="text-sm font-medium mb-1">Annual Trips: {formatNumber(annualTrips)}</p>
              <p className="text-sm font-medium mb-1">Annual Miles: {formatNumber(annualMiles)}</p>
            </div>
          </div>
        </div>
        
        {/* Expense Parameters */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Expense Parameters</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Depreciation Rate (% per year)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={depreciationRate}
                onChange={(e) => setDepreciationRate(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Costs ($/year)
              </label>
              <input
                type="number"
                min="0"
                value={maintenanceCosts}
                onChange={(e) => setMaintenanceCosts(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Costs ($/year)
              </label>
              <input
                type="number"
                min="0"
                value={insuranceCosts}
                onChange={(e) => setInsuranceCosts(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cleaning Costs ($/year)
              </label>
              <input
                type="number"
                min="0"
                value={cleaningCosts}
                onChange={(e) => setCleaningCosts(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Charging Costs ($/year)
              </label>
              <input
                type="number"
                min="0"
                value={chargingCosts}
                onChange={(e) => setChargingCosts(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Software Licensing ($/year)
              </label>
              <input
                type="number"
                min="0"
                value={softwareLicensing}
                onChange={(e) => setSoftwareLicensing(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
        
        {/* Market & Competition Parameters */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Market & Competition</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Vehicle Cost Decline (% per year)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={baseVehicleCostDecline}
                onChange={(e) => setBaseVehicleCostDecline(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autonomous Hardware Decline (% per year)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={autonomousHardwareDecline}
                onChange={(e) => setAutonomousHardwareDecline(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tesla Cost Advantage (%)
              </label>
              <input
                type="number"
                min="0"
                max="90"
                value={teslaCostAdvantage}
                onChange={(e) => setTeslaCostAdvantage(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tesla Pricing Impact (% per year)
              </label>
              <input
                type="number"
                min="0"
                max="90"
                value={teslaPricingImpact}
                onChange={(e) => setTeslaPricingImpact(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years to Project
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={yearsToProject}
                onChange={(e) => setYearsToProject(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-3">Investment Projection</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Year</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Hardware Cost</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Vehicle Value</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Fare/Mile</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Revenue</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Capital Cost</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Total Expenses</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Profit</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">ROI</th>
              </tr>
            </thead>
            <tbody>
              {projectionData.map((data) => (
                <tr key={data.year}>
                  <td className="py-2 px-4 border-b border-gray-200">{data.year}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{formatCurrency(data.hardwareCost)}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{formatCurrency(data.vehicleValue)}</td>
                  <td className="py-2 px-4 border-b border-gray-200">${data.farePerMile.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{formatCurrency(data.annualRevenue)}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{formatCurrency(data.capitalCost)}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{formatCurrency(data.annualExpenses)}</td>
                  <td className={`py-2 px-4 border-b border-gray-200 ${data.annualProfit >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {formatCurrency(data.annualProfit)}
                  </td>
                  <td className={`py-2 px-4 border-b border-gray-200 ${data.roi >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {data.roi.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Profit Projection</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="annualRevenue" name="Revenue" stroke="#4f46e5" strokeWidth={2} />
                <Line type="monotone" dataKey="annualExpenses" name="Expenses" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="annualProfit" name="Profit" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">ROI Comparison</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line type="monotone" dataKey="roi" name="Standard ROI" stroke="#0ea5e9" strokeWidth={2} />
                <Line type="monotone" dataKey="farePerMile" name="Fare per Mile" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-3">Competition with Tesla</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Year</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Waymo Fare</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Waymo ROI</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Tesla Fare</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Tesla ROI</th>
              </tr>
            </thead>
            <tbody>
              {projectionData.map((data, index) => (
                <tr key={data.year}>
                  <td className="py-2 px-4 border-b border-gray-200">{data.year}</td>
                  <td className="py-2 px-4 border-b border-gray-200">${data.farePerMile.toFixed(2)}</td>
                  <td className={`py-2 px-4 border-b border-gray-200 ${data.roi >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {data.roi.toFixed(1)}%
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">${teslaCompetitionData[index].farePerMile.toFixed(2)}</td>
                  <td className={`py-2 px-4 border-b border-gray-200 ${teslaCompetitionData[index].roi >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {teslaCompetitionData[index].roi.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-3">Key Investment Takeaways</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <h3 className="text-md font-semibold mb-2">Initial Investment</h3>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(baseVehicleCost + autonomousHardwareCost)}</p>
            <p className="text-sm text-gray-600">Total initial cost</p>
          </div>
          
          <div className="bg-white p-3 rounded shadow-sm">
            <h3 className="text-md font-semibold mb-2">Year 1 Return</h3>
            <p className={`text-2xl font-bold ${projectionData[0]?.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {projectionData[0]?.roi.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">First year ROI</p>
          </div>
          
          <div className="bg-white p-3 rounded shadow-sm">
            <h3 className="text-md font-semibold mb-2">Payback Period</h3>
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
                  <p className="text-2xl font-bold text-blue-600">
                    {paybackYear ? `${paybackYear} years` : 'Beyond projection'}
                  </p>
                  <p className="text-sm text-gray-600">Time to recover investment</p>
                </>
              );
            })()}
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Analysis</h3>
          <p className="text-sm text-gray-700 mb-2">
            This model projects the potential returns of investing in a Waymo robotaxi, factoring in hardware costs, 
            utilization rates, pricing changes, and competitive pressures.
          </p>
          <p className="text-sm text-gray-700">
            Key considerations include the accelerated rate of technology depreciation, potential market saturation,
            and pricing pressure from competitors like Tesla. The investment appears most profitable in early years
            before market maturity and price competition intensify.
          </p>
        </div>
      </div>
      
      {/* How to Use This Dashboard Guide */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-semibold mb-4">How to Use This Dashboard</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-medium text-gray-800">Understanding the Investment Timeline</h3>
            <p className="text-sm text-gray-700">
              This dashboard models a one-time investment made today. The hardware cost decline projections don't affect 
              your initial vehicle's profitability, but they provide crucial market intelligence about when future 
              investments might be optimal.
            </p>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-800">Reading Market & Competition Parameters</h3>
            <p className="text-sm text-gray-700">
              The hardware cost decline rates show how the market will evolve. Use these metrics to:
            </p>
            <ul className="text-sm text-gray-700 list-disc ml-5 mt-1">
              <li>Anticipate pricing pressure from new market entrants with lower capital costs</li>
              <li>Plan optimal timing for future fleet expansion</li>
              <li>Determine when to replace your initial vehicle as technology improves</li>
              <li>Evaluate whether delaying your investment would provide better returns</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-800">Investment Strategy Insights</h3>
            <p className="text-sm text-gray-700">
              The Tesla competition section models how lower-cost competitors will affect market dynamics. This helps you:
            </p>
            <ul className="text-sm text-gray-700 list-disc ml-5 mt-1">
              <li>Understand how long premium pricing might last before competition intensifies</li>
              <li>Evaluate the risk of technological obsolescence beyond normal depreciation</li>
              <li>Consider how different market segments might evolve at different rates</li>
              <li>Assess whether early market entry justifies paying premium prices for current technology</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-800">Using This Tool for Decision-Making</h3>
            <p className="text-sm text-gray-700">
              Experiment with different parameters to stress-test your investment case:
            </p>
            <ul className="text-sm text-gray-700 list-disc ml-5 mt-1">
              <li>Start with conservative estimates to ensure viability in challenging scenarios</li>
              <li>Identify which parameters have the most significant impact on profitability</li>
              <li>Compare immediate investment vs. waiting 1-2 years for improved technology at lower costs</li>
              <li>Consider how regulatory changes might affect different parameters over time</li>
            </ul>
          </div>
          
          <div className="mt-4 bg-blue-100 p-3 rounded">
            <h3 className="text-md font-medium text-gray-800">Future Development</h3>
            <p className="text-sm text-gray-700">
              This calculator is an open-source project available on GitHub. Contributions are welcome to improve 
              the model assumptions, add features, or share interesting investment scenarios. 
              Contact the repository maintainer to learn how you can contribute.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaymoInvestmentCalculator;