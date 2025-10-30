import pandas as pd
import io

def restore_linear(file_obj, output_path=None):
    return _restore(file_obj, output_path, method='linear')

def restore_polynomial(file_obj, order, output_path=None):
    return _restore(file_obj, output_path, method='polynomial', order=order)

def restore_spline(file_obj, order, output_path=None):
    return _restore(file_obj, output_path, method='spline', order=order)

def _restore(file_obj, output_path=None, method='linear', order=None):
    import pandas as pd
    import io

    if isinstance(file_obj, (bytes, str)):
        df = pd.read_csv(io.StringIO(file_obj.decode() if isinstance(file_obj, bytes) else file_obj))
    else:
        df = pd.read_csv(file_obj)

    if df.shape[1] != 2 or 'temperature' not in df.columns:
        raise ValueError("Ожидается файл с колонками: 'id' и 'temperature'.")

    kwargs = {"method": method, "limit_direction": "both"}
    if method in ['polynomial', 'spline']:
        if order is None:
            raise ValueError("Параметр order обязателен для polynomial/spline.")
        kwargs["order"] = order

    df['temperature'] = df['temperature'].interpolate(**kwargs)

    return df.to_csv(index=False)
