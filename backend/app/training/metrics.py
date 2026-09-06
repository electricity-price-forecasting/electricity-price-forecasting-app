import numpy as np
import pandas as pd



def calculate_mae(
    y_true: pd.Series,
    y_pred: np.ndarray,
) -> float:
    return float(np.mean(np.abs(y_true - y_pred)))


def calculate_rmse(
    y_true: pd.Series,
    y_pred: np.ndarray,
) -> float:
    return float(
        np.sqrt(np.mean((y_true - y_pred) ** 2))
    )
