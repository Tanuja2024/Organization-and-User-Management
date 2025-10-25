from django.contrib import admin
from .models import Organization,User,OrgUser,PendingRequest

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "org_slug", "status", "pending_requests")
    list_filter = ("status", "language", "timezone")
    search_fields = ("name", "org_slug", "email")
    readonly_fields = ("created_at", "updated_at")
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('role', 'org', 'verification_status', 'document')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login',)}),
    )
    list_display = ('email', 'role', 'org', 'is_staff')

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # Prevent setting the organization for a superuser from the admin
        if obj and obj.is_superuser:
            form.base_fields['org'].required = False
        return form

@admin.register(OrgUser)
class OrgUserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'role', 'organization', 'created_at')
    list_filter = ('role', 'organization')
    search_fields = ('name', 'email')

@admin.register(PendingRequest)
class PendingRequestAdmin(admin.ModelAdmin):
    list_display = ('type', 'org_name', 'requested_by', 'status', 'timestamp')
    list_filter = ('type', 'status')
    search_fields = ('org_name', 'requested_by')


