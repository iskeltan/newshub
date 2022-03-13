import logging
from datetime import datetime

from django.utils import timezone

from core.enums import ResponseType
from news.enums import NewsSource
from news.processors.base import BaseProcessor


logger = logging.getLogger(__name__)


class BaseRssProcessor(BaseProcessor):

    @property
    def response_type(self) -> ResponseType:
        return ResponseType.rss

    def date_parser(self, value: str):
        try:
            return datetime.strptime(value, "%a, %d %b %Y %H:%M:%S %Z")
        except ValueError:
            logger.exception("date parse error")
        return timezone.now()


class CnnTurkProcessor(BaseRssProcessor):

    @property
    def source(self) -> NewsSource:
        return NewsSource.cnnturk


class SabahProcessor(BaseRssProcessor):

    @property
    def source(self) -> NewsSource:
        return NewsSource.sabah

    def date_parser(self, value: str):
        try:
            return datetime.strptime(value, "%a, %d %b %Y %H:%M:%S %z")
        except ValueError:
            try:
                return datetime.strptime(value, "%a, %d %b %Y %H:%M:%S %Z")
            except ValueError:
                logger.exception("date parse error")

        return timezone.now()

    def normalize(self, line: dict) -> dict:
        try:
            image_url = line["enclosure"]["@url"]
            image_url = image_url.split("=")[1]
            line["image"] = image_url
        except (IndexError, KeyError, TypeError):
            line["image"] = "https://via.placeholder.com/500"

        return super().normalize(line)


class AhaberProcessor(SabahProcessor):
    @property
    def source(self) -> NewsSource:
        return NewsSource.ahaber


class BloombergHtProcessor(BaseRssProcessor):

    @property
    def source(self) -> NewsSource:
        return NewsSource.bloomberg_ht

    def date_parser(self, value: str) -> timezone:
        try:
            return datetime.strptime(value, "%a, %d %b %Y %H:%M:%S %z")
        except ValueError:
            logger.exception("date parse error")
        return timezone.now()


class HaberTurkProcessor(BaseRssProcessor):

    @property
    def source(self) -> NewsSource:
        return NewsSource.haberturk

    def normalize(self, line: dict) -> dict:
        try:
            image_url = line["enclosure"]["url"]
            line["image"] = image_url
        except KeyError:
            line["image"] = "https://via.placeholder.com/500"

        data = super().normalize(line)
        if not data["origin_url"].startswith("https:"):
            data["origin_url"] = "https:{}".format(data["origin_url"])
        if not data["origin_url"].startswith("https://"):
            data["origin_url"] = "https://haberturk.com/"
        return data


class HaberlerProcessor(BaseRssProcessor):

    @property
    def source(self) -> NewsSource:
        return NewsSource.haberler

    def normalize(self, line: dict) -> dict:
        try:
            image_url = line["enclosure"]["url"]
            line["image"] = image_url
        except KeyError:
            line["image"] = "https://via.placeholder.com/500"

        return super().normalize(line)
