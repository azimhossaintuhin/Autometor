from rest_framework import serializers
from django.utils import timezone
from .models import Framework

class GitRepoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    full_name = serializers.CharField()
    description = serializers.CharField(
        allow_blank=True, allow_null=True, required=False
    )
    language = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    private = serializers.BooleanField()
    forks = serializers.IntegerField(source="forks_count")
    stars = serializers.IntegerField(source="stargazers_count")
    updatedAt = serializers.DateTimeField(source="updated_at")

    html_url = serializers.URLField()
    homepage = serializers.URLField(allow_null=True, required=False)

    # nested owner info
    owner = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    

    def get_owner(self, obj):
        return obj.get("owner", {}).get("login", "")

    def get_avatar_url(self, obj):
        return obj.get("owner", {}).get("avatar_url", "")

    def to_representation(self, instance):
        response = super().to_representation(instance)

            
    
    
        # Include additional context-based info like branches (optional)
        if self.context.get("branches"):
            response["branches"] = [
                branch.get("name") for branch in self.context["branches"]
            ]

        return response


class FrameworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Framework
        fields = "__all__"
