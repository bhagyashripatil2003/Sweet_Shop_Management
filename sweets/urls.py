from rest_framework.routers import DefaultRouter
from .views import SweetViewSet

router = DefaultRouter()
router.register(r'', SweetViewSet, basename='sweet')  # remove extra 'sweets'

urlpatterns = router.urls
