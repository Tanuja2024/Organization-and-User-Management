from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User,PendingRequest, Organization
from .serializers import SignupSerializer, LoginSerializer
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from rest_framework import permissions
from .serializers import UserUpdateSerializer


class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            pending_org_name = data.get('pending_org_name')
            org = data.get('org')
            
        
            try:
                with transaction.atomic():
                    # Save user first
                    user = serializer.save()

                    # Extract pending_org_name if present
                    pending_org_name = request.data.get('pending_org_name')
                    email = request.data.get('email')

                    if pending_org_name:
                        # Create pending organization request
                        pending_request = PendingRequest.objects.create(
                            type=PendingRequest.TYPE_ORG,
                            org_name=pending_org_name,
                            requested_by=user,
                            status=PendingRequest.STATUS_PENDING,
                            related_org=None  # since org not yet created
                        )
                    elif org:
                        related_org = Organization.objects.get(pk=org.id)
                        
                        pending_request = PendingRequest.objects.create(
                            type=PendingRequest.TYPE_ADMIN,
                            org_name=pending_org_name,
                            requested_by=user,
                            status=PendingRequest.STATUS_PENDING,
                            related_org=org )
                        
                        related_org.pending_requests += 1
                        related_org.save()

                    return Response({'message': 'Signup successful. Await verification.'},
                                    status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        email = request.data.get('email')
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        print(f"Login attempt for email: '{email} {password}'")
        try:
            user = User.objects.get(email=email.strip())
            if check_password(password, user.password):
                # Issue JWT token
                refresh = RefreshToken.for_user(user)
                organization_id=None
                if user.org:    
                    organization_id=user.org.id
                
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user_id': user.id,
                    'role': user.role,
                    'organization_id':organization_id,
                    "email": user.email,
            "org": {
                "id": user.org.id,
                "name": user.org.name
            } if user.org else None,
            "verification_status": user.verification_status,
            "is_active": user.is_active,
            "document": user.document.url if user.document else None,
                    })
                    
            else:
                return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)




class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role == 'super_admin'

class IsSuperOrOrgAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, 'user', None)
        return user and getattr(user, 'role', None) in ('super_admin', 'org_admin')
from rest_framework import viewsets, permissions
from .models import Organization
from .serializers import OrganizationSerializer

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsSuperAdmin()]
        # 'list' and 'retrieve' = public view access
        return [permissions.AllowAny()]
    
from rest_framework import viewsets, permissions
from .models import OrgUser
from .serializers import OrgUserSerializer

class OrgUserViewSet(viewsets.ModelViewSet):
    queryset = OrgUser.objects.all()
    serializer_class = OrgUserSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        organization_id = self.request.query_params.get('organization')
        if organization_id:
            queryset = queryset.filter(organization_id=organization_id)
        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsSuperOrOrgAdmin()]
        # Anyone (including public) can view list/retrieve, can't mutate
        return [permissions.AllowAny()]

    def get_serializer_context(self):
        # Pass request to serializer to control field exposure
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PendingRequest
from .serializers import PendingRequestSerializer


class PendingRequestDashboardView(generics.ListAPIView):
    queryset = PendingRequest.objects.filter(status="pending")
    serializer_class = PendingRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]

class PendingRequestStatusUpdateView(APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, pk):
        try:
            pending = PendingRequest.objects.get(pk=pk)
        except PendingRequest.DoesNotExist:
            return Response({'error': 'Pending request not found.'}, status=status.HTTP_404_NOT_FOUND)
        # Accept either 'approved' or 'rejected' in request.data['status']
        status_val = request.data.get('status')
        if status_val not in ['approved', 'rejected']:
            return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)
        pending.status = status_val
        pending.save()
        serializer = PendingRequestSerializer(pending)
        return Response(serializer.data)
    def post(self, request):
        org_id = request.data.get('org_id')
        data = request.data.copy()
        related_org = None

        if org_id:
            try:
                related_org = Organization.objects.get(pk=org_id)
            except Organization.DoesNotExist:
                related_org = None

        # If organization exists, increment its pending_requests field
        if related_org:
            related_org.pending_requests += 1
            related_org.save()
            data['related_org'] = related_org.id

        serializer = PendingRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



