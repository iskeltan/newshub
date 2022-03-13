from django.db import models

from core.models import BaseModel
from news.enums import NewsSource, NewsCategory
from news.managers import CustomQuerySet


class News(BaseModel):
    title = models.CharField(max_length=500)
    slug = models.SlugField(max_length=500, db_index=True)
    content = models.TextField()
    image_url = models.URLField(max_length=500,
                                default="https://via.placeholder.com/500")
    origin_url = models.URLField(max_length=500)
    source = models.IntegerField(default=NewsSource.lastnews.value, db_index=True)
    category = models.IntegerField(default=NewsCategory.general.value)
    posted_at = models.DateTimeField(auto_now_add=True)
    language = models.CharField(default="tr", max_length=3)

    objects = CustomQuerySet.as_manager()

    def __str__(self):
        return self.title[:50]
