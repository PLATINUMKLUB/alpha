from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from main_app.models.store_manager_models import *
from main_app.models.login_models import registration
from django.contrib.auth import login,authenticate,logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
import json,csv,datetime
from django.db.models.functions import TruncMonth
from django.db.models import Count
from django.db.models import Sum,Avg
from django.core.paginator import Paginator
from django.core.mail import send_mass_mail
import requests,re
from django.db.models.functions import ExtractYear
from django.core import serializers
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Avg, Max, Min, Sum
import schedule,calendar,time,datetime
from django.core.mail import send_mail
from django.conf import settings
# ---------------------------------------------------------------------------------------------------------------------------------
def admin_logout(request):
    logout(request)
    return HttpResponseRedirect('/ab_admin')

@staff_member_required
def admin_dash(request):
    # try:
    usr = User.objects.get(id=request.user.id)
    reg = registration.objects.get(user=usr)
    admin_dash = store_manager.objects.all().order_by('id')
    admin_store = store_detail.objects.all()
    paginator = Paginator(admin_dash,5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    avgAmount = CustomerShopData.objects.values('amount')
    current_date = datetime.datetime.now().date()
    current_month = current_date.month
    current_day = current_date.day


    # Total Customers/month
    total_cust = CustomerData.objects.all()
    x = CustomerData.objects.annotate(month=TruncMonth('time_stamp')).values('month').annotate(customer_count=Count('id')).values('month', 'customer_count')
    avg = CustomerShopData.objects.annotate(month=TruncMonth('time_stamp')).values('month').annotate(month_avg=Avg('amount')).values('month', 'month_avg')
    
    customer_count=len(x)
    customer_avg = len(avg)
    context_1 = {}
    context_2 = {}

    context_1['month_1'] = 0
    context_1['month_2'] = 0
    context_1['month_3'] = 0
    context_1['month_4'] = 0
    context_1['month_5'] = 0
    context_1['month_6'] = 0
    context_1['month_7'] = 0
    context_1['month_8'] = 0
    context_1['month_9'] = 0
    context_1['month_10'] = 0
    context_1['month_11'] = 0
    context_1['month_12'] = 0

    context_2['month_avg_1'] = 0
    context_2['month_avg_2'] = 0
    context_2['month_avg_3'] = 0
    context_2['month_avg_4'] = 0
    context_2['month_avg_5'] = 0
    context_2['month_avg_6'] = 0
    context_2['month_avg_7'] = 0
    context_2['month_avg_8'] = 0
    context_2['month_avg_9'] = 0
    context_2['month_avg_10'] = 0
    context_2['month_avg_11'] = 0
    context_2['month_avg_12'] = 0

    l1 = []
    for i in range(customer_count):
        context_1['month_'+str(x[i]['month'].date().month)] = x[i]['customer_count']
    for i in context_1.values():
        l1.append(i)  
        
    l2 = []
    for i in range(customer_avg):
        context_2['month_avg_' +
                str(avg[i]['month'].date().month)] = int(avg[i]['month_avg'])
    for i in context_2.values():
        l2.append(i)
    context ={}
    context['admin_dash'] = admin_dash
    context['admin_store'] = admin_store
            
    request.session['admin_cust_list'] = l1
    request.session['admin_avg_list'] = l2

    return render(request, 'admin_template/index.html', {'admin_image': reg.profile_pic,'page_obj' : page_obj,'context' : context,'context_1': context_1, 'context_2': context_2})
    # except:
    #     return render(request,'404.html')


# ---------------------------------------------------------------------------------------------------------------------------------
@staff_member_required
def add_store(request):
    data = category.objects.values('category')
    storeID = store_detail.objects.all()
    return render(request, 'admin_template/add-store.html',{'data':data})

# Utility function : format [ABACUS_(n)]
def generateStoreID(storeID):
    previousID = storeID['id']
    nextID = previousID + 1
    generatedID = 'ABACUSxxx'+str(nextID)
    return generatedID

def fetchCategory(request):
    return HttpResponse('hello')
# ---------------------------------------------------------------------------------------------------------------------------------


@staff_member_required
def store_list(request):
    storeResult = store_detail.objects.all()
    print(storeResult[0].statusflag)
    return render(request, 'admin_template/stores-list.html', {'storeResult': storeResult})


@staff_member_required
def edit_store(request,id):
    # try:
    if request.method == 'POST':
        storeName = request.POST['store_name'].strip()
        storeLocation = request.POST['store_location'].strip()
        storeCity = request.POST['store_city'].strip()
        storState = request.POST['store_state'].strip()
        managerProfileImage = request.FILES.get('managerProfileImage')
        # -----------------------------------------------------------------------------------
        manager_obj = store_manager.objects.get(pk=id)
        img_data = manager_obj.manager_image
        pemail = manager_obj.manager_email

        if(managerProfileImage == None):
            managerProfileImage = img_data
        # -----------------------------------------------------------------------------------
        mangerName = request.POST['mangerName'].strip()
        mangerContactNo = request.POST['mangerContactNo'].strip()
        managerGender = request.POST['managerGender'].strip()
        email = request.POST['managerEmail'].strip()
        newpassword = request.POST.get('managerConfirmPass').strip()
        print('>>>>',newpassword)

        supervisorName = request.POST.get('supervisorName')
        supervisorContactNO = request.POST.get('supervisorContactNO')
        supervisorEmail = request.POST.get('supervisorEmail')
        supervisorGender = request.POST.get('supervisorGender')
        
        accessEntryOfData = request.POST['accessEntryOfData'].strip()
        usr = User.objects.get(email=pemail)
        usr.first_name = mangerName
        usr.email = email
        usr.usrename = email
        if newpassword != "":
             usr.set_password(newpassword)
        usr.save()

        reg_obj = registration.objects.get(user = usr)
        reg_obj.user = usr
        reg_obj.contact = mangerContactNo
        reg_obj.profile_pic = managerProfileImage
        reg_obj.entry_type = accessEntryOfData
        if newpassword != "":
            reg_obj.password_saved = newpassword
        reg_obj.save()
        
        store_obj = store_detail.objects.get(id=id)
        store_obj.store_name = storeName
        store_obj.store_location = storeLocation
        store_obj.store_town=storeCity
        store_obj.store_city=storeCity
        store_obj.store_state=storState
        store_obj.save()

        manager_obj = store_manager.objects.get(id=id)
        manager_obj.manager_name = mangerName
        manager_obj.manager_contact =mangerContactNo
        manager_obj.manager_image =managerProfileImage
        manager_obj.user_unique_id = mangerContactNo
        manager_obj.manager_email =email
        manager_obj.gender =managerGender
        manager_obj.entry_type =accessEntryOfData
        # manager_obj.manager_password = newpassword
        manager_obj.save()
        
        supervisor_obj = Store_supervisor.objects.get(id=id)
        supervisor_obj.supervisor_name = supervisorName
        supervisor_obj.supervisor_contact =supervisorContactNO
        supervisor_obj.supervisor_email =supervisorEmail
        supervisor_obj.supervisor_gender =supervisorGender
        supervisor_obj.save()


        storeResult = store_detail.objects.all()
        return render(request, 'admin_template/stores-list.html', {'storeResult': storeResult,'success' : 'Store details updated successfully!'})

    else:
        # print('----------->>>',id)
        # exit()
        store_obj = store_detail.objects.get(pk=id)
        manager_obj = store_manager.objects.get(pk=id)
        img_data = manager_obj.manager_image
        supervisor_obj = Store_supervisor.objects.get(pk=id)
        print('------------>>>>',supervisor_obj.supervisor_name)
        
        context = {}
        context['store'] = store_obj
        context['manager'] = manager_obj
        context['supervisor'] = supervisor_obj

        return render(request, 'admin_template/edit-store-detail.html',context)
    # except:
    #     store_obj = store_detail.objects.get(pk=id)
    #     manager_obj = store_manager.objects.get(pk=id)
    #     supervisor_obj = Store_supervisor.objects.get(pk=id)
    #     context = {'error':'An error Occured while updating store details! Please try again with Valid data.'}
    #     context['store'] = store_obj
    #     context['manager'] = manager_obj
    #     context['supervisor'] = supervisor_obj
    #     return render(request, 'admin_template/edit-store-detail.html', context)


@staff_member_required
def checkmanagerstatus(request):
    if request.method == 'POST':
        storeID = request.POST['storeId']
        store = store_detail.objects.get(storeID=storeID)
        manager = store_manager.objects.get(store=store)
        checkManagerStatus = store.statusflag
        # false flag = " Manager is inactive "
        # true flag = " Manager is active "
        flag = False
        if(checkManagerStatus == True):
            print('11111111111')
            user = User.objects.get(email = manager.manager_email )
            if(user.is_active == True):
                print('222222222222222')
                user.is_active = False
                store.statusflag = False
                user.save()
                store.save()
                flag = False
                    
        else:
            print('4444444444444444')
            user = User.objects.get(email = manager.manager_email )
            if(user.is_active == False):
                print('55555555555555555555')
                user.is_active = True
                store.statusflag = True
                user.save()
                store.save()
                flag = True
        return HttpResponse(flag)


@staff_member_required
def delete_store(request, id):
    try:
        if request.method == 'POST':
            del_data = store_detail.objects.get(pk=id)
            del_supervisor = Store_supervisor.objects.get(pk=id)
            
            del_data.delete()
            del_supervisor.delete()
            return HttpResponseRedirect('/store_list')
    except:
        return render(request, '404.html')

#

# ---------------------------------------------------------------------------------------------------------------------------------

def CreateFilterTierModel(modelData):
    print(modelData)
    if len(modelData) != 0:
        tierPeriod = modelData[0]['time_period']
        return tierPeriod

def CreateFilterTierYear(timePeriod):
    if int(timePeriod) == 1:
        startdate = datetime.datetime.now()
        enddate = datetime.datetime.now() - datetime.timedelta(days=1*365)
        filterDates = startdate.date(),enddate.date()
        return filterDates
    if int(timePeriod) == 2:
        startdate = datetime.datetime.now()
        enddate = datetime.datetime.now() - datetime.timedelta(days=2*365)
        filterDates = startdate.date(),enddate.date()
        return filterDates
    if int(timePeriod) == 3:
        startdate = datetime.datetime.now()
        enddate = datetime.datetime.now() - datetime.timedelta(days=3*365)
        filterDates = startdate.date(),enddate.date()
        return filterDates
    if int(timePeriod) == 4:
        startdate = datetime.datetime.now()
        enddate = datetime.datetime.now() - datetime.timedelta(days=4*365)
        filterDates = startdate.date(),enddate.date()
        return filterDates





@staff_member_required
def customerFilterApply(request):
    if request.method == 'GET':
        filterCustomerList = []
        filterCustomerDict = {}
        print('=======>',filterCustomerList,filterCustomerDict)
        tierSelect = request.GET['tierSelect']
        if tierSelect.strip() == "TierSelect":
            storeNamelist = request.GET.getlist('Category[]')
            tierType = request.GET.get('tierType')
            ListTier = request.GET.getlist('ListTier[]')
            print('+++++++++>',tierType,ListTier)
            if tierType.strip() == 'collective':
                lenTier = len(ListTier)
                if lenTier > 0:
                    if lenTier == 1:
                        if ListTier[0].strip() == 'Tier 1':
                            
                            for shopName in storeNamelist:
                                shopName = store_detail.objects.get(store_name=shopName)
                                tierTimeModel = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[1]).values('time_period')
                                tierPeriod = CreateFilterTierModel(tierTimeModel)
                                
                                if tierPeriod != None:
                                    filterDates = CreateFilterTierYear(tierPeriod)
                                    start_date, end_date = filterDates
                                    tierAMT = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[1]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                    amountStartTier = tierAMT['amtStart']
                                    amountEndTier = tierAMT['amtEND']
                                    csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                    dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                    if len(dataAMT) != 0:
                                        for checkCust in csutrData:
                                            dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                            if dataAMT['amt'] != None:
                                                if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                    filterCustomerDict["CutomerName"] = checkCust.name
                                                    filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                    filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                    filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                    filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                    filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                    filterCustomerDict["id"] = checkCust.id
                                                    filterCustomerList.append(filterCustomerDict)
                                                    filterCustomerDict = {}
                                            else:
                                                filterCustomerList = filterCustomerList
                                    
                               

                        elif ListTier[0].strip() == 'Tier 2':
                            for shopName in storeNamelist:
                                shopName = store_detail.objects.get(store_name=shopName)
                                tierTimeModel = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[2]).values('time_period')
                                tierPeriod = CreateFilterTierModel(tierTimeModel)
                                if tierPeriod != None:
                                    filterDates = CreateFilterTierYear(tierPeriod)
                                    start_date, end_date = filterDates
                                    tierAMT = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[2]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                    amountStartTier = tierAMT['amtStart']
                                    amountEndTier = tierAMT['amtEND']
                                    csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                    dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                    if len(dataAMT) != 0:
                                        for checkCust in csutrData:
                                            dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                            if dataAMT['amt'] != None:
                                                if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                    filterCustomerDict["CutomerName"] = checkCust.name
                                                    filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                    filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                    filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                    filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                    filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                    filterCustomerDict["id"] = checkCust.id
                                                    filterCustomerList.append(filterCustomerDict)
                                                    filterCustomerDict = {}
                                            else:
                                                filterCustomerList = filterCustomerList
                            
                        elif ListTier[0].strip() == 'Tier 3':
                            for shopName in storeNamelist:
                                shopName = store_detail.objects.get(store_name=shopName)
                                tierTimeModel = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[1]).values('time_period')
                                tierPeriod = CreateFilterTierModel(tierTimeModel)
                                if tierPeriod != None:
                                    filterDates = CreateFilterTierYear(tierPeriod)
                                    start_date, end_date = filterDates
                                    tierAMT = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[1]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                    amountStartTier = tierAMT['amtStart']
                                    amountEndTier = tierAMT['amtEND']
                                    csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                    dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                    if len(dataAMT) != 0:
                                        for checkCust in csutrData:
                                            dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                            if dataAMT['amt'] != None:
                                                if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                    filterCustomerDict["CutomerName"] = checkCust.name
                                                    filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                    filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                    filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                    filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                    filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                    filterCustomerDict["id"] = checkCust.id
                                                    filterCustomerList.append(filterCustomerDict)
                                                    filterCustomerDict = {}
                                            else:
                                                filterCustomerList = filterCustomerList
                            
                           
                    if lenTier == 2:
                        if ListTier[0].strip() == 'Tier 1' and ListTier[1].strip() == 'Tier 2':
                            for shopName in storeNamelist:
                                shopName = store_detail.objects.get(store_name=shopName)
                                tierTimeModel = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[1,2]).values('time_period')
                                tierPeriod = CreateFilterTierModel(tierTimeModel)
                                if tierPeriod != None:
                                    filterDates = CreateFilterTierYear(tierPeriod)
                                    start_date, end_date = filterDates
                                    # tierAMT = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[1,2]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                    tierAMTmin = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[2]).aggregate(Min('shop_start_amt'))
                                    tierAMTmax = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[1]).aggregate(Max('shop_end_amt'))
                                    amountEndTier = tierAMTmax['shop_end_amt__max']
                                    amountStartTier = tierAMTmin['shop_start_amt__min']
                                    csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                    dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                    if len(dataAMT) != 0:
                                        for checkCust in csutrData:
                                            dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                            if dataAMT['amt'] != None:
                                                if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                    filterCustomerDict["CutomerName"] = checkCust.name
                                                    filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                    filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                    filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                    filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                    filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                    filterCustomerDict["id"] = checkCust.id
                                                    filterCustomerList.append(filterCustomerDict)
                                                    filterCustomerDict = {}
                                            else:
                                                filterCustomerList = filterCustomerList
                            
                        elif ListTier[0].strip() == 'Tier 2' and ListTier[1].strip() == 'Tier 3':
                            for shopName in storeNamelist:
                                shopName = store_detail.objects.get(store_name=shopName)
                                tierTimeModel = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[2,3]).values('time_period')
                                tierPeriod = CreateFilterTierModel(tierTimeModel)
                                if tierPeriod != None:
                                    filterDates = CreateFilterTierYear(tierPeriod)
                                    start_date, end_date = filterDates
                                    # tierAMT = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[2,3]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                    tierAMTmin = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[3]).aggregate(Min('shop_start_amt'))
                                    tierAMTmax = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[2]).aggregate(Max('shop_end_amt'))
                                    amountEndTier = tierAMTmax['shop_end_amt__max']
                                    amountStartTier = tierAMTmin['shop_start_amt__min']
                                    csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                    dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                    if len(dataAMT) != 0:
                                        for checkCust in csutrData:
                                            dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                            if dataAMT['amt'] != None:
                                                if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                    filterCustomerDict["CutomerName"] = checkCust.name
                                                    filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                    filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                    filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                    filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                    filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                    filterCustomerDict["id"] = checkCust.id
                                                    filterCustomerList.append(filterCustomerDict)
                                                    filterCustomerDict = {}
                                            else:
                                                filterCustomerList = filterCustomerList
                            
                        elif ListTier[0].strip() == 'Tier 1' and ListTier[1].strip() == 'Tier 3':
                            for shopName in storeNamelist:
                                shopName = store_detail.objects.get(store_name=shopName)
                                tierTimeModel = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[1,3]).values('time_period')
                                tierPeriod = CreateFilterTierModel(tierTimeModel)
                                if tierPeriod != None:
                                    filterDates = CreateFilterTierYear(tierPeriod)
                                    start_date, end_date = filterDates
                                    # tierAMT = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[1,3]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                    tierAMTmin = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[3]).aggregate(Min('shop_start_amt'))
                                    tierAMTmax = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[1]).aggregate(Max('shop_end_amt'))
                                    amountEndTier = tierAMTmax['shop_end_amt__max']
                                    amountStartTier = tierAMTmin['shop_start_amt__min']
                                    csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                    dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                    if len(dataAMT) != 0:
                                        for checkCust in csutrData:
                                            dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                            if dataAMT['amt'] != None:
                                                if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                    filterCustomerDict["CutomerName"] = checkCust.name
                                                    filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                    filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                    filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                    filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                    filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                    filterCustomerDict["id"] = checkCust.id
                                                    filterCustomerList.append(filterCustomerDict)
                                                    filterCustomerDict = {}
                                            else:
                                                filterCustomerList = filterCustomerList
                            
                            

                    if lenTier == 3:
                        for shopName in storeNamelist:                            
                            shopName = store_detail.objects.get(store_name=shopName)
                            tierTimeModel = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[1,2,3]).values('time_period')
                            

                            tierPeriod = CreateFilterTierModel(tierTimeModel)
                            if tierPeriod != None:
                                filterDates = CreateFilterTierYear(tierPeriod)
                                start_date, end_date = filterDates
                                # tierAMT = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[1,2,3]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                tierAMTmin = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[3]).aggregate(Min('shop_start_amt'))
                                tierAMTmax = tier_collective.objects.filter(tierType='Collective', tierRuleNo__in=[1]).aggregate(Max('shop_end_amt'))

                                print('hello',tierAMTmax,tierAMTmin)
                                amountEndTier = tierAMTmax['shop_end_amt__max']
                                amountStartTier = tierAMTmin['shop_start_amt__min']
                                csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                if len(dataAMT) != 0:
                                    for checkCust in csutrData:
                                        dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                        if dataAMT['amt'] != None:
                                            if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                filterCustomerDict["CutomerName"] = checkCust.name
                                                filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                filterCustomerDict["id"] = checkCust.id
                                                filterCustomerList.append(filterCustomerDict)
                                                filterCustomerDict = {}
                                        else:
                                            filterCustomerList = filterCustomerList
            # ###########################################    ONBOARD FILTER   ############################################################
            elif tierType.strip() == 'onboard':
                print('====================>>> hello this is onboard tier filter! :)  <<<========================')
                lenTier = len(ListTier)
                if lenTier > 0:
                    if lenTier == 1:
                        if ListTier[0].strip() == 'Tier 1':
                            
                            for shopName in storeNamelist:
                                shopName = store_detail.objects.get(store_name=shopName)
                                print('>>>>>>>> storeName :',shopName,'and storeID : ',shopName.storeID)

                                OnboardData = CustomerOnboardData.objects.filter(storeID=shopName.storeID,tierRuleNo=1)
                                print('custList : ',OnboardData)
                                for i in OnboardData:
                                    print('.........',i.customerID)
                                    filterCustomerDict["CutomerName"] = i.customerID.name
                                    filterCustomerDict["CutomerCONTACT"] = i.customerID.contact
                                    filterCustomerDict["CutomerEMAIL"] = i.customerID.email
                                    filterCustomerDict["CutomerGENDER"] = i.customerID.gender
                                    filterCustomerDict["CutomerDOB"] = i.customerID.DOB
                                    filterCustomerDict["CutomerDOM"] = i.customerID.DOM
                                    filterCustomerDict["id"] = i.customerID.id
                                    filterCustomerList.append(filterCustomerDict)
                                    filterCustomerDict = {}
                            
                                

                        if ListTier[0].strip() == 'Tier 2':
                            
                            for shopName in storeNamelist:
                                shopName = store_detail.objects.get(store_name=shopName)
                                print('>>>>>>>> storeName :',shopName,'and storeID : ',shopName.storeID)

                                OnboardData = CustomerOnboardData.objects.filter(storeID=shopName.storeID,tierRuleNo=2)
                                print('custList : ',OnboardData)
                                for i in OnboardData:
                                    print('.........',i.customerID)
                                    filterCustomerDict["CutomerName"] = i.customerID.name
                                    filterCustomerDict["CutomerCONTACT"] = i.customerID.contact
                                    filterCustomerDict["CutomerEMAIL"] = i.customerID.email
                                    filterCustomerDict["CutomerGENDER"] = i.customerID.gender
                                    filterCustomerDict["CutomerDOB"] = i.customerID.DOB
                                    filterCustomerDict["CutomerDOM"] = i.customerID.DOM
                                    filterCustomerDict["id"] = i.customerID.id
                                    filterCustomerList.append(filterCustomerDict)
                                    filterCustomerDict = {}

                        if ListTier[0].strip() == 'Tier 3':
                            
                            for shopName in storeNamelist:
                                shopName = store_detail.objects.get(store_name=shopName)
                                print('>>>>>>>> storeName :',shopName,'and storeID : ',shopName.storeID)

                                OnboardData = CustomerOnboardData.objects.filter(storeID=shopName.storeID,tierRuleNo=3)
                                print('custList : ',OnboardData)
                                for i in OnboardData:
                                    print('.........',i.customerID)
                                    filterCustomerDict["CutomerName"] = i.customerID.name
                                    filterCustomerDict["CutomerCONTACT"] = i.customerID.contact
                                    filterCustomerDict["CutomerEMAIL"] = i.customerID.email
                                    filterCustomerDict["CutomerGENDER"] = i.customerID.gender
                                    filterCustomerDict["CutomerDOB"] = i.customerID.DOB
                                    filterCustomerDict["CutomerDOM"] = i.customerID.DOM
                                    filterCustomerDict["id"] = i.customerID.id
                                    filterCustomerList.append(filterCustomerDict)
                                    filterCustomerDict = {}
                            
                           
                    if lenTier == 2:
                        if ListTier[0].strip() == 'Tier 1' and ListTier[1].strip() == 'Tier 2':
                            for shopName in storeNamelist:
                                shopName = store_detail.objects.get(store_name=shopName)
                                print('>>>>>>>> storeName :',shopName,'and storeID : ',shopName.storeID)

                                OnboardData = CustomerOnboardData.objects.filter(storeID=shopName.storeID,tierRuleNo__in=[1,2])
                                print('custList : ',OnboardData)
                                for i in OnboardData:
                                    print('.........',i.customerID)
                                    filterCustomerDict["CutomerName"] = i.customerID.name
                                    filterCustomerDict["CutomerCONTACT"] = i.customerID.contact
                                    filterCustomerDict["CutomerEMAIL"] = i.customerID.email
                                    filterCustomerDict["CutomerGENDER"] = i.customerID.gender
                                    filterCustomerDict["CutomerDOB"] = i.customerID.DOB
                                    filterCustomerDict["CutomerDOM"] = i.customerID.DOM
                                    filterCustomerDict["id"] = i.customerID.id
                                    filterCustomerList.append(filterCustomerDict)
                                    filterCustomerDict = {}
                            
                        if ListTier[0].strip() == 'Tier 2' and ListTier[1].strip() == 'Tier 3':
                            for shopName in storeNamelist:
                                shopName = store_detail.objects.get(store_name=shopName)
                                print('>>>>>>>> storeName :',shopName,'and storeID : ',shopName.storeID)
                                OnboardData = CustomerOnboardData.objects.filter(storeID=shopName.storeID,tierRuleNo__in=[2,3])
                                print('custList : ',OnboardData)
                                for i in OnboardData:
                                    print('.........',i.customerID)
                                    filterCustomerDict["CutomerName"] = i.customerID.name
                                    filterCustomerDict["CutomerCONTACT"] = i.customerID.contact
                                    filterCustomerDict["CutomerEMAIL"] = i.customerID.email
                                    filterCustomerDict["CutomerGENDER"] = i.customerID.gender
                                    filterCustomerDict["CutomerDOB"] = i.customerID.DOB
                                    filterCustomerDict["CutomerDOM"] = i.customerID.DOM
                                    filterCustomerDict["id"] = i.customerID.id
                                    filterCustomerList.append(filterCustomerDict)
                                    filterCustomerDict = {}
                            
                        elif ListTier[0].strip() == 'Tier 1' and ListTier[1].strip() == 'Tier 3':
                            for shopName in storeNamelist:
                                shopName = store_detail.objects.get(store_name=shopName)
                                print('>>>>>>>> storeName :',shopName,'and storeID : ',shopName.storeID)
                                OnboardData = CustomerOnboardData.objects.filter(storeID=shopName.storeID,tierRuleNo__in=[1,3])
                                print('custList : ',OnboardData)
                                for i in OnboardData:
                                    print('.........',i.customerID)
                                    filterCustomerDict["CutomerName"] = i.customerID.name
                                    filterCustomerDict["CutomerCONTACT"] = i.customerID.contact
                                    filterCustomerDict["CutomerEMAIL"] = i.customerID.email
                                    filterCustomerDict["CutomerGENDER"] = i.customerID.gender
                                    filterCustomerDict["CutomerDOB"] = i.customerID.DOB
                                    filterCustomerDict["CutomerDOM"] = i.customerID.DOM
                                    filterCustomerDict["id"] = i.customerID.id
                                    filterCustomerList.append(filterCustomerDict)
                                    filterCustomerDict = {}
                            
                            

                    if lenTier == 3:
                            for shopName in storeNamelist:
                                shopName = store_detail.objects.get(store_name=shopName)
                                print('>>>>>>>> storeName :',shopName,'and storeID : ',shopName.storeID)
                                OnboardData = CustomerOnboardData.objects.filter(storeID=shopName.storeID,tierRuleNo__in=[1,2,3])
                                print('custList : ',OnboardData)
                                for i in OnboardData:
                                    print('.........',i.customerID)
                                    filterCustomerDict["CutomerName"] = i.customerID.name
                                    filterCustomerDict["CutomerCONTACT"] = i.customerID.contact
                                    filterCustomerDict["CutomerEMAIL"] = i.customerID.email
                                    filterCustomerDict["CutomerGENDER"] = i.customerID.gender
                                    filterCustomerDict["CutomerDOB"] = i.customerID.DOB
                                    filterCustomerDict["CutomerDOM"] = i.customerID.DOM
                                    filterCustomerDict["id"] = i.customerID.id
                                    filterCustomerList.append(filterCustomerDict)
                                    filterCustomerDict = {}
            # ########################################################################################################################
            else:
                lenTier = len(ListTier)
                if lenTier == 1:
                    if ListTier[0].strip() == 'Tier 1':
                        for shopName in storeNamelist:
                            shopName = store_detail.objects.get(store_name=shopName)
                            tierTimeModel = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[1]).values('time_period')
                            print(tierTimeModel)
                            tierPeriod = CreateFilterTierModel(tierTimeModel)
                            if tierPeriod != None:
                                filterDates = CreateFilterTierYear(tierPeriod)
                                start_date, end_date = filterDates
                                tierAMT = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[1]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                amountStartTier = tierAMT['amtStart']
                                amountEndTier = tierAMT['amtEND']
                                csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                if len(dataAMT) != 0:
                                    for checkCust in csutrData:
                                        dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                        if dataAMT['amt'] != None:
                                            if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                filterCustomerDict["CutomerName"] = checkCust.name
                                                filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                filterCustomerDict["id"] = checkCust.id
                                                filterCustomerList.append(filterCustomerDict)
                                                filterCustomerDict = {}
                                        else:
                                            filterCustomerList = filterCustomerList
                    elif ListTier[0].strip() == 'Tier 2':
                        for shopName in storeNamelist:
                            shopName = store_detail.objects.get(store_name=shopName)
                            tierTimeModel = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[2]).values('time_period')
                            tierPeriod = CreateFilterTierModel(tierTimeModel)
                            if tierPeriod != None:
                                filterDates = CreateFilterTierYear(tierPeriod)
                                start_date, end_date = filterDates
                                tierAMT = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[2]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                amountStartTier = tierAMT['amtStart']
                                amountEndTier = tierAMT['amtEND']
                                csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                if len(dataAMT) != 0:
                                    for checkCust in csutrData:
                                        dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                        if dataAMT['amt'] != None:
                                            if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                filterCustomerDict["CutomerName"] = checkCust.name
                                                filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                filterCustomerDict["id"] = checkCust.id
                                                filterCustomerList.append(filterCustomerDict)
                                                filterCustomerDict = {}
                                        else:
                                            filterCustomerList = filterCustomerList
                    elif ListTier[0].strip() == 'Tier 3':
                        for shopName in storeNamelist:
                            shopName = store_detail.objects.get(store_name=shopName)
                            tierTimeModel = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[3]).values('time_period')
                            tierPeriod = CreateFilterTierModel(tierTimeModel)
                            if tierPeriod != None:
                                filterDates = CreateFilterTierYear(tierPeriod)
                                start_date, end_date = filterDates
                                tierAMT = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[3]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                amountStartTier = tierAMT['amtStart']
                                amountEndTier = tierAMT['amtEND']
                                csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                if len(dataAMT) != 0:
                                    for checkCust in csutrData:
                                        dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                        if dataAMT['amt'] != None:
                                            if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                filterCustomerDict["CutomerName"] = checkCust.name
                                                filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                filterCustomerDict["id"] = checkCust.id
                                                filterCustomerList.append(filterCustomerDict)
                                                filterCustomerDict = {}
                                        else:
                                            filterCustomerList = filterCustomerList
                                                
                if lenTier == 2:
                    if ListTier[0].strip() == 'Tier 1' and ListTier[1].strip() == 'Tier 2':
                        for shopName in storeNamelist:
                            shopName = store_detail.objects.get(store_name=shopName)
                            tierTimeModel = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[1,2]).values('time_period')
                            tierPeriod = CreateFilterTierModel(tierTimeModel)
                            if tierPeriod != None:
                                filterDates = CreateFilterTierYear(tierPeriod)
                                start_date, end_date = filterDates
                                tierAMT = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[1,2]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                amountStartTier = tierAMT['amtStart']
                                amountEndTier = tierAMT['amtEND']
                                csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                if len(dataAMT) != 0:
                                    for checkCust in csutrData:
                                        dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                        if dataAMT['amt'] != None:
                                            if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                filterCustomerDict["CutomerName"] = checkCust.name
                                                filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                filterCustomerDict["id"] = checkCust.id
                                                filterCustomerList.append(filterCustomerDict)
                                                filterCustomerDict = {}
                                        else:
                                            filterCustomerList = filterCustomerList
                    elif ListTier[0].strip() == 'Tier 2' and ListTier[1].strip() == 'Tier 3':
                        for shopName in storeNamelist:
                            shopName = store_detail.objects.get(store_name=shopName)
                            tierTimeModel = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[2,3]).values('time_period')
                            tierPeriod = CreateFilterTierModel(tierTimeModel)
                            if tierPeriod != None:
                                filterDates = CreateFilterTierYear(tierPeriod)
                                start_date, end_date = filterDates
                                tierAMT = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[2,3]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                amountStartTier = tierAMT['amtStart']
                                amountEndTier = tierAMT['amtEND']
                                csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                if len(dataAMT) != 0:
                                    for checkCust in csutrData:
                                        dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                        if dataAMT['amt'] != None:
                                            if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                filterCustomerDict["CutomerName"] = checkCust.name
                                                filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                filterCustomerDict["id"] = checkCust.id
                                                filterCustomerList.append(filterCustomerDict)
                                                filterCustomerDict = {}
                                        else:
                                            filterCustomerList = filterCustomerList
                    elif ListTier[0].strip() == 'Tier 1' and ListTier[1].strip() == 'Tier 3':
                        for shopName in storeNamelist:
                            shopName = store_detail.objects.get(store_name=shopName)
                            tierTimeModel = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[1,3]).values('time_period')
                            tierPeriod = CreateFilterTierModel(tierTimeModel)
                            if tierPeriod != None:
                                filterDates = CreateFilterTierYear(tierPeriod)
                                start_date, end_date = filterDates
                                tierAMT = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[1,3]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                amountStartTier = tierAMT['amtStart']
                                amountEndTier = tierAMT['amtEND']
                                csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                if len(dataAMT) != 0:
                                    for checkCust in csutrData:
                                        dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                        if dataAMT['amt'] != None:
                                            if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                filterCustomerDict["CutomerName"] = checkCust.name
                                                filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                filterCustomerDict["id"] = checkCust.id
                                                filterCustomerList.append(filterCustomerDict)
                                                filterCustomerDict = {}
                                        else:
                                            filterCustomerList = filterCustomerList
                        
                if lenTier == 3:
                    for shopName in storeNamelist:
                            shopName = store_detail.objects.get(store_name=shopName)
                            tierTimeModel = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[1,2,3]).values('time_period')
                            tierPeriod = CreateFilterTierModel(tierTimeModel)
                            if tierPeriod != None:
                                filterDates = CreateFilterTierYear(tierPeriod)
                                start_date, end_date = filterDates
                                tierAMT = tier_individual.objects.filter(tierType='Individual', tierRuleNo__in=[1,2,3]).aggregate(amtStart = Sum('shop_start_amt'),amtEND = Sum('shop_end_amt'))
                                amountStartTier = tierAMT['amtStart']
                                amountEndTier = tierAMT['amtEND']
                                csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                                dataAMT = CustomerShopData.objects.filter(storeID=shopName.storeID).values('time_stamp')
                                if len(dataAMT) != 0:
                                    for checkCust in csutrData:
                                        dataAMT = CustomerShopData.objects.filter(time_stamp__range=[end_date ,start_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                                        if dataAMT['amt'] != None:
                                            if int(amountStartTier) <= int(dataAMT['amt']) and int(amountEndTier) >= int(dataAMT['amt']):
                                                filterCustomerDict["CutomerName"] = checkCust.name
                                                filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                                                filterCustomerDict["CutomerEMAIL"] = checkCust.email
                                                filterCustomerDict["CutomerGENDER"] = checkCust.gender
                                                filterCustomerDict["CutomerDOB"] = checkCust.DOB
                                                filterCustomerDict["CutomerDOM"] = checkCust.DOM
                                                filterCustomerDict["id"] = checkCust.id
                                                filterCustomerList.append(filterCustomerDict)
                                                filterCustomerDict = {}
                                        else:
                                            filterCustomerList = filterCustomerList
        elif(tierSelect.strip() == "NoTierSelect"):
            storeNamelist = request.GET.getlist('cate[]')
            dateRangeFilter = request.GET.get('date')
            dates = dateRangeFilter.split('-')
            date1 = dates[0].strip()
            date2 = dates[1].strip()
            m1 ,d1, y1 = [int(x) for x in date1.split('/')]
            m2, d2, y2 = [int(y) for y in date2.split('/')]
            start_date = datetime.date(y1, m1, d1)
            end_date = datetime.date(y2, m2, d2)
            print(start_date)
            print(end_date)
            amountfilter = request.GET.get('amt')
            listAMT = amountfilter.split('-')
            minAMT = 0
            maxAMT = 0
            minAMT = listAMT[0].strip().replace("Rs.", "")
            maxAMT = listAMT[1].strip().replace("Rs.", "")
            filterCustomerList = []
            filterCustomerDict = {}
            for shopName in storeNamelist:
                shopName = store_detail.objects.get(store_name=shopName)
                csutrData = CustomerData.objects.filter(storeID=shopName.storeID)
                print(csutrData)
                for checkCust in csutrData:
                    print("Instance",checkCust)
                    print("Store ID: storeID=",shopName.storeID)
                    dataAMT = CustomerShopData.objects.filter(time_stamp__range=[start_date, end_date],customerID=checkCust).aggregate(amt = Sum('amount'))
                    print(dataAMT)
                    if dataAMT['amt'] != None:
                        if int(minAMT) <= int(dataAMT['amt']) and int(maxAMT) >= int(dataAMT['amt']):
                            filterCustomerDict["CutomerName"] = checkCust.name
                            filterCustomerDict["CutomerCONTACT"] = checkCust.contact
                            filterCustomerDict["CutomerEMAIL"] = checkCust.email
                            filterCustomerDict["CutomerGENDER"] = checkCust.gender
                            filterCustomerDict["CutomerDOB"] = checkCust.DOB
                            filterCustomerDict["CutomerDOM"] = checkCust.DOM
                            filterCustomerDict["id"] = checkCust.id
                            filterCustomerList.append(filterCustomerDict)
                            filterCustomerDict = {}
                    else:
                        filterCustomerList = filterCustomerList
        start_date = ""
        end_date = ""
        return HttpResponse(json.dumps(filterCustomerList),content_type="application/json")                    
            


@staff_member_required
def customer_management(request):
    # try:
    # ---------------    DUPLICATE CONTACT DATA   ----------------------------
    # duplicate_contacts = CustomerData.objects.values('contact',).annotate(Count('contact')).order_by().filter(contact__count__gt=1)
    # print('duplicate_contacts : ',duplicate_contacts)

    # # You can then retrieve all these duplicate objects using this query:
    # duplicate_objects = CustomerData.objects.filter(contact__in=[item['contact'] for item in duplicate_contacts])

    # print('duplicate_objects : ',duplicate_objects)
    # ------------------------------------------------------------------------
    customer_data = CustomerData.objects.all().order_by('id')
    customer_session_data = CustomerData.objects.all()[:10]
    DuplicateContactList = []
    for i in customer_session_data:
        DuplicateContactList.append(i.contact)
    print(DuplicateContactList)
    # ------------------------------------------------------------------------
    UniqueContactList = [] 
    for i in DuplicateContactList: 
        if i not in UniqueContactList: 
            UniqueContactList.append(i) 
    print(UniqueContactList)
    request.session['UniqueContactList'] = UniqueContactList
    # ------------------------------------------------------------------------
    store_data = store_detail.objects.all()
    paginator = Paginator(customer_data,10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'admin_template/customer-management.html', {'page_obj': page_obj, 'Customer_data': customer_data, 'store_detail': store_data})
    # except:
    #     return render(request, '404.html')
    
@staff_member_required
def ajaxCustomer_management(request):
    print('------------------>>>>>>>>>pagination function called',request)
    customer_data = CustomerData.objects.all().order_by('id')
    store_data = store_detail.objects.all()

    paginator = Paginator(customer_data,20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return HttpResponse(page_obj)


# ---------------------------------------------------------------------------------------------------------------------------------
def tier_managememt_individual(request):
    store_data = store_detail.objects.all()
    return render(request, 'admin_template/tier-managememt-individual.html', {'store_data': store_data})


# ---------------------------------------------------------------------------------------------------------------------------------
def validate_adminemailID(request):
    try:
        email = request.GET['email']
        if(request.user.email == email):
            return HttpResponse('true')
        else:
            return HttpResponse('false')
    except:
        return render(request, 'store-manager/manual-entry.html')

def admin_profile(request):
    try:
        if request.method == 'POST':
            name = request.POST['admin_name']
            email = request.POST['admin_email']
            image = request.FILES.get('admin_image')
            print(name,email)
            
            usr = User.objects.get(id=request.user.id)
            usr.first_name = name
            usr.email = email

            reg = registration.objects.get(user = usr)
            if image != None:
                reg.profile_pic = image
            usr.save()
            reg.save()
            print('>>>>>>>>image:>>>>>',reg.profile_pic)
            return redirect('admin_profile')
        else:
            usr = User.objects.get(id=request.user.id)
            reg = registration.objects.get(user = usr)

            return render(request, 'admin_template/profile.html',{'admin_image': reg.profile_pic,'email' : usr.email})
    except:
        return redirect('home')

def chng_pwd(request):
    context = {}
    if request.method == 'POST':
        current = request.POST['current_pwd']
        new_pass = request.POST['confirm_pwd']
        user = User.objects.get(id=request.user.id)
        register = registration.objects.get(user = user)
        check = user.check_password(current)
        if check == True:
            user.set_password(new_pass)
            user.save()
            register.password_saved = new_pass
            register.save()
            logout(request)
            return HttpResponseRedirect('/signin',{'success' : 'Password changed successfully.Sign to continue.'})
        else:
            context['msz'] = 'Incorrect Current Password'
            return render(request, 'admin_template/change-password.html',context)
        return render(request, 'admin_template/change-password.html',context)
    return render(request, 'admin_template/change-password.html')


# ##################################################################################################################################
# ###############################################   PRODUCT CATEGORY MANAGEMENT MODULE   ###########################################
# ##################################################################################################################################
@staff_member_required
def product_category(request):
    try:
        if request.method == 'POST':
            categoryItem = request.POST.get('Store_category')
            subCateItem = request.POST.getlist('Store_sub_category')
        
            categoryItem = categoryItem.strip()
            chechCate = category.objects.filter(category=categoryItem)
            if len(chechCate) == 0:
                category_data = category(category=categoryItem,sub_category=subCateItem)
                category_data.save()
            else:
                category_data = category.objects.get(category=categoryItem)
                category_data.sub_category = subCateItem
                category_data.save()
            return HttpResponseRedirect('product_category_render')
    except:
        return render(request, '404.html')
 


@staff_member_required
def product_category_render(request):
    try:
        subCate = category.objects.all().order_by('id')
        print(subCate)
        paginator = Paginator(subCate,5)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        for i in subCate:
            print(i.category)
            print(i.sub_category)
        return render(request, 'admin_template/product-category.html', {'page_obj' : page_obj,'cat_data': subCate, })
    except:
        return render(request, '404.html')


def checkCtagory(request):
    if request.method == 'GET':
        cat = request.GET['storeCategory']
        data = category.objects.filter(category=cat)
        print(data)
        catFlag = False
        if len(data) != 0:
            catFlag = True
        else:
            catFlag = False
        dataFlag = {catFlag:catFlag}
        return HttpResponse(dataFlag)


def AddSubCategoryDropDown(request):
    if request.method == 'POST':
        dataList = []
        cat = request.POST.getlist('dataList')
        
        cat = str(cat)
        cat = cat.replace("[", "")
        cat = cat.replace("]", "")
        cat = cat.replace("'", "")
        cat = cat.split(',')
        for i in cat:
            cate = i.strip()
            subCate = list(category.objects.filter(category=cate).values('sub_category'))
            for j in subCate:
                dataList.append(eval(j['sub_category']))
        return HttpResponse(json.dumps(dataList),content_type="application/json")


def checkStoreName(request):
    if request.method == 'GET':
        abacus_StoreName = request.GET['abacus_StoreName']
        data = store_detail.objects.filter(store_name=abacus_StoreName)
        lenData = len(data)
        flag = False
        if lenData == 1:
            flag = True
        else:
            flag = False
        return HttpResponse(flag)


def getLatestStoreID(request):
    if request.method == 'GET':
        try:
            data = store_detail.objects.values('id').latest('id')
            latestID = data['id']
            return HttpResponse(latestID)
        except:
            latestID = '0'
            return HttpResponse(latestID)

# ##################################################################################################################################
# ###############################################   STORE MANAGEMENT MODULE   ######################################################
# ##################################################################################################################################

@staff_member_required
def AddStoreDetail(request):
    # try:
    if request.method == 'POST':
        storeName = request.POST['storeName'].strip()
        storeLocation = request.POST['storeLocation'].strip()
        storeCity = request.POST['storeCity'].strip()
        storState = request.POST['storState'].strip()
        storCategory = request.POST.getlist('storCategory')
        storSubCategory = request.POST.getlist('storSubCategory')
        print('category>>>>>>>>>>>>>>>>',storCategory)
        print('sub_category>>>>>>>>>>>>>>>>',storSubCategory)
        # exit()

        # Step2
        managerProfileImage = request.FILES.get('managerProfileImage')

        mangerName = request.POST['mangerName'].strip()
        mangerContactNo = request.POST['mangerContactNo'].strip()
        userUinqueID = request.POST['userUinqueID'].strip()
        managerGender = request.POST['managerGender'].strip()
        email = request.POST['managerEmail'].strip()
        password = request.POST['managerPass'].strip()
        supervisorName = request.POST.get('supervisorName')
        supervisorContactNO = request.POST.get('supervisorContactNO')
        supervisorEmail = request.POST.get('supervisorEmail')
        supervisorGender = request.POST.get('supervisorGender')
        if supervisorGender == None:
            supervisorGender = 'NA'
        accessEntryOfData = request.POST['accessEntryOfData'].strip()
        # Step3
        # imageFileName = managerProfileImage.split('\\')[-1]
        hashed_pwd = make_password(password)
        # check_password("plain_text",hashed_pwd)
        print('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',hashed_pwd)

        storeID = User.objects.values('id').latest('id')
        Store_newID = generateStoreID(storeID)
        print('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',storeID)

        usr = User.objects.create_user(email, email, password)
        usr.first_name = mangerName
        usr.save()

        reg = registration(user=usr, contact=mangerContactNo,
                        password_saved=password, storeID=Store_newID,profile_pic=managerProfileImage, entry_type=accessEntryOfData)
        reg.save()

        storeDetail = store_detail(storeID=Store_newID, store_name=storeName, store_location=storeLocation,
                                store_town=storeCity, store_city=storeCity, store_state=storState, store_category=storCategory,
                    store_subcategory = storSubCategory) 
        storeDetail.save()
        store_managerData = store_manager(store = storeDetail ,manager_name = mangerName , manager_contact =mangerContactNo, 
                user_unique_id =userUinqueID, manager_email =email,manager_image=managerProfileImage, gender =managerGender, manager_password = hashed_pwd,entry_type =accessEntryOfData).save()

        store_supervisorData = Store_supervisor(supervisor_name = supervisorName , supervisor_contact =supervisorContactNO, 
                supervisor_email =supervisorEmail, supervisor_gender =supervisorGender).save()

    
        return redirect('store_list')
    else:
        return redirect('store_list')
    # except:
        return render(request, '404.html')

@staff_member_required
def export_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment'
    'filename=CustomerData'+str(datetime.datetime.now()) + '.csv'
    writer = csv.writer(response)
    writer.writerow(['Name', 'Contact', 'Email', 'Gender', 'DOB'])
    customerData = CustomerData.objects.all()
    for customer in customerData:
        writer.writerow([customer.name, customer.contact,
                         customer.email, customer.gender, customer.DOB])

    return response


@staff_member_required
def delete_category(request, id):
    if request.method == 'POST':
        print('delete Function called')
        del_data = category.objects.get(pk=id)
        del_data.delete()
        return HttpResponseRedirect('/product_category_render')


@staff_member_required
def edit_category(request):
    if request.method == 'GET':
        id = request.GET['id']
        storeCategory = category.objects.get(pk=id)
        cat_data = {}
        cat_data[storeCategory.category] = storeCategory.sub_category
        print(cat_data)
        print(type(cat_data))
        return JsonResponse({'cat_data': cat_data})
    else:
        return JsonResponse({'msg': 'Fail'})
# ---------------------------------------------------------------------------------------------------------------------------------

@staff_member_required
def tier_managememt_collective(request):
    return render(request, 'admin_template/tier-managememt-collective.html')

@staff_member_required
def AddTiersRule(request):
    if request.method == 'POST':
        storeName = request.POST['storeName']
        tierFromAMT = request.POST['tierFromAMT']
        tierToAMT = request.POST['tierToAMT']
        tierTimePeriod = request.POST['tierTimePeriod']
        tierRule = request.POST['tierRule']
        storeModel = store_detail.objects.get(store_name=storeName.strip())
        tier_individual(tierType='Individual', tierRuleNo=tierRule, store_ID=storeModel.storeID.strip(), shop_start_amt=tierFromAMT,
                        shop_end_amt=tierToAMT, time_period=tierTimePeriod).save()
        latestID = tier_individual.objects.latest('id')
        latestid = latestID.id
        return HttpResponse(json.dumps(latestid), content_type="application/json")

@staff_member_required
def CollectiveAddTiersRule(request):
    if request.method == 'POST':
        tierFromAMT = request.POST['tierFromAMT']
        tierToAMT = request.POST['tierToAMT']
        tierTimePeriod = request.POST['tierTimePeriod']
        tierRule = request.POST['tierRule']
        tier_collective(tierType='Collective', tierRuleNo=tierRule,shop_start_amt=tierFromAMT,
                        shop_end_amt=tierToAMT, time_period=tierTimePeriod).save()
        latestID = tier_collective.objects.latest('id')
        latestid = latestID.id
        return HttpResponse(json.dumps(latestid), content_type="application/json")

@staff_member_required
def CheckExixtingTierRule(request):
    if request.method == 'GET':
        storeName = request.GET['storeName']
        storeModel = store_detail.objects.get(store_name=storeName.strip())
        tierData = tier_individual.objects.filter(store_ID=storeModel.storeID)
        tierDataJson = []
        for i in tierData:
            tierDataJson.append([
                storeName,
                i.shop_start_amt,
                i.shop_end_amt,
                i.time_period,
                i.tierRuleNo,
                i.id
            ])
        return HttpResponse(json.dumps(tierDataJson), content_type="application/json")


@staff_member_required
def CheckExixtingTierRule_collective(request):
    if request.method == 'GET':
        tierData = tier_collective.objects.all()
        tierRuleList = []
        tierRuleDict = {}
        for i in tierData:
            print(i.tierType)
            tierRuleDict["tierType"] = i.tierType
            tierRuleDict["tierRuleNo"] = i.tierRuleNo
            tierRuleDict["shop_start_amt"] = i.shop_start_amt
            tierRuleDict["shop_end_amt"] = i.shop_end_amt
            tierRuleDict["time_period"] = i.time_period
            tierRuleDict["id"] = i.id
            tierRuleList.append(tierRuleDict)
            tierRuleDict = {}
    return HttpResponse(json.dumps(tierRuleList), content_type="application/json")
    
@staff_member_required
def deleteTier(request):
    if request.method == 'GET':
        flag = False
        try:
            id = request.GET['tierID']
            ID = int(id)
            a = tier_individual.objects.get(id=ID).delete()
            flag = True
            return HttpResponse(flag)
        except:
            flag = False
            return HttpResponse(flag)


@staff_member_required
def collective_deleteTier(request):
    if request.method == 'GET':
        flag = False
        try:
            id = request.GET['tierID']
            ID = int(id)
            a = tier_collective.objects.get(id=ID).delete()
            flag = True
            return HttpResponse(flag)
        except:
            flag = False
            return HttpResponse(flag)
# ---------------------------------------------------------------------------------------------------------------------------------


def adminCustomerGraph1(request):
    if request.method == 'GET':
        chart1_data = request.session.get('admin_cust_list')
        print(chart1_data)
        print(type(chart1_data))
        return HttpResponse(json.dumps(chart1_data), content_type="application/json")


def adminCustomerGraph2(request):
    if request.method == 'GET':
        print('HWL')
        chart2_data = request.session.get('admin_avg_list')
        print(chart2_data)
        print(type(chart2_data))
        return HttpResponse(json.dumps(chart2_data), content_type="application/json")

def email(request):
    return render(request,'admin_template/send-mail.html')


def sms(request):
    return render(request, 'admin_template/send-sms.html')


def preview_mail(request):
    return render(request, 'admin_template/preview-mail.html')


def preview_sms(request):
    return render(request, 'admin_template/preview-sms.html')


def checkStore(request):
    try:
        flag = False
        store_name = request.GET['store_name']
        print(store_name)

        retrieved_store = store_detail.objects.filter(store_name=store_name)
        if len(retrieved_store) == 1:
            flag = True
        else:
            flag = False

        print(retrieved_store)
        print('hello')

        # creating JSON object

        if retrieved_store:

            print('Valid mail : ', store_name)
            return HttpResponse('true')

        else:
            print('Invalid Email')
            return HttpResponse('false')

    except:
        return render(request, 'admin_template/stores-list.html')


def checkEmail(request):
    if request.method == 'GET':
        email = request.GET['email']
        flag = False
        validmail = store_manager.objects.filter(manager_email=email)
        print('>>>>>>>>>>>>>',validmail)
        if len(validmail) == 1:
            flag = True
        return HttpResponse(flag)




def checkmanagerContact(request):
    if request.method == 'GET':
        print('>>>>>>>>>>Called')
        flag = False
        contact = request.GET['ManagerContact']
        print(contact)

        contact = store_manager.objects.filter(manager_contact=contact)
        print('>>>>>>>>>>>>>',contact)
        if len(contact) == 1:
            flag = True

        return HttpResponse(flag)


@staff_member_required
def customer_detailed_info(request):
    if request.method == 'GET':
        cust_id = request.GET['id']
        singleCustomerData = CustomerData.objects.get(id=cust_id)
        allContactExistCustomers = CustomerData.objects.filter(contact = singleCustomerData.contact)
        
        customerShopDataList = []
        customerOnboardDataList = []
        for customer in allContactExistCustomers:
            shopData = CustomerShopData.objects.filter(customerID=customer)
            onboardData = CustomerOnboardData.objects.filter(customerID=customer)
            customerShopDataList.append(shopData)
            if(len(onboardData) != 0):
                customerOnboardDataList.append(onboardData)
        storeNameList = []
        amtSum = []
        tierNo = []

        for i in customerShopDataList:
            if(len(i) != 0):
                store = store_detail.objects.filter(storeID=i[0].storeID).values('store_name')
                storeNameList.append(store[0]['store_name'])
                customerShopData = CustomerShopData.objects.filter(customerID=i[0].customerID).values('storeID').annotate(amount=Sum('amount'))
                amtSum.append(customerShopData[0])
                tierRule = tier_individual.objects.filter(store_ID=i[0].storeID,shop_start_amt__lte=int(i[0].amount),shop_end_amt__gte=int(i[0].amount)).values('tierRuleNo')
                if(len(tierRule) > 0):
                    tierNo.append(tierRule[0]['tierRuleNo'])
                else:
                    tierNo.append('NA')

        OnboardstoreNameList = []
        totalAmt = []
        onboardTierNo = []

        for i in customerOnboardDataList:
            if(len(i) != 0):
                store = store_detail.objects.filter(storeID=i[0].storeID).values('store_name')
                OnboardstoreNameList.append(store[0]['store_name'])
                CustomerOnbData = CustomerOnboardData.objects.filter(customerID=i[0].customerID).values('storeID').annotate(amount=Sum('total_amount'))
                totalAmt.append(CustomerOnbData[0])
                tierRule = CustomerOnboardData.objects.filter(storeID=i[0].storeID,tierRuleNo=i[0].tierRuleNo).values('tierRuleNo')
                if(len(tierRule) > 0):
                    onboardTierNo.append(tierRule[0]['tierRuleNo'])
                else:
                    onboardTierNo.append('NA')
        
        cust_shop_info_list=[]
        cust_shop_info_dict = {}
        cust_onboard_info_dict = {}
        customer_detailed_data = CustomerData.objects.filter(id=cust_id).values('storeID','name','contact','email','DOB','DOM','gender')

        for i in customer_detailed_data:
            cust_shop_info_dict['name'] = i['name']
            cust_shop_info_dict['contact'] = i['contact']
            cust_shop_info_dict['email'] = i['email']
            cust_shop_info_dict['DOB'] = i['DOB']
            cust_shop_info_dict['DOM'] = i['DOM']
            cust_shop_info_dict['gender'] = i['gender']

            cust_onboard_info_dict['name'] = i['name']
            cust_onboard_info_dict['contact'] = i['contact']
            cust_onboard_info_dict['email'] = i['email']
            cust_onboard_info_dict['DOB'] = i['DOB']
            cust_onboard_info_dict['DOM'] = i['DOM']
            cust_onboard_info_dict['gender'] = i['gender']
            break
        cust_shop_info_list.extend((cust_shop_info_dict,storeNameList,amtSum,tierNo,cust_onboard_info_dict,OnboardstoreNameList,totalAmt,onboardTierNo))
        print(cust_shop_info_list)
        return HttpResponse(json.dumps(cust_shop_info_list), content_type="application/json")
        

# @staff_member_required
def outOfoRDER(request):
    return render(request,'admin_template/out.html')
    

def allCsvCustomers(request):
    if request.method == 'GET':
        customerCsvList = []
        customers = CustomerData.objects.all().values('name','contact','email','DOB','DOM','gender','storeID')
        customerCsvList.append(['Name','Contact','Email','Gender','DOB','DOM','storeID'])
        for i in customers:
            if(i['email'] != ''):
                customerCsvList.append([i['name'],i['contact'],i['email'],i['gender'],i['DOB'],i['DOM'],i['storeID']])
    return HttpResponse(json.dumps(customerCsvList), content_type="application/json")

def allCsvCustomersemailCamp(request):
    if request.method == 'GET':
        customerCsvList = []
        customerCsvList.append(['Name','Contact','Email','Gender','DOB','storeID'])
        customers = CustomerData.objects.all().values('name','contact','email','DOB','gender','storeID')
        for i in customers:
            customerCsvList.append([i['name'],i['contact'],i['email'],i['DOB'],i['gender'],i['storeID']])
    return HttpResponse(json.dumps(customerCsvList), content_type="application/json")

# ##################################################################################################################################
# ###############################################   CAMPAIGN MODULE   ##############################################################
# ##################################################################################################################################
@staff_member_required
def campeignNameEmail(request):
    if request.method == 'GET':
        campeignName = CampaignEmail.objects.values('campaignName')
        List = []
        for i in campeignName:
            List.append([i['campaignName']])
        print(List)
    return HttpResponse(json.dumps(List), content_type="application/json")

@staff_member_required
def campeignNameSms(request):
    if request.method == 'GET':
        campeignName = CampaignSms.objects.values('campaignName')
        List = []
        for i in campeignName:
            List.append([i['campaignName']])
    return HttpResponse(json.dumps(List), content_type="application/json")


@staff_member_required
def SendEmailToCustomer(request):
    if request.method == 'POST':
        AllEmail = request.POST.getlist('AllEmail[]')
        completeEmail = request.POST.getlist('completeEMAIL[]')
        mailSubject = request.POST.get('mailSubject')
        mail_syntax_Text = request.POST.get('EMAILText')
        print('>>>>>>>>>>>>>>>',completeEmail)
        # exit()
        check = CampaignEmail.objects.filter(campaignName=mailSubject.strip())
        datatuple = []
        flag = False

        for i in range(len(AllEmail)):
            if(AllEmail[i] != "NA"):
                print("00>>>>>>>>>>>",AllEmail[i],'---',type(AllEmail[i]))
                datatuple.append((mailSubject,completeEmail[i],'rk468335@gmail.com',[AllEmail[i]]))
                flag = True
        print('.........',datatuple)
        datatuple = tuple(datatuple)
        send_mass_mail(datatuple)
        if len(check) > 0:
            print('exist1',check,AllEmail,mail_syntax_Text)
            check = check[0]
            sub_camp = EmailSubCampaign(CampaignName=check,allEmails=AllEmail,text=mail_syntax_Text)
            sub_camp.save()
        else:
            master_campaign = CampaignEmail(campaignName=mailSubject.strip())
            master_campaign.save()
            print('exist2',master_campaign,AllEmail,mail_syntax_Text)
            # exit()
            sub_camp = EmailSubCampaign(CampaignName=master_campaign,allEmails=AllEmail,text=mail_syntax_Text)
            sub_camp.save()

        return HttpResponse(flag)

@staff_member_required
def SendSMSToCustomer(request):
    if request.method == 'POST':
        print('--------->>>> function called!')
        url = "https://www.fast2sms.com/dev/bulk"
        AllSms = request.POST.getlist('All_Mob_No[]')
        completeSms = request.POST.getlist('completeSms[]')
        smsSub = request.POST.get('smsSub')
        smsText = request.POST.get('smsText')
        print('--------->>>>',AllSms,completeSms,smsSub,smsText)
        
        check = CampaignSms.objects.filter(campaignName=smsSub.strip())
        flag = False
        for i in range(0,len(AllSms)):
            print("ON GOING")
            payload = "sender_id=FSTSMS&message=" + completeSms[i] +"&language=english&route=p&numbers=" + AllSms[i]
            headers = {
            'authorization': "QDo5cIdOBq6xG8YygsMkleWt7FAbXpjhimvZPz4J0VunCNEUf1D9H8ugEpaBMfK3FnwOhojeyZQXTWJm",
            'Content-Type': "application/x-www-form-urlencoded",
            'Cache-Control': "no-cache",
            }
            flag = True
            response = requests.request("POST", url, data=payload, headers=headers)
        
        if len(check) > 0:
            check = check[0]
            sub_camp = SmsSubCampaign(CampaignName=check,allsms=AllSms,text=smsText)
            sub_camp.save()
        else:
            master_campaign = CampaignSms(campaignName=smsSub)
            master_campaign.save()
            sub_camp = SmsSubCampaign(CampaignName=master_campaign,allsms=AllSms,text=smsText)
            sub_camp.save()

        return HttpResponse(flag)

@staff_member_required
def selectEmailCampaignName(request):
    if request.method == "GET":
        campaignName = request.GET.get('campaignName')
        campaignName = campaignName.strip()
        print(campaignName)
        # data = CampaignEmail.objects.filter(campaignName=campaignName).values('campaignName')
        data = CampaignEmail.objects.get(campaignName=campaignName)
        subCampData = EmailSubCampaign.objects.filter(CampaignName=data)
        # for i in subCampData:
        #     print(i.text)
        # exit()
        List = []
        for i in subCampData:
            List.append(i.text)
    return HttpResponse(json.dumps(List), content_type="application/json")

@staff_member_required
def selectSmsCampaignName(request):
    if request.method == "GET":
        campaignName = request.GET.get('campaignName')
        campaignName = campaignName.strip()
        # data = CampaignSms.objects.filter(campaignName=campaignName).values('campaignName')
        data = CampaignSms.objects.get(campaignName=campaignName)
        subCampData = SmsSubCampaign.objects.filter(CampaignName=data)

        List = []
        for i in subCampData:
            List.append(i.text)
    return HttpResponse(json.dumps(List), content_type="application/json")

# ##################################################################################################################################
# ###############################################   BROADCAST & DELIVERY MODULE   ##################################################
# ##################################################################################################################################

# ##################################################   SMS BROADCAST   #############################################################
@staff_member_required
def sms_broadcast(request):
    if request.method == 'GET':
        master_campaign = CampaignSms.objects.all()
    return render(request,'admin_template/sms-campaign.html',{'master_campaign':master_campaign})

@staff_member_required
def campaign_mobile_no_list(request):
    return render(request,'admin_template/campaign-mobile-no-list.html')

@staff_member_required
def campaign_mobile_no_list1(request,Year):
    print(Year)
    master = request.session.get('masterCamp')
    masterCampaign = CampaignSms.objects.get(campaignName=master)
    subCampaign = SmsSubCampaign.objects.filter(CampaignName=masterCampaign)
    l1 = []
    for i in subCampaign:
        data = i.allsms
        x = data.strip('"][').split(', ')
        for i in x:
            a = i.strip("'")
            l1.append(a)
    print(l1)
    return render(request,'admin_template/campaign-mobile-no-list-1.html',{'emailList':l1,'master' : master})

@staff_member_required
def customers_list_sms(request):
    try:
        customer_data = CustomerData.objects.all().order_by('id')
        store_data = store_detail.objects.all()
        return render(request,'admin_template/customers-list-sms.html',{'Customer_data': customer_data, 'store_detail': store_data})


    except:
        return render(request, '404.html')
    return render(request,'admin_template/customers-list-sms.html')

@staff_member_required
def create_sms_campaign(request):
    customer_data = CustomerData.objects.all().order_by('id')
    store_data = store_detail.objects.all()

    paginator = Paginator(customer_data,10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'admin_template/create-sms-campaign.html', {'page_obj': page_obj, 'Customer_data': customer_data, 'store_detail': store_data})


@staff_member_required
def campaign_details(request,id):
    masterCamp = CampaignSms.objects.get(id=id)
    request.session['masterCamp'] = masterCamp.campaignName
    subCampaign = SmsSubCampaign.objects.filter(CampaignName=masterCamp)
    l1 = []
    for i in subCampaign:
        data = i.allsms
        x = data.strip('"][').split(', ')
        for i in x:
            a = i.strip("'")
            l1.append(a)
    print(l1)
    total = len(l1)
    data = SmsSubCampaign.objects.all().annotate(Year=ExtractYear('time_stamp')).values('Year','CampaignName').filter(CampaignName=masterCamp).annotate(dataCount=Count('Year')).order_by('CampaignName')
    return render(request,'admin_template/campaign-detail.html',{'data' : data,'masterCamp' : masterCamp,'total' : total})


def send_sms_campaign(request):
    return render(request,'admin_template/send-email-campaign.html')

def check_sms_campaign(request):
    if request.method == 'GET':
        campData = request.GET['s']
        # print('hello inside',campData)
        data = list(campData.split('Campaign'))
        print('hdhvdhvjhvj',data[0],'hgjuhg',type(data[1]))
        # exit()

        filter_master = CampaignSms.objects.get(campaignName = data[0].strip())
        print(filter_master)
        subCamp = SmsSubCampaign.objects.filter(CampaignName=filter_master,time_stamp__year = data[1].strip())
        List=[]
        for i in subCamp:
            List.append(i.text)
        print(List)

    return HttpResponse(json.dumps(List), content_type="application/json")
# ###################################################  EMAIL BROADCAST  ############################################################
@staff_member_required
def email_broadcast(request):
    if request.method == 'GET':
        l1=[]
        master_campaign = CampaignEmail.objects.all()
        for i in master_campaign:
            subCampaign = EmailSubCampaign.objects.filter(CampaignName=i)
            for i in subCampaign:
                data = i.allEmails
                x = data.strip('"][').split(', ')
                for i in x:
                    a = i.strip("'")
                    l1.append(a)
        print(l1)
        print(master_campaign)

        total = len(l1)
        print(total)

    return render(request,'admin_template/email-campaign.html',{'master_campaign':master_campaign,'total' : total})

@staff_member_required
def campaign_emails_list(request):
    return render(request,'admin_template/campaign-emails-list.html')

@staff_member_required
def campaign_mobile_no_list2(request,Year):
    master = request.session.get('masterCamp')
    masterCampaign = CampaignEmail.objects.get(campaignName=master)
    subCampaign = EmailSubCampaign.objects.filter(CampaignName=masterCampaign)
    yearly_data = EmailSubCampaign.objects.filter(time_stamp__year = Year,CampaignName=masterCampaign)
    l1 = []
    for i in yearly_data:
        data = i.allEmails
        x = data.strip('"][').split(', ')
        for i in x:
            a = i.strip("'")
            l1.append(a)
    print(l1)
    total = len(l1)
    return render(request,'admin_template/campaign-mobile-no-list-2.html',{'emailList':l1,'master' : master})

@staff_member_required
def customers_list_email(request):
    try:
        customer_data = CustomerData.objects.all().order_by('id')
        store_data = store_detail.objects.all()
        return render(request,'admin_template/customers-list-email.html',{'Customer_data': customer_data, 'store_detail': store_data})

    except:
        return render(request, '404.html')

@staff_member_required
def create_email_campaign(request):
    # customer_data = CustomerData.objects.all().order_by('id')
    # store_data = store_detail.objects.all()
    # return render(request,'admin_template/create-email-campaign.html',{'Customer_data': customer_data, 'store_detail': store_data})
    # All Customer With Pagination
    customer_data = CustomerData.objects.all().order_by('id')
    store_data = store_detail.objects.all()
    paginator = Paginator(customer_data,10)
    page_number = request.GET.get('page')
    print(page_number)
    page_obj = paginator.get_page(page_number)
    
    return render(request,'admin_template/create-email-campaign.html',{'page_obj': page_obj, 'Customer_data': customer_data,'store_detail': store_data})


@staff_member_required
def campaignDetailEmail(request,id):
    # All Customer With Pagination
    customer_data = CustomerData.objects.all().order_by('id')
    store_data = store_detail.objects.all()
    paginator = Paginator(customer_data,10)
    page_number = request.GET.get('page')
    print(page_number)
    page_obj = paginator.get_page(page_number)
    # 
    masterCamp = CampaignEmail.objects.get(id=id)
    request.session['masterCamp'] = masterCamp.campaignName
    subCampaign = EmailSubCampaign.objects.filter(CampaignName=masterCamp)
    l1 = []
    for i in subCampaign:
        data = i.allEmails
        x = data.strip('"][').split(', ')
        for i in x:
            a = i.strip("'")
            l1.append(a)
    total = len(l1)
    data = EmailSubCampaign.objects.all().annotate(Year=ExtractYear('time_stamp')).values('Year','CampaignName').filter(CampaignName=masterCamp).annotate(dataCount=Count('Year')).order_by('CampaignName')

    # customer_data = CustomerData.objects.all().order_by('id')
    store_data = store_detail.objects.all()
    return render(request,'admin_template/campaignDetailEmail.html',{'page_obj': page_obj, 'Customer_data': customer_data, 'store_detail': store_data,'data' : data,'masterCamp' : masterCamp,'total' : total, 'store_detail': store_data})



@staff_member_required
def campaign_details2(request,id):
    masterCamp = CampaignEmail.objects.get(id=id)
    request.session['masterCamp'] = masterCamp.campaignName
    subCampaign = EmailSubCampaign.objects.filter(CampaignName=masterCamp)
    l1 = []
    for i in subCampaign:
        data = i.allEmails
        x = data.strip('"][').split(', ')
        for i in x:
            a = i.strip("'")
            l1.append(a)
    print(l1)
    total = len(l1)
    data = EmailSubCampaign.objects.all().annotate(Year=ExtractYear('time_stamp')).values('Year','CampaignName').filter(CampaignName=masterCamp).annotate(dataCount=Count('Year')).order_by('CampaignName')

    customer_data = CustomerData.objects.all().order_by('id')
    store_data = store_detail.objects.all()
    return render(request,'admin_template/campaign-detail2.html',{'data' : data,'masterCamp' : masterCamp,'total' : total,'Customer_data': customer_data, 'store_detail': store_data})



def send_email_campaign(request):
    return render(request,'admin_template/send-email-campaign.html')

def check_email_campaign(request):
    if request.method == 'GET':
        campData = request.GET['s']
        data = re.split('(Campaign)', campData)
        filter_master = CampaignEmail.objects.get(campaignName = data[0].strip())
        subCamp = EmailSubCampaign.objects.filter(CampaignName=filter_master,time_stamp__year = data[2])
        List=[]
        for i in subCamp:
            List.append(i.text)
    return HttpResponse(json.dumps(List), content_type="application/json")




@staff_member_required
def campaignDetailSMS(request,id):
    # All Customer With Pagination
    customer_data = CustomerData.objects.all().order_by('id')
    store_data = store_detail.objects.all()
    paginator = Paginator(customer_data,10)
    page_number = request.GET.get('page')
    print(page_number)
    page_obj = paginator.get_page(page_number)
    # 
    masterCamp = CampaignSms.objects.get(id=id)
    request.session['masterCamp'] = masterCamp.campaignName
    subCampaign = SmsSubCampaign.objects.filter(CampaignName=masterCamp)
    l1 = []
    for i in subCampaign:
        data = i.allsms
        x = data.strip('"][').split(', ')
        for i in x:
            a = i.strip("'")
            l1.append(a)
    total = len(l1)
    data = SmsSubCampaign.objects.all().annotate(Year=ExtractYear('time_stamp')).values('Year','CampaignName').filter(CampaignName=masterCamp).annotate(dataCount=Count('Year')).order_by('CampaignName')

    # customer_data = CustomerData.objects.all().order_by('id')
    store_data = store_detail.objects.all()
    return render(request,'admin_template/campaignDetailSMS.html',{'page_obj': page_obj, 'Customer_data': customer_data, 'store_detail': store_data,'data' : data,'masterCamp' : masterCamp,'total' : total, 'store_detail': store_data})


def checkCampaign(request):
    flag = False
    if request.method =='GET':
        camp_name = request.POST['campaignName']
        print(camp_name)
        exit()
    return HttpResponse(flag)

# ##############################################################################################################################
# ###########################   BROADCAST DATE FILTER VIEW   ###################################################################
# ##############################################################################################################################
# ---------------------------------DATETIME to JSON CONVERTER-------------------------------------------------------------------
def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()
# ------------------------------------------------------------------------------------------------------------------------------
def filterSmSDate(request):
    if request.method == 'GET':
        sDate = request.GET.get('start_date')
        eDate = request.GET.get('end_date')
        filtered_data = CampaignSms.objects.filter(time_stamp__range = [sDate,eDate])
        List=[]
        sms_dict = {}
        for i in filtered_data:
            sms_dict['id'] = i.id
            sms_dict['campName'] = i.campaignName
            sms_dict['time_stamp'] = i.time_stamp
            List.append(sms_dict)
            sms_dict = {}
        print(sms_dict)
        print(List)
        
    return HttpResponse(json.dumps(List, default = myconverter),content_type="application/json")


def filterEmailDate(request):
    if request.method == 'GET':
        sDate = request.GET.get('start_date')
        eDate = request.GET.get('end_date')
        filtered_data = CampaignEmail.objects.filter(time_stamp__range = [sDate,eDate])
        List=[]
        email_dict = {}
        for i in filtered_data:
            email_dict['id'] = i.id
            email_dict['campName'] = i.campaignName
            email_dict['time_stamp'] = i.time_stamp
            List.append(email_dict)
            email_dict = {}
        print(email_dict)
        print(List)
    return HttpResponse(json.dumps(List, default = myconverter),content_type="application/json")

# ===================================================================
# functin for load more customer data
# def loadCustData(limit,data,offset):
#     print('Function called!')
#     customersData = CustomerData.objects.all()[offset:offset+limit]

#     loadedCust = []
#     for i in customersData:
#         print(i.contact)
#         loadedCust.append(i.contact)
#     print('loadedCust : ',loadedCust)

#     objLoaded = []
#     for j in loadedCust:
#         if j not in data:
#             objLoaded.append(j)

#     print('loaded objects : ',objLoaded)
#     return objLoaded
# ===============================================================================
# Load more customers in customer management scrren via Load_More button
def load_more(request):
    if request.method == 'POST':
        offset = int(request.POST['offset'])
        limit = 10
        customersData = CustomerData.objects.all()[offset:offset+limit]
        # # ----------------------------------------------------------------------------
        # data = request.session.get('UniqueContactList')
        # custData = loadCustData(limit,data,offset)

        # if len(custData) <= 0:
        #     offset += limit
        #     custData = loadCustData(limit,data,offset)
        
        totalData = CustomerData.objects.count()
        customer_json = serializers.serialize('json',customersData)
        # --------------------------------------------------------------------------------------
        return JsonResponse(data={
            'customers' :customer_json,
            'totalResult' :totalData
        })
# ======================================================================================================
# Create New Campaign Name
def NewCampaignNameSMS(request):
    if request.method == 'GET':
        emailCampaignName = request.GET.get('name')
        filtered_data = CampaignSms.objects.filter(campaignName = emailCampaignName.strip())
        flag = False
        if len(filtered_data) != 0:
            flag = True
        else:
            flag = False
        return HttpResponse(json.dumps(flag),content_type="application/json")

# Create New Campaign Name
def NewCampaignNameEMAIL(request):
    if request.method == 'GET':
        emailCampaignName = request.GET.get('name')
        filtered_data = CampaignEmail.objects.filter(campaignName = emailCampaignName.strip())
        flag = False
        if len(filtered_data) != 0:
            flag = True
        else:
            flag = False
        return HttpResponse(json.dumps(flag),content_type="application/json")

# ##############################################################################################################################
# ##################################   EMAIL AND SMS SCHEDULING VIEWS   ########################################################
# ##############################################################################################################################
def findDay(date): 
    print('STEP 02 >>>>>>>>>>ENTERED TO THE FINDDAY FUNCTION')
    # =================================================================================================================
    # sendEmail = scheduleList.objects.all()
    # emailList = ''
    # emailText = ''
    # for i in sendEmail:
    #     emailList = i.emailList
    #     emailText = i.emailText
    # # ==================================================================='
    # emailData = emailList.replace('[',"")
    # x = emailData.replace(']',"")
    # y = x.replace("'","")
    # mailList = y.split('|')
    # emails = []
    # for i in range(len(mailList)):
    #     emails.append(mailList[i].split(","))
    # emails.pop()
    # for i in emails:
    #     i.pop()
    # # ==================================================================='
    # messageData = emailText.replace('[',"")
    # x = messageData.replace(']',"")
    # y = x.replace("'","")
    # message = y.split('|')
    # emailMessages = []
    # for i in range(len(message)):
    #     emailMessages.append(message[i].split(","))
    # emailMessages.pop()
    # for i in emailMessages:
    #     i.pop()
    #     print(emails)
    # print(len(emailMessages))
    # print(len(emails))
    # # =========================================================================================================
    # for i in range(len(emails)):
    #     dataLength = len(emails[i])
    #     if dataLength == 6:
    #         current = emailMessages[i][1]
    #         print('........',current)
    #         # send_mail(
    #         #     # subject
    #         #     'Promotional Email by ABACUS',
    #         #     # message
    #         #     emailMessages[i],
    #         #     # from_email
    #         #     settings.EMAIL_HOST_USER,
    #         #     # recipient_list
    #         #     [current],
    #         # )
    #     elif(dataLength == 7):
    #         current = emailMessages[i][1]
    #         print('........',current)
    #         # send_mail(
    #         #     # subject
    #         #     'Promotional Email by ABACUS',
    #         #     # message
    #         #     emailMessages[i],
    #         #     # from_email
    #         #     settings.EMAIL_HOST_USER,
    #         #     # recipient_list
    #         #     [current],
    #         # )
    #     print('Email number : ',i,"send successfully!")
    #     time.sleep(2)
    # print('===================================================================')
    # exit()
    # =================================================================================================================
    born = datetime.datetime.strptime(date, '%d %m %Y').weekday() 
    return (calendar.day_name[born]) 

def sudo_placement():
    print('STEP 03 >>>>>>>>>>ENTERED TO THE sudo_placement FUNCTION')
    print("+++++++++++++++++++++++++++++++++++++++++++++") 
    print("Get ready for Sudo Placement at Geeksforgeeks") 
    print("+++++++++++++++++++++++++++++++++++++++++++++") 
    # =========================================================================================================
    sendEmail = scheduleEmailList.objects.all()
    emailList = ''
    emailText = ''
    for i in sendEmail:
        emailList = i.emailList
        emailText = i.emailText
    # ==================================================================='
    emailData = emailList.replace('[',"")
    x = emailData.replace(']',"")
    y = x.replace("'","")
    mailList = y.split('|')
    emails = []
    for i in range(len(mailList)):
        emails.append(mailList[i].split(","))
    emails.pop()
    for i in emails:
        i.pop()
    # for i in range(len(emails)):
    #     # i.pop()
    #     print('..>..>..>',emails)
    #     print('LLLLLLLLLLLLLLLL',emails[i][1])
    # exit()
    # ==================================================================='
    messageData = emailText.replace('[',"")
    x = messageData.replace(']',"")
    y = x.replace("'","")
    message = y.split('|')
    emailMessages = []
    for i in range(len(message)):
        emailMessages.append(message[i].split(","))
    emailMessages.pop()
    for i in emailMessages:
        i.pop()
    print(len(emailMessages))
    print(len(emails))
    # ===============================     SEND SCHEDULED EMAILS    =====================================================
    datatuple = []
    for i in range(len(emails)):
        dataLength = len(emails[i])
        if (dataLength == 6 and len(emailMessages[i]) == 1):
            # current = emails[i][3]
            datatuple.append(('mailSubject',emailMessages[i][0],'rk468335@gmail.com',[emails[i][3]]))

        elif(dataLength == 5 and len(emailMessages[i]) == 1):
            # current = emails[i][4]
            datatuple.append(('mailSubject',emailMessages[i][0],'rk468335@gmail.com',[emails[i][2]]))
        
        elif (dataLength == 6 and len(emailMessages[i]) > 1):
            current = ''
            for j in emailMessages[i]:
                current += j
            datatuple.append(('mailSubject',current,'rk468335@gmail.com',[emails[i][3]]))

        elif(dataLength == 5 and len(emailMessages[i]) > 1):
            current = ''
            for j in emailMessages[i]:
                current += j
            datatuple.append(('mailSubject',current,'rk468335@gmail.com',[emails[i][2]]))
    # ----------------------------------------------------------------------------------------------------------------
    print('._._._._._._.',datatuple)
    datatuple = tuple(datatuple)
    send_mass_mail(datatuple)
    # ================================================================================================================
    scheduleEmailList.objects.all().delete()
    print('Email send successfully!')
    print('data deleted!')   

def schedulTask(dater,timer):
    timer = timer
    schedulingDay = findDay(dater)
    print('Returned from finday function successfully!')
    if schedulingDay == 'Sunday': 
        schedule.every().sunday.at(timer).do(sudo_placement)
    elif schedulingDay == 'Monday': 
        schedule.every().monday.at(timer).do(sudo_placement)
    elif schedulingDay == 'Tuesday': 
        schedule.every().tuesday.at(timer).do(sudo_placement)
    elif schedulingDay == 'Wednesday': 
        schedule.every().wednesday.at(timer).do(sudo_placement)
    elif schedulingDay == 'Thursday': 
        schedule.every().thursday.at(timer).do(sudo_placement)
    elif schedulingDay == 'Friday': 
        schedule.every().friday.at(timer).do(sudo_placement)
    elif schedulingDay == 'Saturday': 
        schedule.every().saturday.at(timer).do(sudo_placement)

    while True:
        schedule.run_pending()
        time.sleep(1)

@staff_member_required
def formatScheduleEmailText(request):
    print('STEP 01 >>>>>>>>>>ENTERED TO THE formatScheduleEmailText FUNCTION')
    # try:
    if request.method == 'GET':
        completeEmail = request.GET.getlist('completeEmail[]')
        Emaillist_data = request.GET.getlist('list_data[]')
        flag = False
        completeMessageList = []
        for i in range(len(completeEmail)):
            completeMessageList.append(completeEmail[i])
            completeMessageList.append('|')

        print('==============>>',completeMessageList)
        EmailList = []
        for i in range(len(Emaillist_data)):
            EmailList.append(Emaillist_data[i])
            EmailList.append('|')

        print('==============>>',EmailList)

        data = scheduleEmailList.objects.all()
        if(len(data) > 0):
            scheduleEmailList.objects.all().delete()
            scheduleEmailList(emailList = EmailList,emailText = completeMessageList).save()
            flag = True
        else:
            scheduleEmailList(emailList = EmailList,emailText = completeMessageList).save()
            flag = True
        return HttpResponse(flag)
    # except:
    #     flag = False
    #     return HttpResponse(flag)

def scheduleCustEmail(request):
    if request.method == 'POST':
        scheduleDate = request.POST['date']
        schedule_time = request.POST['time']

        #  formating date
        data = scheduleDate.split('/')
        scheduleformatedDate = data[1] + " " + data[0] + " " + data[2]
        #  formatting time
        timedata = schedule_time.split(' ')
        timeformat = timedata[0].split(':')
        
        if(timedata[1] == 'PM'):
            if(len(timeformat[0]) == 1):
                if (timeformat[0] == '1'):
                    timeformat[0] = '13'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTask(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '2'):
                    timeformat[0] = '14'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTask(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '3'):
                    timeformat[0] = '15'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTask(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '4'):
                    timeformat[0] = '16'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTask(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '5'):
                    timeformat[0] = '17'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTask(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '6'):
                    timeformat[0] = '18'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTask(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '7'):
                    timeformat[0] = '19'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTask(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '8'):
                    timeformat[0] = '20'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTask(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '9'):
                    timeformat[0] = '21'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTask(scheduleformatedDate,timesechdule)
            else:
                if (timeformat[0] == '10'):
                    timeformat[0] = '22'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTask(scheduleformatedDate,timesechdule)
                elif (timeformat[0] == '11'):
                    timeformat[0] = '23'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTask(scheduleformatedDate,timesechdule)
                elif (timeformat[0] == '12'):
                    timeformat[0] = '24'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTask(scheduleformatedDate,timesechdule)
        else:
            if(len(timeformat[0]) == 1):
                timeformat[0] = "0"+timeformat[0]
                timesechdule = timeformat[0]+':'+timeformat[1]
                schedulTask(scheduleformatedDate,timesechdule)
            else:
                timesechdule = timeformat[0]+':'+timeformat[1]
                schedulTask(scheduleformatedDate,timesechdule)
        return HttpResponse('HEllooo')

# ##############################################################################################################
# ##############################################################################################################
# ##############################################################################################################
def findDays(date): 
    print('STEP 02 >>>>>>>>>>ENTERED TO THE FINDDAY FUNCTION')
    born = datetime.datetime.strptime(date, '%d %m %Y').weekday() 
    return (calendar.day_name[born]) 

def sudo_placements():
    print('STEP 03 >>>>>>>>>>ENTERED TO THE sudo_placement FUNCTION')
    print("+++++++++++++++++++++++++++++++++++++++++++++") 
    print("Get ready for Sudo Placement at Geeksforgeeks") 
    print("+++++++++++++++++++++++++++++++++++++++++++++") 
    # =========================================================================================================
    sendEmail = scheduleSMSList.objects.all()
    smsList = ''
    smsText = ''
    for i in sendEmail:
        smsList = i.emailList
        smsText = i.emailText
    print(smsList)
    print(smsText)
    # ==================================================================='
    SmsData = smsList.replace('[',"")
    x = SmsData.replace(']',"")
    y = x.replace("'","")
    mailList = y.split('|')
    emails = []
    for i in range(len(mailList)):
        emails.append(mailList[i].split(","))
    emails.pop()
    for i in emails:
        i.pop()
    messageData = smsText.replace('[',"")
    x = messageData.replace(']',"")
    y = x.replace("'","")
    message = y.split('|')
    emailMessages = []
    for i in range(len(message)):
        emailMessages.append(message[i].split(","))
    emailMessages.pop()
    for i in emailMessages:
        i.pop()
    print(len(emailMessages))
    print(len(emails))
    # ===============================     SEND SCHEDULED EMAILS    =====================================================
    try:
        url = "https://www.fast2sms.com/dev/bulk"
        for i in range(len(emails)):
            dataLength = len(emails[i])
            if (dataLength == 6 and len(emailMessages[i]) == 1):
                # current = emails[i][3]
                print('inside 01 ',emailMessages[i][0],'||',emails[i][1])
                url = "https://www.fast2sms.com/dev/bulk"
                payload = "sender_id=FSTSMS&message=" + str(emailMessages[i][0]) +"&language=english&route=p&numbers=" + str(emails[i][1])
                headers = {
                'authorization': "QDo5cIdOBq6xG8YygsMkleWt7FAbXpjhimvZPz4J0VunCNEUf1D9H8ugEpaBMfK3FnwOhojeyZQXTWJm",
                'Content-Type': "application/x-www-form-urlencoded",
                'Cache-Control': "no-cache",
                }
                response = requests.request("POST", url, data=payload, headers=headers)
                print('inside 01 Done')


            elif(dataLength == 5 and len(emailMessages[i]) == 1):
                # current = emails[i][4]
                print('inside 02',emailMessages[i][0],'||',emails[i][1])
                url = "https://www.fast2sms.com/dev/bulk"
                payload = "sender_id=FSTSMS&message=" + str(emailMessages[i][0]) +"&language=english&route=p&numbers=" + str(emails[i][1])
                headers = {
                'authorization': "QDo5cIdOBq6xG8YygsMkleWt7FAbXpjhimvZPz4J0VunCNEUf1D9H8ugEpaBMfK3FnwOhojeyZQXTWJm",
                'Content-Type': "application/x-www-form-urlencoded",
                'Cache-Control': "no-cache",
                }
                response = requests.request("POST", url, data=payload, headers=headers)
                print('inside 02 Done')

            
            elif (dataLength == 6 and len(emailMessages[i]) > 1):
                current = ''
                for j in emailMessages[i]:
                    current += j
                    print('inside 03',current,'||',emails[i][2])
                    url = "https://www.fast2sms.com/dev/bulk"
                    payload = "sender_id=FSTSMS&message=" + current +"&language=english&route=p&numbers=" + emails[i][2]
                    headers = {
                    'authorization': "QDo5cIdOBq6xG8YygsMkleWt7FAbXpjhimvZPz4J0VunCNEUf1D9H8ugEpaBMfK3FnwOhojeyZQXTWJm",
                    'Content-Type': "application/x-www-form-urlencoded",
                    'Cache-Control': "no-cache",
                    }
                    response = requests.request("POST", url, data=payload, headers=headers)
                    print('inside 03 Done')


            elif(dataLength == 5 and len(emailMessages[i]) > 1):
                current = ''
                for j in emailMessages[i]:
                    current += j
                    print('inside 04',current,'||',emails[i][2])
                    url = "https://www.fast2sms.com/dev/bulk"
                    payload = "sender_id=FSTSMS&message=" + current +"&language=english&route=p&numbers=" + emails[i][2]
                    headers = {
                    'authorization': "QDo5cIdOBq6xG8YygsMkleWt7FAbXpjhimvZPz4J0VunCNEUf1D9H8ugEpaBMfK3FnwOhojeyZQXTWJm",
                    'Content-Type': "application/x-www-form-urlencoded",
                    'Cache-Control': "no-cache",
                    }
                    response = requests.request("POST", url, data=payload, headers=headers)
                    print('inside 04 Done')

        # ================================================================================================================
        scheduleSMSList.objects.all().delete()
        print('SMS send successfully!')
        print('data deleted!')  
    except:
         print('Errror Occured!!!')
         exit()  

def schedulTasks(dater,timer):
    timer = timer
    schedulingDay = findDays(dater)
    print('Returned from finday function successfully!')
    if schedulingDay == 'Sunday': 
        schedule.every().sunday.at(timer).do(sudo_placements)
    elif schedulingDay == 'Monday': 
        schedule.every().monday.at(timer).do(sudo_placements)
    elif schedulingDay == 'Tuesday': 
        schedule.every().tuesday.at(timer).do(sudo_placements)
    elif schedulingDay == 'Wednesday': 
        schedule.every().wednesday.at(timer).do(sudo_placements)
    elif schedulingDay == 'Thursday': 
        schedule.every().thursday.at(timer).do(sudo_placements)
    elif schedulingDay == 'Friday': 
        schedule.every().friday.at(timer).do(sudo_placements)
    elif schedulingDay == 'Saturday': 
        schedule.every().saturday.at(timer).do(sudo_placements)

    while True:
        schedule.run_pending()
        time.sleep(1)

@staff_member_required
def formatScheduleSMSText(request):
    print('STEP 01 >>>>>>>>>>ENTERED TO THE formatScheduleEmailText FUNCTION')
    # try:
    if request.method == 'GET':
        completeSMS = request.GET.getlist('completeSMS[]')
        Emaillist_data = request.GET.getlist('list_data[]')
        flag = False
        completeMessageList = []
        for i in range(len(completeSMS)):
            completeMessageList.append(completeSMS[i])
            completeMessageList.append('|')

        print('==============>>',completeMessageList)
        EmailList = []
        for i in range(len(Emaillist_data)):
            EmailList.append(Emaillist_data[i])
            EmailList.append('|')

        print('==============>>',EmailList)

        data = scheduleSMSList.objects.all()
        if(len(data) > 0):
            scheduleSMSList.objects.all().delete()
            scheduleSMSList(emailList = EmailList,emailText = completeMessageList).save()
            flag = True
        else:
            scheduleSMSList(emailList = EmailList,emailText = completeMessageList).save()
            flag = True
        return HttpResponse(flag)
    # except:
    #     flag = False
    #     return HttpResponse(flag)

def scheduleCustSMS(request):
    if request.method == 'POST':
        scheduleDate = request.POST['date']
        schedule_time = request.POST['time']

        #  formating date
        data = scheduleDate.split('/')
        scheduleformatedDate = data[1] + " " + data[0] + " " + data[2]
        #  formatting time
        timedata = schedule_time.split(' ')
        timeformat = timedata[0].split(':')
        
        if(timedata[1] == 'PM'):
            if(len(timeformat[0]) == 1):
                if (timeformat[0] == '1'):
                    timeformat[0] = '13'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTasks(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '2'):
                    timeformat[0] = '14'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTasks(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '3'):
                    timeformat[0] = '15'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTasks(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '4'):
                    timeformat[0] = '16'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTasks(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '5'):
                    timeformat[0] = '17'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTasks(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '6'):
                    timeformat[0] = '18'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTasks(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '7'):
                    timeformat[0] = '19'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTasks(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '8'):
                    timeformat[0] = '20'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTasks(scheduleformatedDate,timesechdule)

                elif (timeformat[0] == '9'):
                    timeformat[0] = '21'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTasks(scheduleformatedDate,timesechdule)
            else:
                if (timeformat[0] == '10'):
                    timeformat[0] = '22'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTasks(scheduleformatedDate,timesechdule)
                elif (timeformat[0] == '11'):
                    timeformat[0] = '23'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTasks(scheduleformatedDate,timesechdule)
                elif (timeformat[0] == '12'):
                    timeformat[0] = '24'
                    timesechdule = timeformat[0]+':'+timeformat[1]
                    schedulTasks(scheduleformatedDate,timesechdule)
        else:
            if(len(timeformat[0]) == 1):
                timeformat[0] = "0"+timeformat[0]
                timesechdule = timeformat[0]+':'+timeformat[1]
                schedulTasks(scheduleformatedDate,timesechdule)
            else:
                timesechdule = timeformat[0]+':'+timeformat[1]
                schedulTasks(scheduleformatedDate,timesechdule)
        return HttpResponse('HEllooo')


# ================================================================================================================
# ==============================================      ONBOARD FILTER      ========================================
# ================================================================================================================
# def onboardFilter(request):
#     return HttpResponse('HEllooo')
# ================================================================================================================
