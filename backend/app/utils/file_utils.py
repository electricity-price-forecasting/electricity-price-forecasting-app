from pathlib import Path
import pandas as pd


def save_csv(dataset: pd.DataFrame, file_path: str | Path) -> None:

    output = Path(file_path)
    output.parent.mkdir(parents=True, exist_ok=True)

    dataset.to_csv(output, index_label="timestamp")
