# serializers.py
from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from .models import User, OrgUser, Organization

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    document = serializers.FileField(required=False)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'role', 'org', 'document']

    def create(self, validated_data):
        password = validated_data.pop('password')
        # Secure passwo
        # rd hashing
        validated_data['password'] = make_password(password)
        user = User.objects.create(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)




class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'email', 'phone', 'address', 'logo', 'pending_requests',
                  'timezone', 'language', 'website', 'max_coordinators', 'status', 'created_at', 'updated_at']
        read_only_fields = ['org_slug']
    def update(self, instance, validated_data):
    # update fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        print(f"updated : {validated_data}")
        return instance



from .models import PendingRequest

class PendingRequestSerializer(serializers.ModelSerializer):
    requested_by_email = serializers.EmailField(source='requested_by.email', read_only=True)
    requested_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    
    class Meta:
        model = PendingRequest
        fields = ['id', 'org_name', 'type', 'status', 'requested_by', 'requested_by_email', 
                  'related_org',  ]
        read_only_fields = ['created_at']
    def get_requested_by_email(self, obj):
        return obj.requested_by.email if obj.requested_by else None

from rest_framework import serializers
from .models import OrgUser

class OrgUserSerializer(serializers.ModelSerializer):
    organization = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all(), required=False)
    document_name = serializers.SerializerMethodField()

    class Meta:
        model = OrgUser
        fields = ['id','organization', 'name', 'email', 'role', 'document_name', 'document', 'created_at']

        extra_kwargs = {
            'document': {'required': False},
            'email': {'required': False}, 
        }
    def get_document_name(self, obj):
        if obj.document:
            return obj.document.name.split('/')[-1]
        return None

    def create(self, validated_data):
        request = self.context.get('request')
        if 'organization' not in validated_data:
            org_id = request.query_params.get('organization')
            if org_id:
                validated_data['organization'] = Organization.objects.get(pk=org_id)
        return super().create(validated_data)


    def to_representation(self, instance):
        
        data = super().to_representation(instance)
        # Hide 'document' field unless user is super admin/admin
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not (user and getattr(user, 'role', None) in ('super_admin', 'org_admin')):
            data.pop('document', None)
        return data

from .models import User

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "email", "role", "org", "verification_status", "document",
            "is_active", "is_staff"
        ]
        extra_kwargs = {
            "email": {"read_only": True},
        }



