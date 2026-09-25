from zipfile import ZipFile
from pathlib import Path
import re
import xml.etree.ElementTree as ET

p = Path("G:/23/nextChapter/gpttest-presentation/output/GPTTest-2-minute-presentation-v3.pptx")
with ZipFile(p) as z:
    names = z.namelist()
    slides = sorted((n for n in names if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)), key=lambda n: int(re.search(r"(\d+)\.xml", n).group(1)))
    notes = sorted((n for n in names if re.fullmatch(r"ppt/notesSlides/notesSlide\d+\.xml", n)), key=lambda n: int(re.search(r"(\d+)\.xml", n).group(1)))
    ns = {"a": "http://schemas.openxmlformats.org/drawingml/2006/main"}
    def text(n):
        return " ".join(t.text or "" for t in ET.fromstring(z.read(n)).findall(".//a:t", ns))
    checks = [term in text(n) for term,n in zip(
        ["authorized red-team evaluator", "normal demonstration", "repeatable process", "highest-risk factual boundary", "private scope instructions", "audit trail"], notes
    )]
    closing = 'From "it seems safe" to "we tested the boundary."' in text(slides[5])
    slide5 = text(slides[4])
    images = z.read(slides[4]).count(b"<a:blip ")
    print({"slides":len(slides),"notes":len(notes),"note_checks":checks,"closing_line":closing,"slide5_images":images,"slide5_claims":("MealPlanGPT" in slide5 and "three full copies" in slide5)})
    assert len(slides)==6 and len(notes)==6 and all(checks) and closing and images==4

