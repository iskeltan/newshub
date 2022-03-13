from django_elasticsearch_dsl_drf.pagination import PageNumberPagination
from django_elasticsearch_dsl_drf.viewsets import BaseDocumentViewSet
from django_elasticsearch_dsl_drf.filter_backends import \
    FilteringFilterBackend, OrderingFilterBackend, SearchFilterBackend, \
    DefaultOrderingFilterBackend
from django_elasticsearch_dsl_drf.constants import LOOKUP_FILTER_TERMS, \
    LOOKUP_FILTER_WILDCARD, LOOKUP_FILTER_RANGE, LOOKUP_QUERY_IN, \
    LOOKUP_QUERY_STARTSWITH, LOOKUP_QUERY_CONTAINS, STRING_LOOKUP_FILTERS

from news.documents import NewsDocument
from news.models import News
from news.serializers import NewsSerializer


class NewsSearchViewSet(BaseDocumentViewSet):
    document = NewsDocument
    serializer_class = NewsSerializer
    queryset = News.objects.all().order_by("-id")
    lookup_field = "slug"
    filter_backends = [DefaultOrderingFilterBackend, OrderingFilterBackend,
                       FilteringFilterBackend, SearchFilterBackend]
    search_fields = ("title", "content")
    pagination_class = PageNumberPagination

    filter_fields = {
        "title": {"field": "title",
                  "lookups": STRING_LOOKUP_FILTERS},
        "posted_at": {"field": "posted_at",
                         "lookups": [LOOKUP_FILTER_RANGE, LOOKUP_QUERY_IN]},
        "source": {"field": "source",
                  "lookups": STRING_LOOKUP_FILTERS},
    }

    ordering_fields = {
        # "id": "id.raw",
        "posted_at": "posted_at"
    }
    ordering = "-posted_at"

