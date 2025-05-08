import os 
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from  helpers.Github.github import github
from .serializers import GitRepoSerializer
from  django.conf import settings
from django.template.loader import render_to_string

#====== Get All The Public Repositories ======#
class getRepos(APIView):
    permission_classes = [IsAuthenticated]
        
    def get(self, request):
        try:
            token = request.user.userprofile.github_token
            github_instance = github(token)
            repos = github_instance.get_repos()
            public_repos =  list(filter(lambda repos: repos.get("private") == False, repos))
            total_repos = len(public_repos)
            serializer = GitRepoSerializer(public_repos, many=True , context={"total_repos": total_repos})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
        
#====== Get A Single Repository ======#
class  getRepo(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        try:
            token = request.user.userprofile.github_token
            github_instance = github(token)
            repo = github_instance.get_repo(kwargs.get("repo_name"))
            branches = github_instance.get_branches(kwargs.get("repo_name"))
            serializer = GitRepoSerializer(repo, context={"branches": branches})
        
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
        
class createWorkflow(APIView):
    permission_classes = [IsAuthenticated]
    
    def _generate_workflow_file(self, file_name, data):
        try:
            # Use Django's template loader to find and render the template
            rendered_template = render_to_string(file_name, data)
            if not rendered_template:
                raise Exception("Template rendering failed - empty result")
                
            return rendered_template
            
        except Exception as e:
            raise Exception(f"Error generating workflow file: {str(e)}")
    
    def post(self, request, *args, **kwargs):
       
            data = request.data
            workflow_file = self._generate_workflow_file("cicd/django-workflow.yaml", data)
            github_instance = github(request.user.userprofile.github_token)
            workflow = github_instance.add_workflow(kwargs.get("repo_name"), workflow_file)
            if workflow == "Workflow already exists":
                return Response({"message": "Workflow already exists","data":"already exists"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Workflow created successfully"}, status=status.HTTP_200_OK)
                
       