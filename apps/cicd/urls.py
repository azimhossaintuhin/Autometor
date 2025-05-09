from  django.urls import path
from .views import (
    getRepos,
    getRepo,
    createWorkflow,
    setEnvVariables
)

urlpatterns = [
    path("get-repos/", getRepos.as_view(), name="get-repos"),
    path("get-repo/<str:repo_name>/", getRepo.as_view(), name="get-repo"),
    path("create-workflow/<str:repo_name>/", createWorkflow.as_view(), name="create-workflow"),
    path("set-env-variables/<str:repo_name>/", setEnvVariables.as_view(), name="set-env-variables"),
]
