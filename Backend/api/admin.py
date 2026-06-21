from django.contrib import admin
from .models import Document

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'file_name', 'upload_time', 'version', 'is_current')
    list_filter = ('upload_time', 'is_current')
