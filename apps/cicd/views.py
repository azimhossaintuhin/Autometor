import os
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from helpers.Github.github import github
from .serializers import GitRepoSerializer , FrameworkSerializer
from django.conf import settings
from  .models import Language, Workflow


# ====== Get All The Public Repositories ======#
class getRepos(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            token = request.user.userprofile.github_token
            github_instance = github(token)
            repos = github_instance.get_repos()

            total_repos = len(repos)
            serializer = GitRepoSerializer(
                repos, many=True, context={"total_repos": total_repos}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ====== Get A Single Repository ======#
class getRepo(APIView):
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


class getFrameworks(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            language = Language.objects.prefetch_related('framework').filter(name=kwargs.get("language")).first()
            if not language:
                return Response({"error": "Language not found"}, status=status.HTTP_404_NOT_FOUND)
                
            frameworks = language.framework.all()
            serializer = FrameworkSerializer(frameworks, many=True)
            return Response( serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        


# ====== Create A Workflow ======#
class createWorkflow(APIView):
    permission_classes = [IsAuthenticated]

    def _get_workflow_file(self, framework):
        workflow_file = os.path.join(settings.BASE_DIR, "templates", "cicd", f"{framework}-workflow.yaml")
        if not os.path.exists(workflow_file):
            return None
        return workflow_file
    
    def post(self, request, *args, **kwargs):
        data = request.data
        user = request.user
        try:
            workflow, created = Workflow.objects.get_or_create(user=user, repo_name=kwargs.get("repo_name"), framework=data.get("framework"))
            workflow_file = self._get_workflow_file(data.get("framework"))
            with open(workflow_file, "r") as file:
                workflow_content = file.read()
            github_instance = github(request.user.userprofile.github_token)
            workflow = github_instance.add_workflow(kwargs.get("repo_name"), workflow_content)
                 
            
            if workflow == "Workflow already exists":
                return Response(
                    {"message": "Workflow already exists", "data": "already exists"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Workflow created successfully" ,"data":workflow}, status=status.HTTP_200_OK
                )
        except Exception as e:
            print(str(e))
            return Response({"errors":str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ====== Set Environment Variables ======#
class setEnvVariables(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            github_instance = github(request.user.userprofile.github_token)
            variables = github_instance.create_env_variables(
                kwargs.get("repo_name"), request.data
            )
            return Response(
                {"message": "Environment variables set successfully", "data": variables},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            print(str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ====== Get Environment Variables ======#
class getEnvVariables(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        github_instance = github(request.user.userprofile.github_token)
        variables = github_instance.get_env_variables(kwargs.get("repo_name"))
        return Response(variables, status=status.HTTP_200_OK)


# ====== Delete Environment Variables ======#
class deleteEnvVariables(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        key = kwargs.get("key")
        github_instance = github(request.user.userprofile.github_token)
        github_instance.delete_env_variables(kwargs.get("repo_name"), key)
        return Response(
            {"message": "Environment variables deleted successfully"},
            status=status.HTTP_200_OK,
        )
