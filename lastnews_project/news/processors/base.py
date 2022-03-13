from __future__ import annotations

import random
from concurrent.futures import ThreadPoolExecutor, as_completed
import logging
from pyexpat import ExpatError
from typing import Any

import requests
import xmltodict
from django.db.models import Q
from django.db.transaction import atomic

from core.enums import ResponseType
from core.exceptions import ProcessorValidationError
from news.enums import NewsCategory

from news.models import News, NewsSource
from news.serializers import NewsSerializer

logger = logging.getLogger(__name__)


class BaseProcessor(object):

    def __init__(self, category: NewsCategory):
        self.category = category

    @property
    def url(self):
        return self.source.urls.get(str(self.category.value),str(NewsCategory.general.value))

    class Meta:
        abstract = True

    @property
    def source(self) -> NewsSource:
        raise NotImplemented

    @property
    def response_type(self) -> ResponseType:
        raise NotImplemented

    def date_parser(self, value: str):
        raise NotImplemented

    def _validate_data(self, response):
        if self.response_type == ResponseType.json:
            return response.json()
        elif self.response_type == ResponseType.xml:
            try:
                return xmltodict.parse(response.content)
            except ExpatError:
                return []
        elif self.response_type == ResponseType.rss:
            try:
                data = xmltodict.parse(response.content)
            except ExpatError:
                return []
            try:
                return data["rss"]["channel"]["item"]
            except KeyError:
                return []

    def _request(self, url):
        req = requests.get(url)
        return req

    def get_data(self) -> Any:
        if isinstance(self.url, list):
            threads = []
            with ThreadPoolExecutor(max_workers=20) as executor:
                data = []
                for _url in self.url:
                    threads.append(executor.submit(self._request, _url))
            for task in as_completed(threads):
                try:
                    response = task.result()
                except ConnectionError:
                    continue
                data.extend(self._validate_data(response))
        else:
            response = requests.get(self.url)
            data = self._validate_data(response)

        return data

    def normalize(self, line: dict) -> dict:
        if self.response_type == ResponseType.rss:
            posted_at = self.date_parser(line["pubDate"])
            return dict(title=line["title"],
                        content=line["description"],
                        image_url=line.get("image"),
                        origin_url=line["link"],
                        source=self.source.value,
                        category=self.category.value,
                        language=self.source.language,
                        posted_at=posted_at)
        raise NotImplemented

    def serialize(self, line: dict) -> dict | bool:
        serializer = NewsSerializer(data=line)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            logger.exception(e)
            return False
        return serializer.validated_data

    def validate(self, line: dict):
        if line is False:
            raise ProcessorValidationError("pass")
        if not isinstance(line, dict):
            raise ProcessorValidationError("data type is not dict")
        _filters = Q(title=line["title"]) | Q(origin_url=line["origin_url"])
        exist_control = News.objects.filter(_filters).exists()
        if exist_control:
            raise ProcessorValidationError("title or origin_url must be unique")
        return True

    @atomic()
    def save(self, lines: list) -> bool:
        try:
            random.shuffle(lines)
            News.objects.bulk_create(lines)
        except Exception as e:
            logger.exception(e)
            return False
        return True

    def process(self) -> bool:
        data = self.get_data()
        if not isinstance(data, list):
            return False
        bulk_objects = list()
        for line in data:
            normalized_data = self.normalize(line)
            serialized_data = self.serialize(normalized_data)
            # import ipdb;ipdb.set_trace()
            try:
                self.validate(serialized_data)
            except ProcessorValidationError as e:
                continue
            bulk_objects.append(News(**serialized_data))

        try:
            self.save(bulk_objects)
            return True
        except Exception as e:
            logger.exception(e)
            return False

