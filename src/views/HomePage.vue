<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="page-container">
    <div class="hero-section">
      <h2>Personal Finance Calculator Suite</h2>
      <p class="hero-description">
        Make smarter financial decisions with our collection of specialized calculators. 
        All data is saved locally in your browser for privacy and convenience.
      </p>
    </div>
    
    <div class="calculator-list">
      <RouterLink to="/coast-fire" class="calculator-card">
        <div class="card-icon">🔥</div>
        <h3>Coast FIRE Calculator</h3>
        <p>Discover when you can stop saving for retirement and let compound interest work for you. Perfect for understanding if your current savings will grow enough to meet your retirement goals.</p>
        <div class="card-features">
          <span class="feature">✓ Future value projections</span>
          <span class="feature">✓ Coast FIRE timeline</span>
          <span class="feature">✓ Savings gap analysis</span>
        </div>
      </RouterLink>
      
      <RouterLink to="/mortgage-payoff" class="calculator-card">
        <div class="card-icon">🏠</div>
        <h3>Mortgage Payoff Calculator</h3>
        <p>Compare mortgage payoff strategies vs investing extra payments. Includes tax considerations and personalized recommendations based on your specific situation.</p>
        <div class="card-features">
          <span class="feature">✓ Interest savings calculator</span>
          <span class="feature">✓ Investment comparison</span>
          <span class="feature">✓ Tax-adjusted returns</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}

.hero-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.hero-description {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.calculator-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.calculator-card {
  display: block;
  text-decoration: none;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.calculator-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transform: translateY(-2px);
  border-color: #409eff;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.calculator-card h3 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
}

.calculator-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.card-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.feature {
  color: #409eff;
  font-size: 0.9rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .calculator-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .calculator-card {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section h2 {
    font-size: 1.75rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .hero-section {
    margin-bottom: 2rem;
  }
  
  .card-icon {
    font-size: 2.5rem;
  }
  
  .calculator-card h3 {
    font-size: 1.25rem;
  }
  
  .calculator-card p {
    font-size: 0.9rem;
  }
}
</style>