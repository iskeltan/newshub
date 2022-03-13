from django.apps import AppConfig


class NewsConfig(AppConfig):
    name = 'news'

    def ready(self):
        from news.signals import news_insert_handler