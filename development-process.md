# Developing a Waymo Robotaxi Investment Calculator: A Collaborative Process

## Initial Exploration: Understanding Waymo Economics

### Question: How much does a Waymo car cost to build?
I began by exploring the base costs associated with a Waymo vehicle. Through research, I learned that:
- The base vehicle (Jaguar I-PACE) costs around $73,275
- The autonomous driving equipment adds approximately $100,000
- The total initial investment would be about $173,275

### Question: What is the infrastructure for cleaning, charging, repairing the Waymo cars?
Next, I investigated the operational infrastructure required to maintain these vehicles:
- Waymo maintains dedicated facilities with charging stations in each operating city
- They perform regular cleaning with pre- and post-ride inspections
- They have dedicated warehouses for vehicle repairs and maintenance
- They partner with companies like Uber and Moove in some cities for fleet management

## Financial Modeling: Calculating Potential Returns

### Question: How might we estimate Waymo revenues to get a sense of value from investing in a Waymo car in the future?
I developed a financial model by researching:
- Current pricing strategies ($9.52 + $1.66 per mile + $0.30 per minute in San Francisco)
- Weekly ride volumes (250,000 paid rides per week reported in April 2025)
- Average fares (around $11.84 per mile based on user data)

### Question: At 60,000 miles per year, is depreciation of 20% per year justified?
I realized standard depreciation models wouldn't apply to high-utilization autonomous vehicles:
- Commercial vehicles with high mileage typically depreciate faster
- The expensive technology components may become obsolete before mechanical wear out
- A 33% annual depreciation rate might be more realistic for financial modeling

### Question: Let's calculate at 33% depreciation rate
I refined the financial model with this new understanding and calculated:
- More accurate annual expenses with accelerated depreciation
- Revised payback periods (much longer with realistic depreciation)
- Investment metrics including ROI and breakeven points

## Tool Development: Creating an Interactive Calculator

### Question: How might we create an interactive dashboard which could allow a user to select values for their assumptions?
I created a React-based dashboard that:
- Provides input fields for all key parameters (vehicle costs, utilization, fare rates, etc.)
- Shows projected revenue, expenses, and profits over a 5-year period
- Visualizes financial data through interactive charts
- Models competition from companies like Tesla

### Question: Let's put the relevant information at the top
I improved the user experience by:
- Adding a concise guide banner at the top
- Explaining that the calculator models a one-time investment
- Highlighting key decision metrics for investors
- Clarifying that hardware cost declines represent market intelligence

### Question: How can we include the cost of capital in this calculation?
I enhanced the financial sophistication by:
- Adding a cost of capital input parameter (defaulting to 8%)
- Incorporating capital costs into the expense calculations
- Explaining how this affects investment evaluation
- Showing capital costs as a separate line item in projections

## Deployment Planning: Making It Available to Others

### Question: How can I put this on GitHub?
I explored options for publishing the calculator:
- Setting up a proper React project structure
- Using GitHub Pages for free hosting
- Installing necessary dependencies
- Configuring deployment scripts

### Final Thoughts: Sharing the Process
I decided to document the collaborative development process to:
- Share the problem-solving approach
- Demonstrate the iterative refinement of financial models
- Show how to build practical tools for investment analysis
- Provide a roadmap for others to extend this work

## Key Takeaways from the Process
1. **Financial Modeling Insights**
   - High upfront costs require careful ROI analysis
   - Accelerated depreciation significantly impacts profitability
   - Market evolution and competition will drive fare declines

2. **Technology Investment Considerations**
   - Early market entry has higher costs but potentially higher margins
   - Hardware cost declines benefit future, not current, investments
   - Competition from companies like Tesla will reshape the economics

3. **Tool Development Approach**
   - Interactive tools make complex decisions more accessible
   - Visual representation of data enhances understanding
   - User guidance is essential for financial tools

This project demonstrates how to approach a complex investment opportunity through systematic research, financial modeling, and interactive tool development.