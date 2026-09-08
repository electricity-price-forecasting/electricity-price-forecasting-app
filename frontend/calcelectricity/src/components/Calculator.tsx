interface CalculatorProps {
  consumption: number;
  tariff: number;
  onConsumptionChange: (value: number) => void;
  onTariffChange: (value: number) => void;
  onReset: () => void;
}

function Calculator({
  consumption,
  tariff,
  onConsumptionChange,
  onTariffChange,
  onReset,
}: CalculatorProps) {
  return (
    <div className="calculator">
      <div className="calculator-header">
        <div>
          <span className="mini-label">INPUT</span>

          <h2>
            Enter your
            <br />
            electricity data
          </h2>
        </div>

        <span className="calculator-number">01</span>
      </div>

      <div className="form-grid">
        <label className="field">
          <span className="field-label">
            Electricity consumption
          </span>

          <div className="input-wrapper">
            <input
              type="number"
              min="0"
              step="0.01"
              value={consumption}
              onChange={(event) =>
                onConsumptionChange(
                  Math.max(0, Number(event.target.value))
                )
              }
              aria-label="Electricity consumption"
            />

            <span>kWh</span>
          </div>
        </label>

        <label className="field">
          <span className="field-label">
            Electricity tariff
          </span>

          <div className="input-wrapper">
            <input
              type="number"
              min="0"
              step="0.01"
              value={tariff}
              onChange={(event) =>
                onTariffChange(
                  Math.max(0, Number(event.target.value))
                )
              }
              aria-label="Electricity tariff"
            />

            <span>₴ / kWh</span>
          </div>
        </label>
      </div>

      <div className="calculator-actions">
        <button
          type="button"
          className="primary-button"
          onClick={() =>
            document
              .getElementById('results')
              ?.scrollIntoView({
                behavior: 'smooth',
              })
          }
        >
          Calculate cost
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Calculator;