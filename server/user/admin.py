from django.contrib import admin
from .models import *
from django.contrib.auth.models import Group


class UserSchemeAdmin(admin.ModelAdmin):
    list_display = ["pk", "first_name","last_name","email", 'is_active',"created_on","updated_on", 'is_staff']
    readonly_fields = ('created_on','updated_on') 

    class Meta:
        model = User

admin.site.register(User, UserSchemeAdmin)
admin.site.unregister(Group)
