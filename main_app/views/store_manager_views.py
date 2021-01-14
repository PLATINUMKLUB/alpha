from django.shortcuts import render, redirect,HttpResponse
from django.http import JsonResponse,HttpResponseRedirect
from main_app.models.store_manager_models import *
from main_app.views.admin_view import *
from main_app.models.login_models import registration
from django.contrib.auth.models import User
from django.contrib.auth import login,authenticate,logout
from django.contrib.auth.decorators import login_required
import csv,io,json
import datetime
from django.db.models.functions import TruncMonth
from django.db.models import Count
from django.db.models import Sum, Avg

# from login_system import views


# Create your views here.
@login_required(login_url="/signup")
def store(request):
    try:
        if request.user:
            if request.user.is_superuser:
                return HttpResponseRedirect('ab_admin')

        entry = request.session.get('entry')
        storeid = request.session.get('storeID')
        context_1 = {}
        context_2 = {}
        context_3 = {}
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

        context_3['total_amount_1'] = 0
        context_3['total_amount_2'] = 0
        context_3['total_amount_3'] = 0
        context_3['total_amount_4'] = 0
        context_3['total_amount_5'] = 0
        context_3['total_amount_6'] = 0
        context_3['total_amount_7'] = 0
        context_3['total_amount_8'] = 0
        context_3['total_amount_9'] = 0
        context_3['total_amount_10'] = 0
        context_3['total_amount_11'] = 0
        context_3['total_amount_12'] = 0
        context = {}
        if(entry == 'Manual'):
            context['entry'] = 'Manual'
        elif(entry == 'SheetUpload'):
            context['entry'] = 'SheetUpload'
        else:
            context['entry'] = 'Both'
        # cust_data_by_sID = store_detail.objects.get(storeID=storeid)
        # Month Wise Customer
        custNo = CustomerData.objects.filter(storeID=storeid).annotate(month=TruncMonth('time_stamp')).values('month').annotate(c=Count('id')).values('month', 'c')
        l1 = []
        for i in custNo:
            context_1['month_'+str(i['month'].date().month)] = i['c']
        print(context_1)
        for i in context_1.values():
            l1.append(i)
        
        l2 = []
        l3 = []
        # Mothly Wise Amount
        cusInstance = CustomerData.objects.filter(storeID=storeid)
        for cusData in cusInstance:
            shopData = list(CustomerShopData.objects.filter(storeID=storeid, customerID=cusData).values('amount').annotate(
                month=TruncMonth('time_stamp')).values('month').annotate(AMTSUM=Sum('amount')).values('month', 'AMTSUM'))
            for j in shopData:
                # context_2['month_avg_'+str(cusData['month'].date().month)]
                l2.append(j['AMTSUM'])
                context_3['total_amount_'+str(j['month'].date().month)] = sum(l2)
                average = sum(l2)//len(l2)
                context_2['month_avg_'+str(j['month'].date().month)] = average
        for i in context_2.values():
            l3.append(i)
        request.session['admin_cust_list'] = l1
        request.session['admin_avg_list'] = l3
        return render(request, 'store-manager/store.html', {'entry':entry,'context': context, 'context_1': context_1, 'context_2': context_2, 'context_3' : context_3})
    except:
        entry = request.session.get('entry')
        storeid = request.session.get('storeID')
        context_1 = {}
        context_2 = {}
        context_3 = {}
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

        context_3['total_amount_1'] = 0
        context_3['total_amount_2'] = 0
        context_3['total_amount_3'] = 0
        context_3['total_amount_4'] = 0
        context_3['total_amount_5'] = 0
        context_3['total_amount_6'] = 0
        context_3['total_amount_7'] = 0
        context_3['total_amount_8'] = 0
        context_3['total_amount_9'] = 0
        context_3['total_amount_10'] = 0
        context_3['total_amount_11'] = 0
        context_3['total_amount_12'] = 0
        return render(request, 'store-manager/store.html', {'context': context, 'context_1': context_1, 'context_2': context_2, 'context_3' : context_3})

