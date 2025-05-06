from django.db import models
from django.contrib.auth.models import AbstractUser
from .manager import CustomUserManager
# Create your models here.


class User(AbstractUser):
    username = None
    phone = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    objects = CustomUserManager()
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class Userprofile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)

    def __str__(self):
        return self.user.email


class Token(models.Model):
    token_type = [
        ("v", "verification"),
        ("p", "password_reset"),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email


class UserWallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    wallet_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.user.email
