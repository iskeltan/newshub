from news.enums import NewsSource, NewsCategory


class NewsCommand(object):

    def __init__(self, source: NewsSource, category: NewsCategory):
        self.processor = source.klass(category=category)

    def execute(self):
        self.processor.process()
