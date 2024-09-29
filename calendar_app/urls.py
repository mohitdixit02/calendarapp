from django.contrib import admin
from django.urls import path, include, re_path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('user.urls')),
    path('event/', include('events.urls')),
    re_path(r'^.*$', views.home, name='home'),
]
