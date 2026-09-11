from dataclasses import dataclass


@dataclass(frozen=True)
class GenerationModel:
    load: float
    wind: float
    solar: float