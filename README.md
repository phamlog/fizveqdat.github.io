# Cyber ELITE Portfolio — Flask + Docker (Render)
Max-polish cyber theme: matrix + stars + aurora, glitch, reveal animations, radar chart, timeline, badges, copy, command palette, toggles.

## Run
```bash
python -m venv .venv
# Windows: .\.venv\Scripts\activate
# Linux/Mac: source .venv/bin/activate
pip install -r requirements.txt
python app/app.py  # http://localhost:8080
```

## Docker
```bash
docker build -t flask-cyber-elite .
docker run -p 8080:8080 -e PORT=8080 flask-cyber-elite
```

## Customize
- Edit `app/data/site.json`: photo, tagline, stats, skills, timeline, badges, projects, exercises, contacts.
- Replace `app/static/avatar.jpg` and set `"photo": "/static/avatar.jpg"`.
- Toggles: Matrix / Noise / Aggro-Stealth (accent). Ctrl/Cmd + K to open palette.
