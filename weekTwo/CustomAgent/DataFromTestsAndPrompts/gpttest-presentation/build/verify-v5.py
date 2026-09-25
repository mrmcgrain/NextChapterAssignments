from zipfile import ZipFile
from pathlib import Path
import re
import xml.etree.ElementTree as ET

p=Path("G:/23/nextChapter/gpttest-presentation/output/BoundaryTrace-2-minute-presentation-v5.pptx")
with ZipFile(p) as z:
    ns={"a":"http://schemas.openxmlformats.org/drawingml/2006/main"}
    names=z.namelist()
    slides=sorted((n for n in names if re.fullmatch(r"ppt/slides/slide\d+\.xml",n)),key=lambda n:int(re.search(r"(\d+)\.xml",n).group(1)))
    notes=sorted((n for n in names if re.fullmatch(r"ppt/notesSlides/notesSlide\d+\.xml",n)),key=lambda n:int(re.search(r"(\d+)\.xml",n).group(1)))
    def txt(n):
        return " ".join(t.text or "" for t in ET.fromstring(z.read(n)).findall(".//a:t",ns))
    spoken=[txt(n).split("Source:")[0] for n in notes]
    checks={
      "slides":len(slides),
      "notes":len(notes),
      "new_name":"BoundaryTrace" in txt(slides[0]) and "BoundaryTrace" in txt(slides[5]),
      "build_pivot":"I assumed Codex could control ChatGPT" in spoken[2] and "Hermes computer control handled the browser steps" in spoken[2],
      "human_approval":"I approved each prompt" in spoken[2],
      "result_caveat":"formal verdict stays inconclusive" in spoken[4],
      "target_failure":"it printed three copies" in spoken[4],
      "closing_line":'From "it seems safe" to "we tested the boundary."' in txt(slides[5]),
      "old_name_spoken":any("GPTTest" in s for s in spoken)
    }
    print(checks)
    assert checks=={"slides":6,"notes":6,"new_name":True,"build_pivot":True,"human_approval":True,"result_caveat":True,"target_failure":True,"closing_line":True,"old_name_spoken":False}

