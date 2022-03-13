from django_elasticsearch_dsl import fields, Index
from django_elasticsearch_dsl.documents import DocType
from django_elasticsearch_dsl.registries import registry
from elasticsearch_dsl import FacetedSearch, TermsFacet, DateHistogramFacet

from news.models import News


news_index = Index('news')

news_index.settings(
    number_of_shards=1,
    number_of_replicas=0
)


@registry.register_document
class NewsDocument(DocType):

    def prepare_content(self, instance):
        content = instance.content
        content = content.split(" ")
        return ' '.join(content[:15])

    class Index:
        name = "news"
        settings = dict(number_of_shards=1, number_of_replicas=0)

    class Django:
        model = News
        fields = ["id", "title", "content", "image_url", "origin_url", "source",
                  "category", "posted_at", "language", "updated_at"]


class BlogSearch(FacetedSearch):
    doc_types = [NewsDocument, ]
    # fields that should be searched
    fields = ['title', 'posted_at']

    facets = {
        # use bucket aggregations to define facets
        'title': TermsFacet(field='title'),
        'publishing_frequency': DateHistogramFacet(field='posted_at', interval='hour')
    }

    def search(self):
        # override methods to add custom pieces
        s = super().search()
        return s.filter('range', publish_from={'lte': 'now/h'})
