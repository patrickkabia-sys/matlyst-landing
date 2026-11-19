"""Testtjener for Playwright: tradet og med stor lyttekø.
Standard http.server har kø på 5 og nullstiller tilkoblinger når flere workers laster samtidig.
Bruk: python3 tjener.py PORT"""
import http.server
import sys


class Tjener(http.server.ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True


class Stille(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    Tjener(('127.0.0.1', port), Stille).serve_forever()
