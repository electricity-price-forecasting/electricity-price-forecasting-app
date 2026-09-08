function FormulaSection() {
  return (
    <section className="formula-section" id="formula">
      <div className="section-label">
        <span>03</span>
        Calculation
      </div>

      <div className="formula-layout">
        <div>
          <p className="mini-label">THE FORMULA</p>

          <h2>
            Simple mathematics.
            <br />
            Clear result.
          </h2>

          <div className="formula">
            consumption × tariff
          </div>
        </div>

        <div className="steps">
          <div className="step">
            <span>01</span>

            <div>
              <h3>Enter consumption</h3>

              <p>
                Enter how much electricity you
                use in kWh.
              </p>
            </div>
          </div>

          <div className="step">
            <span>02</span>

            <div>
              <h3>Enter tariff</h3>

              <p>
                Add your current electricity price
                per kWh.
              </p>
            </div>
          </div>

          <div className="step">
            <span>03</span>

            <div>
              <h3>Get the result</h3>

              <p>
                Instantly see your daily, monthly
                and annual cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FormulaSection;