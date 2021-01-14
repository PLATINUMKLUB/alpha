from django.contrib import admin
from django.urls import path
from main_app.views import login_views,store_manager_views,admin_view
from django.contrib.auth import views as auth_views

urlpatterns = [
     # Developer Admin
     path('dev/18pixels/admin/', admin.site.urls),
    # ######################################################################################################################################################  
    # #######################################################   Login module   #############################################################################
    # ###################################################################################################################################################### 
     path('', login_views.home, name='home'),
     path('signup', login_views.signup, name='signup'),
     path('signin', login_views.signin, name='signin'),
     path('signout', login_views.signout, name='signout'),
     path('otp_login', login_views.otp_login, name='otp_signin'),
     path('send_otp', login_views.send_otp, name='send_otp'),
     path('resend_otp', login_views.resend_otp, name='resend_otp'),
     path('validate_email', login_views.validate_email, name='validate_email'),
     # path('validate_email', login_views.validate_email, name='validate_email'),
     path('password_reset/done/',auth_views.PasswordResetDoneView.as_view(template_name='login_system/registration/password_reset_done.html'),name='password_reset_done'),
     path('reset/<uidb64>/<token>',auth_views.PasswordResetConfirmView.as_view(),name='password_reset_confirm'),
     path('password_reset',auth_views.PasswordResetView.as_view(template_name='login_system/login.html'),name='password_reset'),
     path('reset/done/',auth_views.PasswordResetCompleteView.as_view(template_name='login_system/registration/password_reset_complete.html'),name='password_reset_complete'),
     path('customer_query', login_views.customer_query, name='customer_query'),
     path('customer_query1', login_views.customer_query1, name='customer_query1'),
     path('customer_query2', login_views.customer_query2, name='customer_query2'),
     
    # ######################################################################################################################################################  
    # #######################################################   Store Manager module   #####################################################################
    # ###################################################################################################################################################### 
     path('store', store_manager_views.store, name='store'),
     path('profile', store_manager_views.store_profile, name='profile'),
     path('edit_store_profile',
          store_manager_views.edit_store_profile, name='edit_store_profile'),

     path('preview', store_manager_views.preview, name='preview'),
     path('change_pwd', store_manager_views.change_pwd, name='change_pwd'),
     path('manualEntryData', store_manager_views.manualEntryData,name='manualEntryData'),
     path('checkExistCustomer', store_manager_views.checkExistCustomer, name='manual'),
     path('uploadcsvData', store_manager_views.uploadcsvData, name='uploadcsvData'),
     path('checkExistInVoiceNo', store_manager_views.checkExistInVoiceNo,name='checkExistInVoiceNo'),
     path('NewInVoiceNogenrate', store_manager_views.NewInVoiceNogenrate,name='NewInVoiceNogenrate'),
     path('sheet', store_manager_views.sheet, name='sheet'),
     path('mannual', store_manager_views.manualFormSheet, name='mannual_search'),
     path('validate_emailID', store_manager_views.validate_emailID, name='validate_emailID'),
     path('store/StoreCustomerGraph1',
          store_manager_views.StoreCustomerGraph1, name='StoreCustomerGraph1'),
    path('store/StoreCustomerGraph2',
         store_manager_views.StoreCustomerGraph2, name='StoreCustomerGraph2'),

    path('onboardentry', store_manager_views.onboardentry, name='onboardentry'),
    path('uploadOnboarCsvData', store_manager_views.uploadOnboarCsvData, name='uploadOnboarCsvData'),
    

    # ######################################################################################################################################################  
    # #######################################################   ABACUS Admin module   ######################################################################
    # ###################################################################################################################################################### 
    path('ab_admin/', admin_view.admin_dash, name='ab_admin'),
    path('store_list', admin_view.store_list, name='store_list'),
    path('add_store', admin_view.add_store, name='add_store'),
    path('edit_store/<int:id>', admin_view.edit_store, name='edit_store'),

    path('checkmanagerstatus', admin_view.checkmanagerstatus, name='checkmanagerstatus'),


    path('edit_store/<int:id>/edit_store', admin_view.edit_store, name='edit_store'),
    path('delete_store/<int:id>', admin_view.delete_store, name='delete_store'),
    path('customer_management', admin_view.customer_management,name='customer_management'),
    path('tier_managememt_individual', admin_view.tier_managememt_individual,name='tier_managememt_individual'),
    path('admin_profile', admin_view.admin_profile,name='admin_profile'),
    path('chng_pwd', admin_view.chng_pwd, name='chng_pwd'),
    path('ab_admin/getLatestStoreID', admin_view.chng_pwd, name='chng_pwd'),
    path('ab_admin/change_pwd', admin_view.chng_pwd, name='chng_pwd'),
    path('ab_admin/password_reset/done/',auth_views.PasswordResetDoneView.as_view(template_name='login_system/registration/password_reset_done.html'),name='password_reset_done'),
    path('ab_admin/reset/<uidb64>/<token>',auth_views.PasswordResetConfirmView.as_view(),name='password_reset_confirm'),
    path('ab_admin/password_reset',auth_views.PasswordResetView.as_view(template_name='login_system/login.html'),name='password_reset'),
    path('reset/done/',auth_views.PasswordResetCompleteView.as_view(template_name='login_system/registration/password_reset_complete.html'),name='password_reset_complete'),
    path('product_category', admin_view.product_category,name='product_category'),
    path('product_category_render', admin_view.product_category_render,name='product_category_render'),
    path('fetchCategory', admin_view.fetchCategory,name='fetchCategory'),
    path('checkCtagory/', admin_view.checkCtagory, name='checkCtagory'),
    path('AddSubCategoryDropDown/', admin_view.AddSubCategoryDropDown, name='AddSubCategoryDropDown'),
    path('export_csv', admin_view.export_csv,name='export-csv'),
    path('admin_profile', admin_view.admin_profile, name='admin_profile'),
    path('delete_category/<int:id>',admin_view.delete_category, name='delete_cat'),
    path('editCategory', admin_view.edit_category, name='editCategory'),
    path('checkStoreName', admin_view.checkStoreName, name='checkStoreName'),
    path('AddStoreDetail', admin_view.AddStoreDetail, name='AddStoreDetail'),
    path('getLatestStoreID', admin_view.getLatestStoreID, name='getLatestStoreID'),
    path('customerFilterApply', admin_view.customerFilterApply,
         name='customerFilterApply'),
    path('tier_managememt_collective', admin_view.tier_managememt_collective,
          name='tier_managememt_collective'),
    path('AddTiersRule', admin_view.AddTiersRule, name='AddTiersRule'),
    path('CollectiveAddTiersRule', admin_view.CollectiveAddTiersRule, name='CollectiveAddTiersRule'),
    path('CheckExixtingTierRule', admin_view.CheckExixtingTierRule,
         name='CheckExixtingTierRule'),


         
    path('CheckExixtingTierRule_collective', admin_view.CheckExixtingTierRule_collective,
         name='CheckExixtingTierRule_collective'),
    path('deleteTier', admin_view.deleteTier, name='deleteTier'),
    path('collective_deleteTier', admin_view.collective_deleteTier, name='collective_deleteTier'),


    path('ab_admin/adminCustomerGraph1', admin_view.adminCustomerGraph1,name='adminCustomerGraph1'),
    path('ab_admin/adminCustomerGraph2', admin_view.adminCustomerGraph2, name='adminCustomerGraph2'),
    path('email', admin_view.email,name='email'),
    path('sms', admin_view.sms,name='sms'),
    path('preview_mail', admin_view.preview_mail, name='preview_mail'),
    path('preview_sms', admin_view.preview_sms, name='preview_sms'),
    path('checkStore', admin_view.checkStore, name='checkStore'),
    path('checkEmail', admin_view.checkEmail, name='checkEmail'),
    path('checkmanagerContact', admin_view.checkmanagerContact, name='checkmanagerContact'),

    path('customer_detailed_info', admin_view.customer_detailed_info, name='customer_detailed_info'),
    path('outOfoRDER',admin_view.outOfoRDER,name='outOfoRDER'),
    path('allCsvCustomers',admin_view.allCsvCustomers,name='allCsvCustomers'),
    path('allCsvCustomersemailCamp',admin_view.allCsvCustomersemailCamp,name='allCsvCustomersemailCamp'),
    path('SendEmailToCustomer',admin_view.SendEmailToCustomer,name='SendEmailToCustomer'),
    path('SendSMSToCustomer',admin_view.SendSMSToCustomer,name='SendSMSToCustomer'),
    path('campeignNameEmail',admin_view.campeignNameEmail,name='campeignNameEmail'),
    path('campeignNameSms',admin_view.campeignNameSms,name='campeignNameSms'),
    path('selectEmailCampaignName',admin_view.selectEmailCampaignName,name='selectEmailCampaignName'),
    path('selectSmsCampaignName',admin_view.selectSmsCampaignName,name='selectSmsCampaignName'),     

    # ######################################################################################################################################################  
    # #######################################################   broadcast module   #########################################################################
    # ######################################################################################################################################################  

    path('sms_broadcast',admin_view.sms_broadcast,name='sms_broadcast'),
    path('campaign-mobile-no-list',admin_view.campaign_mobile_no_list,name='campaign-mobile-no-list'),
    path('campaign-mobile-no-list1/<int:Year>',admin_view.campaign_mobile_no_list1,name='campaign-mobile-no-list1'),
    path('create_sms_campaign',admin_view.create_sms_campaign,name='create_sms_campaign'),
    path('customers_list_sms',admin_view.customers_list_sms,name='customers_list_sms'),
    path('campaign_details/<int:id>',admin_view.campaign_details,name='campaign_details'),
    path('send_sms_campaign',admin_view.send_sms_campaign,name='send_sms_campaign'),
    path('campaign_details/check_sms_campaign',admin_view.check_sms_campaign,name='check_sms_campaign'),


    path('email_broadcast',admin_view.email_broadcast,name='email_broadcast'),
    path('campaign_emails_list',admin_view.campaign_emails_list,name='campaign_emails_list'),
    path('create_email_campaign',admin_view.create_email_campaign,name='create_email_campaign'),
    path('customers_list_email',admin_view.customers_list_email,name='customers_list_email'),
    path('campaign-mobile-no-list2/<int:Year>',admin_view.campaign_mobile_no_list2,name='campaign-mobile-no-list2'),
    path('campaign_details2/<int:id>',admin_view.campaign_details2,name='campaign_details2'),
    path('send_email_campaign',admin_view.send_email_campaign,name='send_email_campaign'),
    path('campaign_details2/check_email_campaign',admin_view.check_email_campaign,name='check_email_campaign'),
    path('admin_logout',admin_view.admin_logout,name='admin_logout'),

    path('campaignDetailEmail/<int:id>',admin_view.campaignDetailEmail,name='campaignDetailEmail'),
    path('campaignDetailEmail/check_email_campaign',admin_view.check_email_campaign,name='check_email_campaign'),
    path('campaignDetailEmail/campaignEmailFilterApply', admin_view.customerFilterApply,name='campaignEmailFilterApply'),
    path('campaignDetailEmail/allCsvCustomersemailCamp',admin_view.allCsvCustomersemailCamp,name='allCsvCustomersemailCamp'),
    path('campaignDetailEmail/allCsvCustomers',admin_view.allCsvCustomersemailCamp,name='allCsvCustomersemailCamp'),

    path('campaignDetailEmail/SendEmailToCustomer',admin_view.SendEmailToCustomer,name='SendEmailToCustomer'),

    path('campaignDetailSMS/<int:id>',admin_view.campaignDetailSMS,name='campaignDetailSMS'),
    path('campaignDetailSMS/check_sms_campaign',admin_view.check_sms_campaign,name='check_sms_campaign'),
    path('campaignDetailSMS/campaignEmailFilterApply', admin_view.customerFilterApply,name='campaignEmailFilterApply'),
    path('campaignDetailSMS/allCsvCustomersemailCamp',admin_view.allCsvCustomersemailCamp,name='allCsvCustomersemailCamp'),
    path('campaignDetailSMS/allCsvCustomers',admin_view.allCsvCustomersemailCamp,name='allCsvCustomersemailCamp'),

    path('campaignDetailSMS/SendSMSToCustomer',admin_view.SendSMSToCustomer,name='SendSMSToCustomer'),
    

    path('checkCampaign',admin_view.checkCampaign,name='checkCampaign'),
    path('filterSmSDate',admin_view.filterSmSDate,name='filterSmSDate'),
    path('filterEmailDate',admin_view.filterEmailDate,name='filterEmailDate'),

#     Create New Email Campaign 
    path('NewCampaignNameSMS',admin_view.NewCampaignNameSMS,name='NewCampaignNameSMS'),
    path('NewCampaignNameEMAIL',admin_view.NewCampaignNameEMAIL,name='NewCampaignNameEMAIL'),
    
    path('checkCampaign',admin_view.checkCampaign,name='checkCampaign'),
    path('filterSmSDate',admin_view.filterSmSDate,name='filterSmSDate'),
    path('filterEmailDate',admin_view.filterEmailDate,name='filterEmailDate'),
    path('load_more',admin_view.load_more,name='load_more'),
# ##############################################################################################################################
# ##################################   EMAIL AND SMS SCHEDULING URLs   #########################################################
# ##############################################################################################################################
    path('scheduleCustEmail',admin_view.scheduleCustEmail,name='scheduleCustEmail'),
    path('formatScheduleEmailText',admin_view.formatScheduleEmailText,name='formatScheduleEmailText'),

    path('scheduleCustSMS',admin_view.scheduleCustSMS,name='scheduleCustSMS'),
    path('formatScheduleSMSText',admin_view.formatScheduleSMSText,name='formatScheduleSMSText'),



    # path('onboardFilter', admin_view.onboardFilter,name='onboardFilter'),

 ]
# default: "Django Administration"
admin.site.site_header = 'ABACUS-CRM ADMINISTRATION'
# default: "Site administration"
admin.site.index_title = 'ABACUS Admin Panel'
# default: "Django site admin"
admin.site.site_title = 'ABACUS'
