from django.contrib import admin
from main_app.models.login_models import registration
from main_app.models.store_manager_models import *


@admin.register(registration)
class registered_user(admin.ModelAdmin):
    list_display = ('id', 'user', 'contact', 'storeID',
                    'entry_type', 'password_saved')


@admin.register(CustomerData)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'storeID', 'name', 'contact','DOM','DOB',
                    'email', 'gender', 'time_stamp')


@admin.register(CustomerShopData)
class Profiles(admin.ModelAdmin):
    list_display = ('invoice', 'storeID','amount', 'time_stamp')

@admin.register(CustomerOnboardData)
class CustomerOnboardData(admin.ModelAdmin):
    list_display = ('customerID', 'storeID','total_amount','tierRuleNo', 'time_stamp')


@admin.register(tier_individual)
class tier_individual(admin.ModelAdmin):
    list_display = ('id', 'store_ID', 'shop_start_amt', 'shop_end_amt',
                    'time_period', 'time_stamp')

@admin.register(tier_collective)
class tier_collective(admin.ModelAdmin):
    list_display = ('id', 'shop_start_amt', 'shop_end_amt',
                    'time_period', 'time_stamp')


@admin.register(category)
class product_category(admin.ModelAdmin):
    list_display = ('id', 'category', 'time_stamp')




@admin.register(store_detail)
class store(admin.ModelAdmin):
    list_display = ('id','storeID', 'store_name', 'store_location', 'store_town',
                    'store_city', 'store_state', 'store_category', 'store_subcategory', 'time_stamp')


@admin.register(store_manager)
class store_manager(admin.ModelAdmin):
    list_display = ('id', 'manager_name', 'manager_contact',
                    'manager_email', 'gender', 'manager_password', 'time_stamp')


@admin.register(Store_supervisor)
class store_supervisor(admin.ModelAdmin):
    list_display = ('id', 'supervisor_name', 'supervisor_contact', 'supervisor_email',
                    'supervisor_gender', 'time_stamp')



@admin.register(CampaignEmail)
class CampaignEmail(admin.ModelAdmin):
    list_display = ('id','campaignName',)


@admin.register(CampaignSms)
class CampaignSms(admin.ModelAdmin):
    list_display = ('id','campaignName',)


@admin.register(EmailSubCampaign)
class EmailSubCampaign(admin.ModelAdmin):
    list_display = ('id','CampaignName','time_stamp')


@admin.register(SmsSubCampaign)
class SmsSubCampaign(admin.ModelAdmin):
    list_display = ('id','CampaignName','time_stamp')


@admin.register(scheduleEmailList)
class scheduleEmailList(admin.ModelAdmin):
    list_display = ('id','emailList','emailText')

@admin.register(scheduleSMSList)
class scheduleSMSList(admin.ModelAdmin):
    list_display = ('id','emailList','emailText')