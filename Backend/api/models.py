from django.db import models
from django.contrib.auth.models import User
import hashlib

class Document(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="documents")
    file_name = models.CharField(max_length=255, blank=True, null=True)
    upload_time = models.DateTimeField(auto_now_add=True)
    content = models.TextField(blank=True, null=True)
    keywords = models.JSONField(blank=True, null=True)
    content_hash = models.CharField(max_length=64, null=True, blank=True)
    version = models.IntegerField(default=1)
    is_current = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.file_name or 'Document'} - {self.user.username}"

    @classmethod
    def generate_content_hash(cls, content):
        return hashlib.sha256(content.encode('utf-8')).hexdigest()