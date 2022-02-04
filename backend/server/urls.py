from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/invoice/', include('invoice.urls')),
    path('api/bookkeep/', include('bookkeep.urls')),
    path('api/user/', include('user.urls')),
    path('admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)