from django.db import models
from invoice.models import *

class CompanyCalendar(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    calendar_start = models.DateField(null=False)
    calendar_end = models.DateField(null=False)
    method = models.CharField(max_length=50, null=False, default="Kontantametoden")
    account_plan = models.CharField(max_length=50, null=False, default="Bas")
    created_on = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return '{} calendar {}'.format(self.calendar_start, self.calendar_end)

class BusinessEvent(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    calendar = models.ForeignKey(CompanyCalendar, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=50, null=False)
    description = models.CharField(max_length=255, null=False, blank=True)
    event_code = models.CharField(max_length=50, null=False, blank=True)
    status = models.CharField(
        choices=[
            ("Needs approval", "Needs approval"),
            ("Done", "Done"),
        ],
        max_length=15,
        default='Needs approval'
    )
    file = models.FileField()
    event_date = models.DateField(auto_now_add=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return  '{}'.format(self.pk)

class EventRow(models.Model):
    event = models.ForeignKey(BusinessEvent, on_delete=models.CASCADE)
    calendar = models.ForeignKey(CompanyCalendar, on_delete=models.CASCADE)
    account_number = models.IntegerField()
    row_info = models.CharField(max_length=150, null=False, blank=True)
    debit = models.IntegerField()
    kredit = models.IntegerField()
    created_on = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return  '{}'.format(self.event)