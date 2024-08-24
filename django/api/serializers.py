from rest_framework import serializers
from .models import User as item
from django.contrib.auth.models import User
from .models import VerificationCode
import random

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields =  ['id', 'username', 'email', 'password']

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ['email']
    
    def create(self, validated_data):
        user = User.objects.create(username=validated_data['email'], email=validated_data['email'])
        code = ''.join([str(random.randint(0, 9))for _ in range(6)])
        VerificationCode.objects.create(user=user, code=code)
        user.email_user(
            'Verificação de email',
            f'Seu codigo de verificação é {code}',
            'from@example.com'
        )
        return user
    
class VerifyCodeSerializer(serializers.Serializer):
    email= serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, data):

        try:
            user = user.objects.get(email=data['email'])
            verification_code = VerificationCode.objects.get(user=user)
        
        except (User.DoesNotExist, VerificationCode.DoesNotExist):
            raise serializers.ValidationError("Invalid email or code")
        
        if verification_code.code != data['code']:
            raise serializers.ValidationError("Invalid code")
        return data
       
