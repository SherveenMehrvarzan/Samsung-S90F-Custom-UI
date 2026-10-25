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
    for name in ('index.html', 'style.css', 'app.js', 'config.xml', 'wallpaper.svg', 'appearance.js', 'icon.svg', 'icon.png','refinement.css','InterVariable.ttf','Inter-OFL.txt','sound.js','logos/appletv.svg','logos/youtube.svg','logos/youtubetv.svg','logos/youtubekids.svg','logos/spotify.svg','logos/smartthings.svg','logos/tubi.svg','logos/perplexity.svg','weather.js','logos/Simple-Icons-LICENSE.txt','logos/netflix.svg','logos/hbo.svg','logos/prime.jpg','logos/hulu.svg','logos/twitch.svg'):
        package.write(app / name, name)
print(destination)

