import logging
import requests
from django.conf import settings
from core.celery import app
from news.documents import NewsDocument
from news.enums import NewsSource, NewsCategory
from news.processors.command import NewsCommand

logger = logging.getLogger(__name__)


@app.task
def get_all_news():
    for name, _source in NewsSource._member_map_.items(): # NOQA
        for name, category in NewsCategory._member_map_.items():
            if not _source.is_active:
                logger.info("source is not active: {}".format(name))
                continue
            if not _source.urls.get(str(category.value)):
                continue
            logger.info("process started for: {}".format(name))
            command = NewsCommand(source=_source, category=category)
            get_news(command=command)


@app.task
def get_news(command):
    command.execute()


@app.task
def insert_mongo(**kwargs):
    mongo_app_url = getattr(settings, "MONGOAPP_URL",
                            "http://localhost:3000/news/")
    kwargs["authentication"] = "topsecretacayipsecret"
    requests.post(mongo_app_url, data=kwargs)


@app.task
def insert_elasticsearch(**kwargs):
    news = NewsDocument(**kwargs)
    print("elasticsearch")
    news.save()