from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        
        if not email:
            raise ValueError('The Email field must be set')
        if not extra_fields.get('phone'):
            raise ValueError('The Phone field must be set')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff" , True)
        extra_fields.setdefault("is_superuser",True)
        
        if extra_fields.get("is_staff") is False:
            raise ValueError("Superuser must have is_staff=True.")
        if  extra_fields.get('is_superuser') is False:
            raise ValueError("Superuser must have is_superuser=True.")
        if not password:
            raise ValueError("Superuser must have a password.")
        if not email:
            raise ValueError("Superuser must have an email address.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    