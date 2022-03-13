from rest_framework import routers

from settings import views

router = routers.SimpleRouter()

router.register(r'', views.SettingsViewSet, basename='settings')
router.register(r'register_device', views.RegisterDeviceViewSet,
                basename='register_device')

urlpatterns = router.urls
