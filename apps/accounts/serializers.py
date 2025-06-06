from rest_framework import serializers
from .models import User, Userprofile, UserWallet


class RegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128, write_only=True)
    confirm_password = serializers.CharField(max_length=128, write_only=True)
    phone = serializers.CharField(max_length=15)

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                "Password and Confirm Password do not match"
            )
        return attrs

    def create(self, validated_data):
        user = User(email=validated_data["email"], phone=validated_data["phone"])
        user.set_password(validated_data["password"])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128, write_only=True)


class UserProfileSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()

    def get_balance(self, obj):
        try:
            wallet = UserWallet.objects.get(user=obj.user)
            return wallet.wallet_balance
        except UserWallet.DoesNotExist:
            return 0.00

    class Meta:
        model = Userprofile
        fields = [
            "full_name",
            "git_username",
            "avatar_url",
            "address",
            "city",
            "state",
            "country",
            "zip_code",
            "balance",
        ]
