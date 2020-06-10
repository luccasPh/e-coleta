from django.urls import path, include
from .views import *
from django.conf import settings
from django.conf.urls.static import static

# urls provided by the backend
urlpatterns = [
   path('items/', ItemList.as_view()),
   path('points/', PointList.as_view()),
   path('points/<int:pk>/', PointDetail.as_view()),
   path('points/uf/', PointUfList.as_view()),
   path('points/<str:uf>/city/', PointCityList.as_view()),
   path('points/<str:city>/ll/', PointLatiLong.as_view()),
   path('search-cep/<int:cep>/', CEPAberto.as_view()),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)