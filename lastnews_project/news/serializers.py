from rest_framework import serializers

from news.enums import NewsSource, NewsCategory
from news.models import News


class NewsSerializer(serializers.ModelSerializer):

    # source = serializers.SerializerMethodField()
    # category = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = ("id", "slug", "title", "content", "image_url",
                  "origin_url", "source", "posted_at", "category")
        read_only_fields = ("slug", )

    # def get_source(self, instance):
    #     if not instance.id:
    #         return instance.source
    #     return NewsSource(instance.source).name
    #
    # def get_category(self, instance):
    #     if not instance.id:
    #         return instance.category
    #     return NewsCategory(instance.category).name
