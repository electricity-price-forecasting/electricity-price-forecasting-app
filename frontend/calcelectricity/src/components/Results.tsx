interface ResultsProps {
  monthly: number;
  daily: number;
  annual: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 2,
  }).format(value);
}

function Results({
  monthly,
  daily,
  annual,
}: ResultsProps) {
  return (
    <section className="results" id="results">
      <div className="section-label">
        <span>02</span>
        Estimated cost
      </div>

      <div className="results-grid">
        <article className="result-card result-card-main">
          <span className="result-label">
            Monthly cost
          </span>

          <strong>
            {formatCurrency(monthly)}
          </strong>

          <p>
            Estimated electricity cost for one
            month.
          </p>
        </article>

        <article className="result-card">
          <span className="result-label">
            Daily cost
          </span>

          <strong>
            {formatCurrency(daily)}
          </strong>

          <p>
            Approximate daily electricity expense.
          </p>
        </article>

        <article className="result-card">
          <span className="result-label">
            Annual cost
          </span>

          <strong>
            {formatCurrency(annual)}
          </strong>

          <p>
            Estimated annual electricity cost.
          </p>
        </article>
      </div>
    </section>
  );
}

export default Results;