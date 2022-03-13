from rest_framework import routers

from news import views

router = routers.SimpleRouter()

router.register(r'search', views.NewsSearchViewSet)

urlpatterns = router.urls
