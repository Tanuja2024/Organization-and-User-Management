from django.db import models
from django.utils.text import slugify

# Organization Model (as provided)
class Organization(models.Model):
    STATUS_ACTIVE = "active"
    STATUS_BLOCKED = "blocked"
    STATUS_INACTIVE = "inactive"
    STATUS_CHOICES = [
        (STATUS_ACTIVE, "Active"),
        (STATUS_BLOCKED, "Blocked"),
        (STATUS_INACTIVE, "Inactive"),
    ]

    name = models.CharField(max_length=200)
    org_slug = models.SlugField(max_length=200, unique=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=400, blank=True)
    logo = models.ImageField(upload_to="logos/", blank=True, null=True)
    pending_requests = models.PositiveIntegerField(default=0)
    timezone = models.CharField(max_length=100, default="Asia/Kolkata")
    language = models.CharField(max_length=50, default="English")
    website = models.URLField(blank=True, null=True)
    max_coordinators = models.PositiveIntegerField(default=5)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_INACTIVE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # ensure slug exists
        if not self.org_slug:
            base = slugify(self.name)[:180]
            slug = base
            counter = 1
            while Organization.objects.filter(org_slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.org_slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

# Super Admin / Organization Admin Model
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email must be provided")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # stores hashed password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("role", User.ROLE_SUPER_ADMIN)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_SUPER_ADMIN = "super_admin"
    ROLE_ORG_ADMIN = "org_admin"
    ROLE_CHOICES = [
        (ROLE_SUPER_ADMIN, "Super Admin"),
        (ROLE_ORG_ADMIN, "Org Admin"),
    ]

    VERIFICATION_VERIFIED = "verified"
    VERIFICATION_NOT_VERIFIED = "not_verified"
    VERIFICATION_CHOICES = [
        (VERIFICATION_VERIFIED, "Verified"),
        (VERIFICATION_NOT_VERIFIED, "Not Verified"),
    ]

    email = models.EmailField(unique=True)
    # Remove password_hash and use AbstractBaseUser's password
    password_hash = models.CharField(max_length=128, default='temporary')

    role = models.CharField(max_length=12, choices=ROLE_CHOICES)
    org = models.ForeignKey(
        "Organization",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="admins",
    )
    verification_status = models.CharField(
        max_length=12, choices=VERIFICATION_CHOICES, default=VERIFICATION_NOT_VERIFIED
    )
    document = models.FileField(upload_to="user_docs/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Required for admin access

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # You can add more required fields here if needed

    objects = UserManager()

    def __str__(self):
        return self.email


# Organization Member Model
class OrgUser(models.Model):
    ROLE_ADMIN = 'admin'
    ROLE_COORDINATOR = 'coordinator'
    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Admin'),
        (ROLE_COORDINATOR, 'Coordinator'),
       
    ]
   

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='members')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    document = models.ImageField(upload_to="documents/", blank=True, null=True)
   
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.role})"

# Pending Requests Model
class PendingRequest(models.Model):
    TYPE_ORG = 'organization'
    TYPE_ADMIN = 'admin'
    TYPE_CHOICES = [
        (TYPE_ORG, 'Organization'),
        (TYPE_ADMIN, 'Admin'),
    ]
    STATUS_PENDING = "pending"
    STATUS_APPROVED = "approved"
    STATUS_REJECTED = "rejected"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_APPROVED, "Approved"),
        (STATUS_REJECTED, "Rejected"),
    ]

    type = models.CharField(max_length=12, choices=TYPE_CHOICES)
    org_name = models.CharField(max_length=255, blank=True, null=True)
    requested_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="pending_requests"
    )
    related_org = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True,blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING)
    timestamp = models.DateTimeField(auto_now_add=True)


