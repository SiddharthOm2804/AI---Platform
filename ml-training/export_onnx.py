from pathlib import Path
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

def export_to_onnx(model, input_shape: int, output_path: Path):
    """
    Converts a trained scikit-learn model to ONNX format and saves it.
    """
    initial_type = [("input", FloatTensorType([None, input_shape]))]
    onnx_model = convert_sklearn(model, initial_types=initial_type)
    
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, "wb") as f:
        f.write(onnx_model.SerializeToString())
    
    print(f"Exported ONNX model successfully to {output_path}")
    return output_path
