from  rest_framework import serializers
from django.utils import timezone


class GitRepoSerializer(serializers.Serializer):
    id = serializers.IntegerField(default=0)
    owner = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    repo_name = serializers.SerializerMethodField()
    user_view_type = serializers.BooleanField(default=False)
    watchers_count = serializers.IntegerField(default=0)
    language = serializers.CharField(max_length=255)
    private = serializers.BooleanField(default=False)
    forks = serializers.IntegerField(default=0)
    open_issues = serializers.IntegerField(default=0)
    created_at = serializers.DateTimeField(default=timezone.now)
    updated_at = serializers.DateTimeField(default=timezone.now)
    pushed_at = serializers.DateTimeField(default=timezone.now)

    def get_repo_name(self, obj):
        return obj.get("name")

    def get_owner(self, obj):
        return obj.get("owner").get("login")
    
    def get_avatar_url(self, obj):
        return obj.get("owner").get("avatar_url")
    

 
    def to_representation(self, instance):
        response = super().to_representation(instance)  
        if(self.context.get("branches")):
            branches = [ branch.get("name")  for branch in self.context.get("branches")]
            response["branches"] = branches
            
        return response
    
    
    
    