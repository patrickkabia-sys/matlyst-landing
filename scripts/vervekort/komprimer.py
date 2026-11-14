"""Komprimerer en PNG til en palett-PNG (256 farger, Floyd-Steinberg) på stedet.

Brukes av render.mjs. Kjør: python3 -I komprimer.py <fil.png>
"""
import sys
from PIL import Image

sti = sys.argv[1]
bilde = Image.open(sti).convert('RGB')
palett = bilde.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
palett.save(sti, optimize=True)
