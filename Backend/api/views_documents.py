from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions
from .models import Document
from .serializers import DocumentSerializer

class DocumentListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        # Show only current versions
        documents = Document.objects.filter(
            user=request.user,
            is_current=True
        ).order_by('-upload_time')
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)

class UpdateDocumentView(generics.UpdateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)

class DeleteDocumentView(generics.DestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_destroy(self, instance):
        # If the document being deleted is the current version,
        # then update the previous version (if any) to be current.
        if instance.is_current:
            previous_versions = Document.objects.filter(
                user=instance.user,
                file_name=instance.file_name,
                is_current=False
            ).order_by('-upload_time')
            
            if previous_versions.exists():
                new_current = previous_versions.first()
                new_current.is_current = True
                new_current.save()
        
        instance.delete()