# =============================================================================================================================
#                                                 SHEET ENTRY VIEW
# =============================================================================================================================
@login_required(login_url="/signup")
def sheet(request):
    if request.user:
            if request.user.is_superuser:
                return HttpResponseRedirect('ab_admin')
    return render(request,'store-manager/entry-via-sheet.html')
# =============================================================================================================================
#                                                MANUAL SEARCH and ENTRY VIEW
# =============================================================================================================================
@login_required(login_url="/signup")
def manualFormSheet(request):
    if request.user:
            if request.user.is_superuser:
                return HttpResponseRedirect('ab_admin')
    return render(request, 'store-manager/manual-entry.html')


@login_required(login_url="/signup")
def manualEntryData(request):
    if request.user:
            if request.user.is_superuser:
                return HttpResponseRedirect('ab_admin')
    if request.method == 'POST':
        
        mannual_contact = request.POST['contact']
        mannual_invoice = request.POST['invoice']
        customerName = request.POST['name']
        CustomerGender = request.POST.get('gender')
        customerDOB = request.POST['DOB']
        customerDOM = request.POST['DOM']
        customerEmail = request.POST['email']
        mannual_amount = request.POST['amount']
        print(mannual_contact,mannual_invoice,customerName,CustomerGender,customerDOB,customerDOM,customerEmail,mannual_amount)
        mannual_contact =  mannual_contact.strip()
        mannual_invoice = mannual_invoice.strip()
        customerName =  customerName.strip()
        CustomerGender =  CustomerGender
        customerDOB =  customerDOB.strip()
        customerDOM =  customerDOM.strip()
        customerEmail =  customerEmail.strip()
        mannual_amount =  mannual_amount.strip()
        

        storeid = request.session.get('storeID')
        checkData = CustomerData.objects.filter(storeID=storeid,contact=mannual_contact)

        if CustomerGender == None:
            CustomerGender = "NA"
        
        if len(checkData) == 1:
            for i in checkData:
                i.name=customerName
                i.contact=mannual_contact
                i.email=customerEmail
                i.DOB=customerDOB
                i.DOM=customerDOM
                i.gender=CustomerGender
                i.save()
                print(">>>>>>>>>>>>>datasaved")
                
                shopData = CustomerShopData(storeID=storeid, customerID=i, invoice=mannual_invoice, amount=mannual_amount).save()
        else:
            custData = CustomerData(storeID=storeid, name=customerName, contact=mannual_contact,
                                    email=customerEmail, DOB=customerDOB,DOM=customerDOM,gender=CustomerGender, entry_type='Manual')
            custData.save()
            shopData = CustomerShopData(storeID=storeid, customerID=custData, invoice=mannual_invoice, amount=mannual_amount).save()
        return HttpResponse('Hello')
        
    else:
        entry = request.session.get('entry')
        print(entry)
        context = {}

        if(entry == 'Manual'):
            context['entry'] = 'Manual'
            print(entry)
        elif(entry == 'SheetUpload'):
            context['entry'] = 'SheetUpload'
            print(entry)
        else:
            context['entry'] = 'Both'
            print(entry)
        return render(request, 'store-manager/manual-entry.html', context)



# ---------------------------------------------SEARCHING FOR EXISTING CSV_RECORD-----------------------------------------------
def myconverter(o):
    date = str(o.strftime("%m/%d/%Y"))
    return date

@login_required(login_url="/signup")
def checkExistCustomer(request):
    if request.method == 'POST':
        ContactNumber = request.POST['ContactNumber']
        ContactNumber = ContactNumber.strip()
        print(ContactNumber.strip())
        
        storeid = request.session.get('storeID')
        contactData = list(CustomerData.objects.filter(
            storeID=storeid, contact=ContactNumber).values())
        print(">>>>>>>>>??????????",contactData)
        # print(">>>>>>>>>??????????",contactData[0]['gender'])


        
        return HttpResponse(json.dumps(contactData, default=myconverter), content_type="application/json")


