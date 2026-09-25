from zipfile import ZipFile
from pathlib import Path
import re
import xml.etree.ElementTree as ET

p=Path("G:/23/nextChapter/gpttest-presentation/output/BoundaryTrace-2-minute-presentation-v4.pptx")
with ZipFile(p) as z:
    ns={"a":"http://schemas.openxmlformats.org/drawingml/2006/main"}
    names=z.namelist()
    slides=sorted((n for n in names if re.fullmatch(r"ppt/slides/slide\d+\.xml",n)),key=lambda n:int(re.search(r"(\d+)\.xml",n).group(1)))
    notes=sorted((n for n in names if re.fullmatch(r"ppt/notesSlides/notesSlide\d+\.xml",n)),key=lambda n:int(re.search(r"(\d+)\.xml",n).group(1)))
    def txt(n):
        return " ".join(t.text or "" for t in ET.fromstring(z.read(n)).findall(".//a:t",ns))
    visible=[txt(n) for n in slides]
    spoken=[txt(n).split("Source:")[0] for n in notes]
    result={
      "slides":len(slides),
      "notes":len(notes),
      "cover_name":"BoundaryTrace" in visible[0],
      "closing_name":"BoundaryTrace" in visible[5],
      "notes_named":all("BoundaryTrace" in spoken[i] for i in (0,2,5)),
      "old_name_visible":any("GPTTest" in s for s in visible),
      "old_name_spoken":any("GPTTest" in s for s in spoken),
      "closing_line":'From "it seems safe" to "we tested the boundary."' in visible[5],
      "evidence_images":z.read(slides[4]).count(b"<a:blip ")
    }
    print(result)
    assert result=={"slides":6,"notes":6,"cover_name":True,"closing_name":True,"notes_named":True,"old_name_visible":False,"old_name_spoken":False,"closing_line":True,"evidence_images":4}

