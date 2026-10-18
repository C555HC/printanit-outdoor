#!/usr/bin/env python3
"""Serve the project locally; never submit requests to the production site."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse

parser = argparse.ArgumentParser(description="Локальный просмотр главной Принтанит")
parser.add_argument("--port", type=int, default=4173)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(root), **kwargs)

if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print(f"Local: http://127.0.0.1:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
