import uuid
from django.dispatch import receiver
from django.utils.text import slugify

from news.models import News
from news.tasks import insert_mongo, insert_elasticsearch
from news.managers import post_bulk_create, pre_bulk_create


@receiver(post_bulk_create, sender=News)
def news_insert_handler(sender, objs, **kwargs):

    for news in objs:
        item = dict(title=news.title, content=news.content,
                    origin_url=news.origin_url, image_url=news.image_url,
                    posted_at=news.posted_at, integration_id=news.id,
                    language=news.language, source=news.source,
                    category=news.category, slug=news.slug)
        # insert_mongo(**item)
        insert_elasticsearch(**item)


@receiver(pre_bulk_create, sender=News)
def news_slug_generator(sender, objs, **kwargs):
    for news in objs:
        unique_key = "-" + str(uuid.uuid4())[:8]
        news.slug = slugify(news.title) + unique_key
