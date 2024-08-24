from django.urls import path
from .views import get_users, create_user, RegisterView, VerifyCodeView


urlpatterns = [
    path('user/', get_users, name='get_users'),
    path('user/create/', create_user, name='create_user'),
    path('user/register/', RegisterView.as_view(), name='register'),
    path('user/verify/', VerifyCodeView.as_view(), name='verify'),
]