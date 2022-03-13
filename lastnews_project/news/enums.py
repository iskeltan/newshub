import json
from enum import Enum

from django.conf import settings
from django.templatetags.static import static


def get_source(name):
    path = settings.BASE_DIR / "news/sources/{}.json".format(name)
    return json.load(open(path))


def get_logo(name):
    return static("{}.png".format(name))


class NewsSource(Enum):
    lastnews = 1
    bloomberg_ht = 2
    cnnturk = 3
    sabah = 4
    haberturk = 5
    ntv = 6
    ahaber = 7
    haberler = 8

    @property
    def klass(self) -> object:
        from news.processors import rss
        from news.processors.ntv import NtvProcessor
        klass_list = {
            2: rss.BloombergHtProcessor,
            3: rss.CnnTurkProcessor,
            4: rss.SabahProcessor,
            5: rss.HaberTurkProcessor,
            6: NtvProcessor,
            7: rss.AhaberProcessor,
            8: rss.HaberlerProcessor
        }

        return klass_list[self.value]

    @property
    def label(self) -> str:
        label_list = {
            self.lastnews.value: "NewsHub",
            self.bloomberg_ht.value: "Bloomberg HT",
            self.cnnturk.value: "CNN Türk",
            self.sabah.value: "Sabah",
            self.haberturk.value: "Habertürk",
            self.ntv.value: "NTV",
            self.ahaber.value: "A Haber",
            self.haberler.value: "Haberler"
        }

        return label_list[self.value]

    @property
    def logo(self) -> str:
        logo_list = {
            self.lastnews.value: get_logo("newshub"),
            self.bloomberg_ht.value: get_logo("bloomberg_ht"),
            self.cnnturk.value: get_logo("cnnturk"),
            self.sabah.value: get_logo("newshub"),
            self.haberturk.value: get_logo("haberturk"),
            self.ntv.value: get_logo("ntv"),
            self.ahaber.value: get_logo("ahaber"),
            self.haberler.value: get_logo("haberler")
        }

        return logo_list[self.value]

    @property
    def urls(self) -> dict:
        url_list = {
            self.bloomberg_ht.value: get_source("bloomberg_ht"),
            self.cnnturk.value: get_source("cnnturk"),
            self.sabah.value: get_source("sabah"),
            self.haberturk.value: get_source("haberturk"),
            self.ntv.value: get_source("ntv"),
            self.ahaber.value: get_source("ahaber"),
            self.haberler.value: get_source("haberler")
        }

        return url_list[self.value]

    def url(self) -> str:
        pass

    @property
    def is_active(self) -> bool:
        status = {
            1: False
        }
        return status.get(self.value, True)

    @property
    def language(self) -> str:
        language = {

        }
        return language.get(self.value, "tr")


class NewsCategory(Enum):
    general = 1
    breaking_news = 2
    economy = 3
    sport = 4
    agenda = 5
    life = 6
    world = 7
    technology = 8
    tourism = 9
    cars = 10
    health = 11
    in_day = 12
    art = 13
    magazine = 14

    @classmethod
    def choices(cls):
        return [(i.name, i.value) for i in cls]

    @property
    def label(self) -> str:
        label_list = {
            self.general.value: 'Genel',
            self.breaking_news.value: 'Son Dakika',
            self.economy.value: 'Ekonomi',
            self.sport.value: 'Spor',
            self.agenda.value: 'Agenda?',
            self.life.value: 'Yasam',
            self.world.value: 'Dunya',
            self.technology.value: 'Teknoloji',
            self.tourism.value: 'Turizm',
            self.cars.value: 'Arabalar',
            self.health.value: 'Saglik',
            self.in_day.value: 'Gun Icinden',
            self.art.value: 'Sanat',
            self.magazine.value: 'Magazin',
        }
        return label_list[self.value]