# Login-Signup
# 1. Django Backend Setup
 a. Install Django and Django REST Framework
 In your Django backend, install the required libraries:
 <pre>
   pip install django djangorestframework djangorestframework-simplejwt
 </pre>
# b. Create a Django App
 If you haven’t already, create a Django app for authentication: 
 <pre>
   python manage.py startapp auth_app
 </pre>
 # c. Set Up urls.py for REST Framework
In your Django project, add rest_framework and rest_framework_simplejwt to INSTALLED_APPS in settings.py:
<pre>
  
  INSTALLED_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'auth_app',  # your app name
]

</pre>
# Add the following in settings.py for JWT:
<pre>
  REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

</pre>
# d. Configure Views for Signup and Login
Create views.py in auth_app with signup and login views:
<pre>
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

class SignupView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password)
        user.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

</pre>
# e. Add URLs for Login and Signup
In auth_app/urls.py:
<pre>
from django.urls import path
from .views import SignupView, LoginView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
]

</pre>
# Add auth_app.urls to your main urls.py file:
<pre>
from django.urls import path, include

urlpatterns = [
    path('auth/', include('auth_app.urls')),
]

</pre>
# 2. React Frontend Setup
a. Create a React App
If you haven’t already:
<pre>npx create-react-app frontend
cd frontend
</pre>
# b. Install Axios for HTTP Requests
<pre>npm install axios
</pre>
# c. Create Login and Signup Functions
In src/api/auth.js, create functions to handle login and signup requests:
<pre>
import axios from 'axios';

const API_URL = 'http://localhost:8000/auth';  // Django server URL

export const signup = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/signup/`, { username, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login/`, { username, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
</pre>
# d. Implement Login and Signup Components
In src/components/Login.js and src/components/Signup.js:
<pre>
  import React, { useState } from 'react';
import { login } from '../api/auth';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(username, password);
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);
            console.log('Login successful!');
        } catch (err) {
            setError(err.error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
}

export default Login;

</pre>
# Signup.js:
<pre>
import React, { useState } from 'react';
import { signup } from '../api/auth';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await signup(username, password);
            console.log('Signup successful!');
        } catch (err) {
            setError(err.error);
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Signup</button>
            {error && <p>{error}</p>}
        </form>
    );
}

export default Signup;

</pre>
# 3. Enable CORS for Cross-Origin Requests
In your Django project, install django-cors-headers:
<pre>
 pip install django-cors-headers

</pre>
<pre>
  INSTALLED_APPS = [
    ...,
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...,
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React development server
]

</pre>
# migrate
<pre>
python manage.py makemigrations
</pre>
<pre>
python manage.py migrate
</pre>
# 4. Run Both Servers
Run Django on port 8000:
<pre>
  python manage.py runserver
</pre>
# Run React on port 3000:
<pre>
  npm start
</pre>
