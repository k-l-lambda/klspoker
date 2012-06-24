
import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import template


class SampleComapresHandler(webapp.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'templates/compares.html')
        self.response.out.write(template.render(path, {}))


class SampleChessHandler(webapp.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'templates/chess.html')
        self.response.out.write(template.render(path, {}))


def main():
    application = webapp.WSGIApplication([
        ('/samples/compares',                       SampleComapresHandler),
        ('/samples/chess',                          SampleChessHandler),
        ], debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
