from  rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView



class LoginApiView(TokenObtainPairView):
    """
    Custom login view that uses JWT authentication.
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return Response({
            'access': response.data['access'],
            'user': {
                'username': request.user.username,
                'email': request.user.email,
            }
        })    