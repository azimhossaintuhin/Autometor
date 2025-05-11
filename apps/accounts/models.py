from django.db import models
from django.contrib.auth.models import AbstractUser
from .manager import CustomUserManager
from helpers.Github.github import github
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
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="userprofile"
    )
    git_username = models.CharField(max_length=50, unique=True, null=True, blank=True)
    avatar_url = models.URLField(blank=True, null=True)
    github_token = models.CharField(max_length=255)
    full_name = models.CharField(max_length=50)
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)

    def __str__(self):
        return self.user.email

    def save(self, *args, **kwargs):
        if not self.avatar_url and self.github_token:
            github_user = github(self.github_token)
            self.avatar_url = github_user.get_user_data()["avatar_url"]
            self.full_name = github_user.get_user_data()["name"]
            self.git_username = github_user.get_user_data()["login"]
        super().save(*args, **kwargs)


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