@login_required(login_url="/signup")
def checkExistInVoiceNo(request):
    if request.method == 'POST':
        flag = "False"
        InVoiceNumber = request.POST['InVoiceNumber']
        MobileNumber = request.POST['MobileNumber']
        InVoiceNumber = InVoiceNumber.strip()
        storeid = request.session.get('storeID')
        # checkData = CustomerData.objects.filter(storeID=storeid)
        shopData = CustomerShopData.objects.filter(invoice=InVoiceNumber, storeID=storeid)
        if len(shopData) == 1:
            flag = "True"
        else:
            flag = "False"
        return HttpResponse(flag)

@login_required(login_url="/signup")
def NewInVoiceNogenrate(request):
    if request.method == 'GET':
        storeid = request.session.get('storeID')
        latestInvoice = CustomerShopData.objects.filter(
            storeID=storeid).values('invoice').latest('id')
        # latestInvoice = latestInvoice['invoice']

        return HttpResponse(json.dumps(latestInvoice), content_type="application/json")


        
  

# =============================================================================================================================
#                                         STORE MANAGER PROFILE VIEW
# =============================================================================================================================
@login_required(login_url="/signup")
def edit_store_profile(request):
    try:
        if request.user:
            if request.user.is_superuser:
                return HttpResponseRedirect('ab_admin')

        if request.method == 'POST':
            name = request.POST['manager_name']
            email = request.POST['manager_email']
            image = request.FILES.get('manager_image')

            print('>>>>>>>>>',image)
            # exit()

            user = User.objects.get(email =email.strip())
            user.first_name= name.strip()

            storeid = request.session.get('storeID')

            store_instance = store_detail.objects.get(storeID=storeid)
            manager = store_manager.objects.get(store=store_instance)
            manager.manager_name = name.strip()
            if image != None:
                manager.manager_image = image
            user.save()
            manager.save()
           
            return redirect('profile')
    except:
        return render(request, 'store-manager/profile.html', {'error': 'An error occured.Try again!'})


def store_profile(request):
    try:
        if request.user:
            if request.user.is_superuser:
                return HttpResponseRedirect('ab_admin')
        try:
            user = User.objects.get(id=request.user.id)
            storeid = request.session.get('storeID')

            store_instance = store_detail.objects.get(storeID=storeid)
            print(type(store_instance.store_category))
            x = store_instance.store_category
            a = x.replace('[','')
            b = a.replace(']','')
            c = b.replace("'",'')
            # catList = c.split(',')
            # print('>>>>>>>>>>>>>>>>>',type(b),b)
            manager = store_manager.objects.get(store=store_instance)
            # store_category = manager.manager_image

            return render(request, 'store-manager/profile.html', {'store_data': store_instance, 'manager': manager.manager_contact, 'image': manager.manager_image,'category' : c})
        except:
            logout(request)
            return HttpResponseRedirect('/signin')
    except:
        return render(request, 'store-manager/profile.html', {'error': 'An error occured.Try again!'})
        

# =============================================================================================================================
#                                           PREVIEW SHEET DATA VIEW
# =============================================================================================================================
@login_required(login_url="/signup")
def preview(request):
    if request.user:
            if request.user.is_superuser:
                return HttpResponseRedirect('ab_admin')
    return render(request, 'store-manager/preview-data.html')

# =============================================================================================================================
#                                        CHANGE STORE MANAGER PASSWORD VIEW
# =============================================================================================================================
@login_required(login_url="/signup")
def change_pwd(request):
    # try:
    if request.user:
            if request.user.is_superuser:
                return HttpResponseRedirect('ab_admin')
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
            return render(request, 'store-manager/change-password.html',context)
        return render(request, 'store-manager/change-password.html',context)


    return render(request, 'store-manager/change-password.html',context)
    # except:
    #     return render(request, 'store-manager/change-password.html')


