# Waymo Robotaxi Investment Calculator

## Live Demo
Explore the calculator: [https://vishalsachdev.github.io/waymo-investment-calculator](https://vishalsachdev.github.io/waymo-investment-calculator)

## Project Overview
An interactive financial calculator to analyze the potential returns on investing in a Waymo autonomous vehicle for robotaxi service. This tool helps potential investors evaluate the business case by modeling revenue streams, expenses, and market evolution over time.

## Key Features

### Core Financial Modeling
- **Investment Parameters**: Base vehicle cost, autonomous hardware cost
- **Revenue Calculation**: Based on operating hours, trip length, fare pricing
- **Expense Tracking**: Depreciation, maintenance, insurance, cleaning, charging, software licensing
- **Advanced Financial Metrics**: NPV (Net Present Value), IRR (Internal Rate of Return), and payback period
- **Cost of Capital**: Adjustable parameter for more accurate NPV calculations
- **Multi-Year Projections**: 5-year default view with ROI calculations for each year

### Market Intelligence
- **Hardware Cost Evolution**: Models how hardware costs decline over time
- **Fare Pricing Trends**: Projects fare declines as market matures
- **Competitive Analysis**: Models Tesla's potential impact on the market
- **Visual Analytics**: Interactive charts for profit projections and ROI comparison

### User Experience
- **Responsive Design**: Side-by-side layout for desktop, stacked layout for mobile
- **Scenario Snapshots**: Save and compare different investment scenarios
- **Intuitive Interface**: Organized by parameter categories with clear labeling
- **Instant Recalculation**: All projections update automatically when parameters change
- **Visual Guidance**: Highlighted information boxes explaining market intelligence parameters
- **Comprehensive Results**: Detailed projection tables with color-coded profitability indicators

## Technical Implementation
- **React Framework**: Implemented using React functional components with hooks
- **State Management**: useState and useEffect for dynamic recalculation
- **Data Visualization**: Recharts library for interactive line charts
- **Responsive Design**: Flexbox layout with media queries for different screen sizes
- **Financial Calculations**: Standard NPV and IRR calculations following financial best practices

## Deployment
- **GitHub Pages**: Hosted on GitHub Pages for easy access
- **Deployment Process**:
  ```
  npm run deploy
  ```
  This builds the application and pushes to the gh-pages branch

## Key Insights Added
- **Market Evolution Context**: Clear explanation that hardware cost declines represent market intelligence rather than direct benefits to the initial investment
- **Tesla Competition Modeling**: Analysis of how lower-cost competitors will affect market dynamics
- **Depreciation Guidance**: Recommendation of 33% annual depreciation for high-mileage commercial vehicles

## Development

### Installation
```
git clone https://github.com/vishalsachdev/waymo-investment-calculator.git
cd waymo-investment-calculator
npm install
npm start
```

### Available Scripts
- `npm start`: Run the app in development mode
- `npm run build`: Build the app for production
- `npm run deploy`: Deploy the app to GitHub Pages

The primary focus is helping users understand the unique economic characteristics of robotaxi investments, including high upfront costs, accelerated depreciation, and evolving market dynamics.