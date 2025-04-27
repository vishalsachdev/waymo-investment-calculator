# Waymo Robotaxi Investment Calculator: Assumptions and Justifications

This document provides detailed explanations and sources for all numerical assumptions used in the Waymo robotaxi investment calculator. These values represent our best estimates based on current market data, industry trends, and publicly available information as of April 2025.

## Investment Parameters

### Base Vehicle Cost: $73,275
- Based on the current MSRP of the 2025 Jaguar I-PACE EV400
- Waymo currently uses the Jaguar I-PACE as their primary vehicle platform
- Sources: Jaguar official pricing, Kelley Blue Book, Edmunds

### Autonomous Hardware Cost: $100,000
- Derived from Waymo CTO Dmitri Dolgov's statement that the autonomous hardware costs "up to $100,000 per vehicle"
- Includes LIDAR systems, cameras, radar, computing hardware, and integration costs
- Sources: Waymo public statements, Reuters reporting, Wikipedia

### Cost of Capital: 8%
- Standard rate of return expected from alternative investments with similar risk profiles
- Typical range for risky capital investments is 8-15%
- Conservative estimate considering the emerging nature of the autonomous vehicle market

## Revenue Parameters

### Hours Per Day: 12
- Industry standard for commercial fleet operation considering:
  - Charging time requirements (approximately 1-2 hours per day)
  - Maintenance windows
  - Lower demand during off-peak hours
- Conservative compared to maximum possible utilization (24 hours)

### Days Per Week: 6
- Allows for one day of scheduled maintenance and deep cleaning
- Standard commercial vehicle operation schedule
- Balances maximum utilization with vehicle longevity

### Trip Length (Miles): 4
- Based on average urban rideshare trip data
- Consistent with reported Waymo user experiences in San Francisco, Phoenix
- Sources: Rideshare industry reports, Waymo user data

### Trip Length (Minutes): 15
- Factors in:
  - Average urban speeds (12-16 mph)
  - Pickup and dropoff times
  - Traffic conditions
- Consistent with reported rideshare metrics

### Initial Fare Per Mile: $11.84
- Based on actual Waymo pricing in San Francisco during 2024
- Calculated from user reports of 70 Waymo rides showing average fare of $11.84 per mile
- Sources: User reports, independent analyses of Waymo pricing structure

### Fare Decline Rate: 15% per year
- Reflects expected market maturation and increased competition
- Based on historical patterns in rideshare industry where prices declined after initial premium pricing
- Conservative estimate compared to some analyst projections of 20-25% annual fare declines

## Expense Parameters

### Depreciation Rate: 33% per year
- Significantly higher than standard vehicle depreciation (15-20%)
- Justified by:
  - High annual mileage (60,000 vs. typical 12,000-15,000)
  - Rapid technology obsolescence for autonomous systems
  - Commercial vehicle usage patterns
- Results in 3-year effective vehicle lifespan, typical for high-utilization commercial fleets

### Maintenance Costs: $5,000 per year
- Higher than typical EV maintenance due to:
  - Commercial usage
  - Specialized autonomous systems maintenance
  - Preventative maintenance requirements
- Based on reported Tesla maintenance costs for rideshare scaled for additional autonomous components

### Insurance Costs: $10,000 per year
- Reflects higher commercial insurance rates
- Includes:
  - Commercial liability coverage
  - Specialized autonomous vehicle coverage
  - Passenger coverage
- Based on commercial fleet insurance rates with premium for new technology

### Cleaning Costs: $5,000 per year
- Based on:
  - Daily basic cleaning ($10 per day)
  - Weekly deep cleaning ($50 per week)
  - Quarterly professional detailing ($200 per quarter)
- Critical for maintaining high customer ratings and vehicle longevity

### Charging Costs: $3,000 per year
- Calculated from:
  - 60,000 annual miles
  - Jaguar I-PACE efficiency (2.5 miles per kWh)
  - Average commercial electricity rates ($0.12 per kWh)
  - Includes fast charging premiums

### Software Licensing: $20,000 per year
- Estimated cost for Waymo's autonomous driving software license
- Includes:
  - Map data updates
  - AI model improvements
  - Security updates
  - Remote monitoring
- Based on industry software-as-a-service (SaaS) pricing models for critical systems

## Market Parameters

### Base Vehicle Cost Decline: 10% per year
- Based on historical EV price trends as technology matures
- Conservative estimate considering:
  - Battery technology improvements
  - Manufacturing scale efficiencies
  - Competitive market pressures

### Autonomous Hardware Decline: 20% per year
- Higher than vehicle cost decline due to:
  - Faster innovation in sensor technology (LIDAR, cameras)
  - Computing hardware following Moore's Law trends
  - Increased competition in the AV component space
- Consistent with historical declines in advanced sensing technology

## Competition Parameters

### Tesla Cost Advantage: 30%
- Based on Elon Musk's statement that Tesla vehicles cost "a quarter, 20%" of what a Waymo costs
- Conservative interpretation of Musk's claim considering:
  - Tesla's vision-only approach vs. Waymo's LIDAR-based system
  - Tesla's manufacturing scale advantages
  - Vertical integration benefits

### Tesla Pricing Impact: 25% per year
- Models accelerated fare decline due to low-cost competition
- Higher than standard fare decline (15%) to reflect competitive pressure
- Based on Tesla's historical pricing strategy of undercutting established competitors

## Utilization Calculations

### Trips Per Day: 48
- Derived from:
  - 12 hours of operation
  - 15 minutes per trip
  - No deadheading (empty miles) factored in
- Conservative compared to maximum theoretical trips (96 per day with 24-hour operation)

### Annual Trips: 14,976
- Calculated from:
  - 48 trips per day
  - 6 days per week
  - 52 weeks per year
- Results in 312 operational days per year

### Annual Miles: 59,904
- Derived from:
  - 14,976 trips per year
  - 4 miles per trip
- Consistent with high-utilization commercial vehicle usage

## Modeling Limitations and Considerations

- The model assumes stable regulatory environments across projected years
- No catastrophic events affecting autonomous vehicle perception are factored in
- Technology improvements are assumed to follow historical trends
- No additional revenue streams (advertising, data monetization) are included
- Potential salvage value at end of useful life is not factored into calculations

These assumptions provide a balanced view that's neither overly optimistic nor pessimistic about the potential returns from a Waymo robotaxi investment. Users can adjust parameters based on their own risk tolerance and market beliefs.