@login_required(login_url="/signup")
def uploadcsvData(request):
    if request.user:
            if request.user.is_superuser:
                return HttpResponseRedirect('ab_admin')
    if request.method == 'POST':
        try:
            name = request.POST['Name']
            ContactNO = request.POST['ContactNO']
            DOB = request.POST['DOB']
            MAILID = request.POST['MAILID']
            GENDER = request.POST['GENDER']
            AMT = request.POST['AMT']
            INVONO = request.POST['INVONO']
            DOM = request.POST['DOM']
            ListContactNO = ContactNO.split(',')
            Listname = checkList(name.split(','),len(ListContactNO))
            ListDOB = checkList(DOB.split(','),len(ListContactNO))
            ListMAILID = checkList(MAILID.split(','),len(ListContactNO))
            ListGENDER = checkList(GENDER.split(','),len(ListContactNO))
            ListAMT = AMT.split(',') 
            ListINVONO = INVONO.split(',')
            ListDOM =  checkList(DOM.split(','),len(ListContactNO))
            print('ListGENDER : ',ListGENDER)
        

            storeid = request.session.get('storeID')

            print('>>>>>>>>',storeid,Listname,ListContactNO,ListINVONO,ListAMT,ListMAILID,ListDOB,ListDOM,ListGENDER)

            for i in range(len(ListContactNO)):
                print('\n>>>>>>>>',ListAMT[i])
                checkData = CustomerData.objects.filter(storeID=storeid,contact=ListContactNO[i].strip())
                print('>>>>>>>>>>>>>>>>>>?????????????????',checkData)
                if len(checkData) == 1:
                    Duplicateinvoice = CustomerShopData.objects.filter(storeID=storeid,invoice=ListINVONO[i].strip())
                    print(Duplicateinvoice)
                    if not Duplicateinvoice:
                        print('new cust')
                        dataInstance = CustomerData.objects.get(storeID=storeid,contact=ListContactNO[i].strip())
                        shopData = CustomerShopData(storeID=storeid,customerID=dataInstance,invoice=ListINVONO[i].strip(),amount=ListAMT[i].strip()).save()
                    else:
                        print('DUPLICATE INVOICE >>>>>>>>',Duplicateinvoice)

                else:
                    print('######### new entry1 ############',ListMAILID[i].strip())
                    print('-----------------------------------------------------')
                    custData = CustomerData(storeID=storeid,
                                            name=Listname[i].strip(),
                                            contact=ListContactNO[i].strip(),
                                                email=ListMAILID[i].strip(), 
                                                DOB=ListDOB[i].strip(),
                                                DOM=ListDOM[i].strip(),
                                                gender=ListGENDER[i].strip(),
                                                entry_type='CSV')
                    print('======> : ',custData)
                    custData.save()
                    shopData = CustomerShopData(storeID=storeid,customerID=custData,invoice=ListINVONO[i].strip() ,amount=ListAMT[i].strip()).save()
            return JsonResponse({'msg': 'Success'})
                
        except:
            return JsonResponse({'msg': 'Fail'})
    else:
        entry = request.session.get('entry')
        context = {}
        if(entry == 'Manual'):
            context['entry'] = 'Manual'
        elif(entry == 'SheetUpload'):
            context['entry'] = 'SheetUpload'
        else:
            context['entry'] = 'Both'
        return render(request, 'store-manager/entry-via-sheet.html',context)

# utility function : check blank list
def checkList(listData,lenList):
    print('::>>>>>>',listData,len(listData),lenList)
    empList = []
    if len(listData) == 1:
        for i in range(lenList):
            empList.append('')
        return empList
    else:
        return listData



def validate_emailID(request):
    try:
        email = request.GET['email']
        if(request.user.username == email):
            return HttpResponse('true')
        else:
            return HttpResponse('false')
    except:
        return render(request, 'store-manager/manual-entry.html')


