
from django.urls import path
from rest_framework.authtoken import views
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('', views.Overview.as_view(), name='overview'),
    path('invoice/', views.InvoiceView.as_view(), name='invoice'),
    path('invoice/mass', views.InvoiceMass.as_view(), name='mass_invoice'),
    path('invoice/<int:id>/<str:access_token>/', views.InvoiceByIdView.as_view(), name='invoice_by_id'),
    path('invoice/<int:customer_id>/', views.InvoiceByCustomerId.as_view(), name='invoice_by_customer_id'),
    path('invoice/pdf/<int:id>/<str:access_token>/', views.InvoicePdf.as_view(), name='invoice_pdf'),
    path('invoice/fakturio/', views.InvoiceFakturio.as_view(), name='invoice_fakturio'),
    path('register/', views.Register.as_view(), name='register'),
    path('company/', views.CompanyView.as_view(), name='company'),
    path('arrangement/', views.ArrangementView.as_view(), name='arrangement'),
    path('customer/', views.CustomerView.as_view(), name='customer'),
    path('product/', views.ProductView.as_view(), name='product'),
    path('authenticate/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

]