# backend/api/urls.py
from django.urls import path
from .views import ProcessDocumentView
from .views_auth import RegisterView, LoginView, ProfileView
from .views_documents import DocumentListView, UpdateDocumentView, DeleteDocumentView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    path('upload/', ProcessDocumentView.as_view(), name='file-upload'),
    path('process/', ProcessDocumentView.as_view(), name='process-document'),
    path('documents/', DocumentListView.as_view(), name='document-list'),
    path('documents/<int:pk>/', UpdateDocumentView.as_view(), name='document-update'),
    path('documents/<int:pk>/delete/', DeleteDocumentView.as_view(), name='document-delete'),
]
