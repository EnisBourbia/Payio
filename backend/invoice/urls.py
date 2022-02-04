
from django.urls import path
from rest_framework.authtoken import views
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('invoices/', views.InvoiceView.as_view(), name='invoice'),
    path('invoices/mass/', views.InvoiceMass.as_view(), name='mass_invoice'),
    path('invoices/<int:id>/<str:access_token>/', views.InvoiceByIdView.as_view(), name='invoice_by_id'),
    path('invoices/<int:customer_id>/', views.InvoiceByCustomerId.as_view(), name='invoice_by_customer_id'),
    path('invoices/pdf/<int:id>/<str:access_token>/', views.InvoicePdf.as_view(), name='invoice_pdf'),
    path('invoices/fakturio/', views.InvoiceFakturio.as_view(), name='invoice_fakturio'),
    path('companies/', views.CompanyView.as_view(), name='company'),
    path('arrangements/', views.ArrangementView.as_view(), name='arrangement'),
    path('customers/', views.CustomerView.as_view(), name='customer'),
    path('customers/<int:id>/', views.CustomerByIdView.as_view(), name='customer_by_id'),
    path('products/', views.ProductView.as_view(), name='product'),
    path('products/<int:id>/', views.ProductByIdView.as_view(), name='product_by_id'),
]