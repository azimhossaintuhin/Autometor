from django.urls import path
from .views import RegistrationApiview, LoginApiView, LogoutApiView, UserProfileApiView


urlpatterns = [
    path("register/", RegistrationApiview.as_view(), name="register"),
    path("login/", LoginApiView.as_view(), name="login"),
    path("logout/", LogoutApiView.as_view(), name="logout"),
    path("user/me/", UserProfileApiView.as_view(), name="user"),
]
