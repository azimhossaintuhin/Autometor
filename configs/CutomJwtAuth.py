from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken


class CustomerJwtAuth(JWTAuthentication):
    def authenticate(self, request):
        try:
            # Get the access token from the cookies
            access_token = request.COOKIES.get("access")

            if not access_token:
                raise AuthenticationFailed("No access token provided")

            # Validate the access token
            valid_token = AccessToken(access_token)

            # Return the user associated with the token and the token itself
            return self.get_user(valid_token), valid_token
        except Exception as e:
            # Raise a more specific error if token is invalid or expired
            raise AuthenticationFailed(f"Invalid token: {str(e)}")
