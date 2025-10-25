from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SignupView, 
    LoginView, 
    OrganizationViewSet, 
    OrgUserViewSet, 
    PendingRequestDashboardView, 
    PendingRequestStatusUpdateView,
    UserUpdateView,
    
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.contrib.auth import get_user_model

User = get_user_model()

urlpatterns = [
    # ... your other routes ...
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]


router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet, basename='organizations')
router.register(r'orgusers', OrgUserViewSet, basename='orgusers')

urlpatterns = [
    # Auth endpoints
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/<int:user_id>/update/', UserUpdateView.as_view(), name="user-update"),

    # Organization and OrgUser CRUD (ViewSets supply add/view/update/delete endpoints)
    path('', include(router.urls)),

    # Pending request dashboard (list view and creation)
    path('pending-requests/dashboard', PendingRequestDashboardView.as_view(), name='pending-request-dashboard'),

    # Pending request status update (approve/reject)
    path('pending-requests/<int:pk>/status/', PendingRequestStatusUpdateView.as_view(), name='pending-request-status-update'),
    path('pending-requests/', PendingRequestStatusUpdateView.as_view(), name='pending-request-create'),
    

]


from django.conf import settings
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
