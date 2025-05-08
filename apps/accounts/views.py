from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegistrationSerializer, UserProfileSerializer
from .models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny


class RegistrationApiview(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        data = RegistrationSerializer(data=request.data)
        if data.is_valid():
            data.save()
            return Response(
                {
                    "message": "User registered successfully",
                    "data": {
                        "email": data.validated_data["email"],
                        "phone": data.validated_data["phone"],
                    },
                },
                status=201,
            )
        print(data.errors)
        return Response(data.errors, status=400)


class LoginApiView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            email = data.get("email")
            password = data.get("password")

            user = authenticate(request, email=email, password=password)

            if not user:
                return Response(
                    {"message": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            refresh = RefreshToken.for_user(user)

            response = Response(
                {
                    "message": "Login successful",
                    "data": {
                        "access": str(refresh.access_token),
                    },
                },
                status=status.HTTP_200_OK,
            )

            response.set_cookie(
                key="access",
                value=str(refresh.access_token),
                httponly=True,
                samesite="Lax",
                secure=True,
            )
            response.set_cookie(
                key="refresh",
                value=str(refresh),
                httponly=True,
                samesite="Lax",
                secure=True,
            )
            return response

        except Exception as e:
            return Response(
                {"message": "Login failed", "errors": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class LogoutApiView(APIView):
    def post(self, request):
        response = Response({"message": "Logout successful"})
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response




class UserProfileApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_profile = user.userprofile
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        user_profile = user.userprofile
        serializer = UserProfileSerializer(
            user_profile, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


