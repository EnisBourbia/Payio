from django.contrib import admin
from .models import *

class CompanySchemeAdmin(admin.ModelAdmin):
    list_display = ["pk", "user", "name", "org_number", "moms_number","adress", "zip_code", "city", "reference", "phone_number", "email_contact", "bankgiro", "created_on"]
    readonly_fields = ['created_on']

    class Meta:
        model = Company
admin.site.register(Company, CompanySchemeAdmin)


class CompanyArrangementSchemeAdmin(admin.ModelAdmin):
    list_display = ["company", "invoice_price", "approved_for_selling", "interest_for_invoice","approved_on_date", "invoice_budget", "created_on", "created_on"]
    readonly_fields = ['created_on']

    class Meta:
        model = CompanyArrangement
admin.site.register(CompanyArrangement, CompanyArrangementSchemeAdmin)


class CompanySellingApplicationSchemeAdmin(admin.ModelAdmin):
    list_display = ["company", "expected_sales_number", "proposed_invoice_budget", "created_on"]
    readonly_fields = ['created_on']

    class Meta:
        model = CompanySellingApplication
admin.site.register(CompanySellingApplication, CompanySellingApplicationSchemeAdmin)

class CustomerSchemeAdmin(admin.ModelAdmin):
    list_display = ["belongs_to", "customer_number", "name", "org_number", "attention", "co_adress",  "adress", "adress_2", "zip_code","city", "country", "moms_number", "external_id", "reference", "email_contact", "email_invoice", "phone_number", "e_invoice_adress", "e_invoice_provider", "notes", "type", "active", "created_on"]
    readonly_fields = ['created_on']

    class Meta:
        model = Customer
admin.site.register(Customer, CustomerSchemeAdmin)


class InvoiceSchemeAdmin(admin.ModelAdmin):
    list_display = ["pk", "company", "customer", "access_token", "language", "invoice_number", "invoice_type", "ocr_number", "date", "expiry_date", "closed_date", "netto", "moms", "total", "message", "interest", "delivery", "status", "next_invoice", "created_on"]
    readonly_fields = ['created_on']

    class Meta:
        model = Invoice
admin.site.register(Invoice, InvoiceSchemeAdmin)

class InternalInvoiceSchemeAdmin(admin.ModelAdmin):
    list_display = ["pk", "customer", "access_token", "language", "invoice_number", "ocr_number", "date", "expiry_date", "closed_date", "netto", "moms", "total", "message", "interest", "format", "status", "created_on"]
    readonly_fields = ['created_on']

    class Meta:
        model = InternalInvoice
admin.site.register(InternalInvoice, InternalInvoiceSchemeAdmin)

class InvoiceArticlesSchemeAdmin(admin.ModelAdmin):
    list_display = ["pk", "invoice", "product", "description", "amount", "unit", "price", "moms", "total"]
    readonly_fields = []

    class Meta:
        model = InvoiceArticles
admin.site.register(InvoiceArticles, InvoiceArticlesSchemeAdmin)

class ProductSchemeAdmin(admin.ModelAdmin):
    list_display = ["company", "product_number", "description", "unit", "price", "type", "moms", "external_id", "income_account", "outgoing_moms", "sales_account", "sales_account_eu", "sales_account_eu_moms_free", "active"]
    readonly_fields = []

    class Meta:
        model = Product
admin.site.register(Product, ProductSchemeAdmin)