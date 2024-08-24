from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, VerificationCode
from .serializers import UserSerializer, VerifyCodeSerializer, RegisterSerializer


#@api_view(['GET'])
#def get_users(request):
#    users = User.objects.all()
#    serializedData = UserSerializer(users, many=True).data
#    return Response(serializedData)

#@api_view(['POST'])
#def create_user(request):
#   data = request.data
#   serializer = UserSerializer(data=data)
#   if serializer.is_valid():
#        serializer.save()
#        return Response(serializer.data, status=status.HTTP_201_CREATED)
#   return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = User
    permission_classes = [AllowAny]


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "Verification code sent to email"
        })
        
class VerifyCodeView(generics.GenericAPIView):
    serializer_class = VerifyCodeSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exceptionn=True)
        user = User.objects.get(email=serializer.validated_data['email'])
        verification_code = VerificationCode.objects.get(user=user)
        verification_code.delete()

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })
        