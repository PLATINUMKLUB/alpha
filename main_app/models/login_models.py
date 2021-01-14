from django.db import models
from django.contrib.auth.models import User


# Django Authentication library for user authentication

class registration(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    contact = models.IntegerField()
    password_saved = models.CharField(max_length=100)
    storeID = models.CharField(max_length=150, unique=True, null=False)
    entry_type = models.CharField(max_length=12)
    profile_pic = models.ImageField(upload_to='SuperVisorImages/')
    DOB = models.CharField(max_length=10)

    def __str__(self):
        return self.user.username
    

class customerQueries(models.Model):
    customer_name = models.CharField(max_length=50)
    customer_email = models.CharField(max_length=80)
    customer_contact = models.IntegerField()
    customer_DOB = models.CharField(max_length=15)
    customer_message = models.TextField()
    source = models.CharField(max_length=50)

    def __str__(self):
        return self.customer_name + str(self.customer_contact) + self.source









# # customers model for the REGISTRATION/SIGNUP and LOGIN/SIGNIN of a valid user
# class customers(models.Model):
#     first_name = models.CharField(max_length=100)
#     last_name = models.CharField(max_length=100)
#     email = models.EmailField()
#     phone = models.IntegerField()
#     password = models.CharField(max_length=100)

#     subscribed = models.BooleanField(default=False)

#     # static methods to fetch email to validate a user with password

#     @staticmethod
#     def get_user_by_email(email):
#         try:
#             return customers.objects.get(email=email)

#         except:
#             return False

#     # static methods to fetch phone number to validate a user with password
#     @staticmethod
#     def get_user_by_phone(phone):
#         try:
#             return customers.objects.get(phone=phone)

#         except:
#             return False
