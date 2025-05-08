from  django.urls import path,include

urlpatterns = [
    path("", include("apps.accounts.urls")),
    path("", include("apps.cicd.urls")),
]
