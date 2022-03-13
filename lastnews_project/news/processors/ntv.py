import logging
from datetime import datetime

from django.utils import timezone

from core.enums import ResponseType
from news.enums import NewsSource
from news.processors.base import BaseProcessor

logger = logging.getLogger(__name__)


class NtvProcessor(BaseProcessor):

    @property
    def source(self) -> NewsSource:
        return NewsSource.ntv

    @property
    def response_type(self) -> ResponseType:
        return ResponseType.xml

    def _validate_data(self, response):
        data = super()._validate_data(response)
        return data["feed"]["entry"]

    def date_parser(self, value: str):
        try:
            return datetime.strptime(value, "%Y-%m-%dT%H:%M:%S%z")
        except ValueError:
            return timezone.now()

    def normalize(self, line: dict) -> dict:
        posted_at = self.date_parser(line["published"])
        image_url = "https://via.placeholder.com/500"
        content = line["content"]["#text"]
        try:
            image_url = content.split('<img src="')[1].split('"')[0]
        except KeyError:
            pass

        return dict(title=line["title"]["#text"],
                    content=content,
                    image_url=image_url,
                    origin_url=line["link"]["@href"],
                    source=self.source.value,
                    category=self.category.value,
                    language=self.source.language,
                    posted_at=posted_at)