def StoreCustomerGraph1(request):
    if request.method == 'GET':
        chart1_data = request.session.get('admin_cust_list')
        return HttpResponse(json.dumps(chart1_data), content_type="application/json")


def StoreCustomerGraph2(request):
    if request.method == 'GET':
        chart2_data = request.session.get('admin_avg_list')
        return HttpResponse(json.dumps(chart2_data), content_type="application/json")


def onboardentry(request):
    return render(request,'store-manager/onboardentry.html')


# =================================================================================================================================
@login_required(login_url="/signup")
def uploadOnboarCsvData(request):
    if request.user:
            if request.user.is_superuser:
                return HttpResponseRedirect('ab_admin')
    if request.method == 'POST':
        try:
            name = request.POST['Name']
            ContactNO = request.POST['ContactNO']
            DOB = request.POST['DOB']
            MAILID = request.POST['MAILID']
            GENDER = request.POST['GENDER']
            AMT = request.POST['AMT']
            INVONO = request.POST['INVONO']
            DOM = request.POST['DOM']
            TIER = request.POST['TIER']

            ListContactNO = ContactNO.split(',')
            Listname = checkList(name.split(','),len(ListContactNO))
            ListDOB =checkList( DOB.split(','),len(ListContactNO))
            ListMAILID =checkList( MAILID.split(','),len(ListContactNO))
            ListGENDER =checkList( GENDER.split(','),len(ListContactNO))
            ListAMT = AMT.split(',')
            ListINVONO = checkList(INVONO.split(','),len(ListContactNO))
            ListDOM = checkList(DOM.split(','),len(ListContactNO))
            ListTIER = TIER.split(',')

            storeid = request.session.get('storeID')
            
            for i in range(len(ListContactNO)):
                checkCustomerData = CustomerData.objects.filter(storeID=storeid,contact=ListContactNO[i])
                if len(checkCustomerData) == 1:
                    for j in range(len(checkCustomerData)):
                        print('DAata Already SAVED!0 :)',checkCustomerData[j])
                        checkOnboardData  = CustomerOnboardData.objects.filter(storeID=storeid,customerID=checkCustomerData[j])
                        if len(checkOnboardData) == 0:
                            print('DAata Already SAVED!1 :)')
                            dataInstance = CustomerData.objects.get(storeID=storeid,contact=int(ListContactNO[i])) 
                            onboardData = CustomerOnboardData(storeID=storeid,customerID=dataInstance,tierRuleNo=int(ListTIER[i]),total_amount=float(ListAMT[i])).save()
                        else:
                            x = checkCustomerData[j]
                            x.name=Listname[i]
                            x.email=ListMAILID[i]
                            x.gender=ListGENDER[i]
                            x.DOM=ListDOM[i]
                            x.DOB=ListDOB[i]
                            x.save()
                            print('DAata Already SAVED!2 :)')

                else:
                    custData = CustomerData(storeID=storeid, name=Listname[i], contact=int(ListContactNO[i]), email=ListMAILID[i], DOB=ListDOB[i], DOM=ListDOM[i], gender=ListGENDER[i],entry_type='CSV-Onboard')
                    onboardData = CustomerOnboardData(storeID=storeid,customerID=custData,tierRuleNo=int(ListTIER[i]) ,total_amount=float(ListAMT[i]))
                    custData.save()
                    onboardData.save()

            return JsonResponse({'msg': 'Success'})
        except:
            return JsonResponse({'msg': 'Fail'})
    else:
        entry = request.session.get('entry')
        context = {}
        if(entry == 'Manual'):
            context['entry'] = 'Manual'
        elif(entry == 'SheetUpload'):
            context['entry'] = 'SheetUpload'
        else:
            context['entry'] = 'Both'
        return render(request, 'store-manager/entry-via-sheet.html',context)
