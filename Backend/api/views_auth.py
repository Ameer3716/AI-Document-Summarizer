from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer, UserProfileSerializer

# Registration endpoint
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

# Login endpoint (returns token)
class LoginView(APIView):
    def post(self, request, format=None):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Profile endpoint (requires authentication)
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
