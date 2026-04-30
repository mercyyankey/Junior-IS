import pandas as pd
import re
from pathlib import Path

INPUT = Path("assets/twi-dataset/data.csv")
OUTPUT = Path("data/twiDataset.ts")

df = pd.read_csv(INPUT, sep="\t", engine="python", on_bad_lines="skip")

df = df.rename(columns={
    "Transcription": "twi",
    "Translation": "english",
    "Audio Filepath": "audioPath",
})

df = df[["twi", "english", "audioPath"]].dropna()

df = df.drop_duplicates(subset=["twi", "english"])

def is_good(row):
    english = str(row["english"]).strip()
    twi = str(row["twi"]).strip()

    if len(english.split()) > 8:
        return False

    if len(twi.split()) > 10:
        return False

    return True

df = df[df.apply(is_good, axis=1)].head(80)

def make_id(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:40] or "entry"

OUTPUT.parent.mkdir(exist_ok=True)

lines = [
"""export type TwiEntry = {
  id: string;
  twi: string;
  english: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  audioPath: string;
  source: string;
};

export const TWI_DATA: TwiEntry[] = [
"""
]

for _, row in df.iterrows():
    twi = str(row["twi"]).replace("'", "\\'")
    english = str(row["english"]).replace("'", "\\'")
    audio = str(row["audioPath"]).split("/")[-1].replace("'", "\\'")

    lines.append(f"""  {{
    id: '{make_id(english)}',
    twi: '{twi}',
    english: '{english}',
    category: 'general',
    difficulty: 'easy',
    audioPath: '{audio}',
    source: 'FISD Akuapim Twi 90%, CC BY 4.0',
  }},
""")

lines.append("];\n")

OUTPUT.write_text("".join(lines), encoding="utf-8")

print(f"Created {OUTPUT} with {len(df)} entries.") 