"""Build only the application assets into an unsigned Tizen WGT."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parents[1]
app = root / 'app'
ET.parse(app / 'config.xml')
destination = root / 'dist' / 'QuietHome-unsigned.wgt'
destination.parent.mkdir(exist_ok=True)
with ZipFile(destination, 'w', ZIP_DEFLATED) as package:
    for name in ('index.html', 'style.css', 'app.js', 'config.xml'):
        package.write(app / name, name)
print(destination)

