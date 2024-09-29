from .models import UserData
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.decorators import api_view
import json
from .serializers import UserSerializer

@api_view(['POST'])
def login_user(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    
    # if user is already logged in
    if not request.user.is_anonymous:
        user = request.user
        if user.username == request.data['username']:
            user_full_name = UserData.objects.get(username=user.username).fullname
            return Response({
                "status": "info",
                "message": "Already Logged In",
                "name": user_full_name
            })
    
    if username is not None:
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            print("User Logged In")
            user_info = UserData.objects.get(username=username)
            fullname = user_info.fullname
            return Response(
                {
                    "status": "success",
                    "message": "Login Successful",
                    "name": fullname
                }
            )
        else:
            print("No user found")
            return Response(
                {
                    "status":"error",
                    "message": "Invalid Credentials"
                }
            )
    return Response({
        "status":"error",
        "message": "Invalid Credentials"
    })


@api_view(['POST'])
def signup(request):
    data = request.data
    username = data.get('username')

    if username is not None:
        if User.objects.filter(username=username).exists():
            return Response({
                "status": "info",
                "message": "Username already exists"
            })
        else:
            password = data.get('password')
            fullname = data.get('fullname')
            email = data.get('email')
            user = User.objects.create_user(username=username, password=password)
            user_data = UserData.objects.create(username=username, fullname=fullname, email=email)
            user.save()
            user_data.save()
            print("User Created")
            return Response({
                "status": "success",
                "message": "Profile Created Successfully"
            })
    return Response({
        "status": "error",
        "message": "Invalid Data"
    })
  

@api_view(['GET'])
def logout_user(request):
    logout(request)
    print("Logged Out successfully")
    return Response({
        "status": "success",
        "message": "Logout Successfully"
    })
