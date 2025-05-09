from  django.urls import path
from .views import (
    getRepos,
    getRepo,
    createWorkflow,
    setEnvVariables,
    getEnvVariables,
    deleteEnvVariables
)

urlpatterns = [
    path("get-repos/", getRepos.as_view(), name="get-repos"),
    path("get-repo/<str:repo_name>/", getRepo.as_view(), name="get-repo"),
    path("create-workflow/<str:repo_name>/", createWorkflow.as_view(), name="create-workflow"),
    path("set-env-variables/<str:repo_name>/", setEnvVariables.as_view(), name="set-env-variables"),
    path("get-env-variables/<str:repo_name>/", getEnvVariables.as_view(), name="get-env-variables"),
    path("delete-env-variables/<str:repo_name>/<str:key>/", deleteEnvVariables.as_view(), name="delete-env-variables"),
]
