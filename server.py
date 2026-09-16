"""
Mausam Mitra — 1-Click Local Prototype Server
Serves frontend static files and opens default web browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

def run_server():
    print("=" * 60)
    print("  [WEATHER] MAUSAM MITRA -- AI PERSONALIZED PROTOTYPE (MoES / IMD)")
    print("=" * 60)
    print(f"  Serving directory: {DIRECTORY}")
    print(f"  Local URL:        http://localhost:{PORT}")
    print("  Press Ctrl+C to stop.")
    print("=" * 60)

    # Only open browser if not in headless or background automation test
    if os.environ.get("NO_BROWSER") != "1":
        opened = False
        if sys.platform == "win32":
            import subprocess
            chrome_paths = [
                os.path.expandvars(r"%ProgramFiles%\Google\Chrome\Application\chrome.exe"),
                os.path.expandvars(r"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"),
                os.path.expandvars(r"%LocalAppData%\Google\Chrome\Application\chrome.exe"),
                os.path.expandvars(r"%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"),
                os.path.expandvars(r"%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"),
            ]
            for cp in chrome_paths:
                if os.path.exists(cp):
                        subprocess.Popen([
                            cp, 
                            "--autoplay-policy=no-user-gesture-required",
                            "--use-fake-ui-for-media-stream",
                            "--unsafely-treat-insecure-origin-as-secure=http://localhost:8080",
                            f"http://localhost:{PORT}"
                        ])
                        opened = True
                        break
                    except Exception:
                        pass
        if not opened:
            try:
                webbrowser.open(f"http://localhost:{PORT}")
            except Exception:
                pass

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()

if __name__ == "__main__":
    run_server()
