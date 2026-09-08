import { useMemo, useState } from 'react';

import Header from './components/Header';
import Hero from './components/Hero';
import Calculator from './components/Calculator';
import Results from './components/Results';
import FormulaSection from './components/FormulaSection';
import EnergyImage from './components/EnergyImage';
import Footer from './components/Footer';

function App() {
  const [consumption, setConsumption] = useState<number>(350);
  const [tariff, setTariff] = useState<number>(4.32);

  const calculation = useMemo(() => {
    const monthly = consumption * tariff;
    const daily = monthly / 30;
    const annual = monthly * 12;

    return {
      monthly,
      daily,
      annual,
    };
  }, [consumption, tariff]);

  const resetCalculator = () => {
    setConsumption(350);
    setTariff(4.32);
  };

  return (
    <div className="site">
      <Header />

      <main>
        <Hero />

        <section className="calculator-section" id="calculator">
          <div className="section-label">
            <span>01</span>
            Electricity calculator
          </div>

          <Calculator
            consumption={consumption}
            tariff={tariff}
            onConsumptionChange={setConsumption}
            onTariffChange={setTariff}
            onReset={resetCalculator}
          />

          <Results
            monthly={calculation.monthly}
            daily={calculation.daily}
            annual={calculation.annual}
          />
        </section>

        <FormulaSection />

        <EnergyImage />
      </main>

      <Footer />
    </div>
  );
}

export default App;