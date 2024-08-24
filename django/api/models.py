from django.db import models
from django.contrib.auth.models import User

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=150)
    password = models.CharField(max_length=25)
    extra_kwargs = {"password": {"write_only": True}}
    
    def create(selt, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    
class VerificationCode(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)