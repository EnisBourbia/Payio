from django.contrib import admin
from .models import *
from invoice.models import *


class CompanyCalendarSchemeAdmin(admin.ModelAdmin):
    list_display = ["pk", "company","calendar_start", "calendar_end", "method", "account_plan", "created_on"]
    readonly_fields = ['created_on']

    class Meta:
        model = CompanyCalendar

admin.site.register(CompanyCalendar, CompanyCalendarSchemeAdmin)


class BusinessEventSchemeAdmin(admin.ModelAdmin):
    list_display = ["company","calendar", 'event_type', 'event_code', 'description', 'file', 'event_date', "created_on"]
    readonly_fields = ['created_on']

    class Meta:
        model = BusinessEvent

admin.site.register(BusinessEvent, BusinessEventSchemeAdmin)

class EventRowSchemeAdmin(admin.ModelAdmin):
    list_display = ['event', 'calendar', 'account_number', 'row_info', 'debit', 'kredit', 'created_on']
    readonly_fields = ['calendar', 'created_on']

    class Meta:
        model = EventRow

admin.site.register(EventRow, EventRowSchemeAdmin)