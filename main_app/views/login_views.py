from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse,HttpResponse,HttpResponseRedirect
from main_app.models.login_models import registration,customerQueries
from django.contrib.auth.models import User
from django.contrib.auth import login,authenticate,logout
from django.core.mail import send_mail
from django.conf import settings
import random,requests,re
import string
import twilio
from twilio.rest import Client
from django.contrib.auth.decorators import login_required

# @login_required(login_url = '/signup')
def home(request):
    try:
        entry = request.session.get('entry')
        context = {}
        if request.user:
            if request.user.is_superuser:
                print("Admin Logged in")
                return HttpResponseRedirect('ab_admin')

            elif request.user.is_active:
                return HttpResponseRedirect('store')
        # elif request.user == 'AnonymousUser':
        #     return render(request, 'index.html')

        # if(entry == 'Manual'):
        #     context['entry'] = 'Manual'
        # elif(entry == 'SheetUpload'):
        #     context['entry'] = 'SheetUpload'
        # else:
        #     context['entry'] = 'Both'
        return render(request, 'index.html',context)
    except:
        return render(request, '404.html')



def customer_query(request):
    try:
        if request.method == 'POST':
            fname = request.POST.get('fname')
            lname = request.POST.get('lname')
            email = request.POST.get('email')
            contact = request.POST.get('contact')

            fname = fname.strip()
            lname = lname.strip()
            email = email.strip()
            contact = int(contact)

            fullname = fname + lname
            print(type(fullname))
            print(type(email))
            print(type(contact))
            
            data = customerQueries(customer_name = fullname,customer_email = email,customer_contact = contact,customer_DOB = 'NA',customer_message = 'NA', source = 'Subscription_form').save()

        return HttpResponse('Data Saved')
    except:
        return render(request, '404.html')

def customer_query1(request):
    try:
        if request.method == 'POST':
            fname = request.POST.get('fname')
            lname = request.POST.get('lname')
            email = request.POST.get('email')
            contact = request.POST.get('contact')

            fname = fname.strip()
            lname = lname.strip()
            email = email.strip()
            contact = int(contact)

            fullname = fname + lname
            print(type(fullname))
            print(type(email))
            print(type(contact))
            
            data = customerQueries(customer_name = fullname,customer_email = email,customer_contact = contact,customer_DOB = 'NA',customer_message = 'NA', source = 'Enquiry_form').save()

        return HttpResponse('Data Saved')
    except:
        return render(request, '404.html')

def customer_query2(request):
    try:
        if request.method == 'POST':
            name = request.POST.get('name')
            DOB = request.POST.get('dob')
            email = request.POST.get('email')
            contact = request.POST.get('contact')
            message = request.POST.get('message')


            name = name.strip()
            DOB = DOB.strip()
            email = email.strip()
            contact = int(contact)

            
            data = customerQueries(customer_name = name,customer_email = email,customer_contact = contact,customer_DOB = DOB,customer_message = message, source = 'Contact_form').save()

        return HttpResponse('Data Saved')
    except:
        return render(request, '404.html')

'''----------------------------------------------------------------------------------------------------------------------------------------------------'''
# REGISTERING A VALID USER INTO THE customers DATABASE TABLE
def signup(request):
    if request.user:
        if request.user.is_superuser:
            print("Admin Logged in")
            return HttpResponseRedirect('ab_admin')

        elif request.user.is_active:
            return HttpResponseRedirect('store')
    try:
        if request.method == 'POST':
            fname = request.POST['fname']
            lname = request.POST['lname']
            email = request.POST['email']
            contact = request.POST['phone']

            content = f"A request is initiated for the registration for the ABACUS-CRM Store Manager.\n\nKindly create a credential for the request if it is a valid or known request user\n\n\n\nInformation Provided by the User\n\n\nName : {fname} {lname}\nEmail : {email}\nContact : {contact}"

            admin_mail = 'rk468335@gmail.com'
            send_mail(
                # subject
                "ABACUS CRM Registration",
                # message
                content,
                # from_email
                settings.EMAIL_HOST_USER,
                # recipient_list
                [admin_mail],
            )
            

            # usr = User.objects.create_user(email,email,password)
            # usr.first_name = fname
            # usr.last_name = lname
            # usr.save()

            # reg = registration(user = usr,contact=contact,password_saved=password)
            # reg.save()



            print('Registered successfully')

            return render(request, 'login_system/login.html',{'registered' : 'Registration Successful. Contact your admin to continue.'})
    except:
        return render(request, 'login_system/login.html',{'registered' : 'User Already Exist'})

    return render(request, 'login_system/login.html')


'''----------------------------------------------------------------------------------------------------------------------------------------------------'''

# LOGIN function to validate a registered user
def signin(request):
    try:
        if request.user:
            if request.user.is_superuser:
                print("Admin Logged in")
                return HttpResponseRedirect('ab_admin')

            elif request.user.is_active:
                return HttpResponseRedirect('store')

        if request.method == 'POST':

            email_phone = request.POST['email_phone']
            print('this is username or phone@@@@@@@@@@@@@@@',email_phone)
            password = request.POST['pass']

            try:
                # login via phone number
                if len(email_phone) == 10:
                    # accessing OneToOne field data
                    data = registration.objects.get(contact = email_phone)
                    print('user object data : ',data)

                    print('contact data : ', data.contact)

                    request.session['contact'] = data.contact
                    print(data.storeID)
                    # request.session['storeID'] = data.storeID
                    request.session['entry'] = data.entry_type
                    print(data.entry_type)

                    # request.session['contact'] = data

                    user = authenticate(username = data,password = password)
                    print('this is user from contact ---> ',user.first_name)

                    if user:
                        login(request,user)
                        if user.is_superuser:
                            print('This user is superuser')
                            return HttpResponseRedirect('/ab_admin')
                        if user.is_staff:
                            print('This user is staff')
                            return HttpResponse('Staff')
                        if user.is_active:
                            request.session['storeID'] = data.storeID
                            print('This user is normal user >>>>>>>>>>> session created!')
                            return HttpResponseRedirect('/store')

                # login via email and (username for ADMIN LOGIN)
                else:
                    user = authenticate(username = email_phone,password = password)
                    print('this is user from email ---> ',user.first_name)

                    data = registration.objects.get(user = user)

                    request.session['contact'] = data.contact
                    print('This is Store iD :>>>>>>',data.storeID)
                    # request.session['storeID'] = data.storeID
                    request.session['entry'] = data.entry_type
                    print(data.entry_type)

                    # data = registration.objects.get(contact=user)
                    # print('contact data : ', data.contact)

                    # request.session['contact'] = data.contact

                    if user:
                        login(request,user)
                        if user.is_superuser:
                            print('This user is superuser')
                            return HttpResponseRedirect('/ab_admin')
                        if user.is_staff:
                            print('This user is staff')
                            return HttpResponse('<h1>Staff</h1>')
                        if user.is_active:
                            request.session['storeID'] = data.storeID
                            print('This user is normal user')
                            return HttpResponseRedirect('/store')

            except:
                return render(request, 'login_system/login.html', {'error': 'Invalid Credentials'})
    except:
        return render(request, 'login_system/login.html',{'error' : 'Invalid Credentials'})


    return render(request, 'login_system/login.html')


'''----------------------------------------------------------------------------------------------------------------------------------------------------'''
# OTP generation and OTP verification using Phone


def send_otp(request):

    if request.is_ajax():
        receiver = request.POST.get('phone_email_otp')

        request.session['receiver'] = receiver
        print(receiver)

        
        if len(receiver) == 10:
            receiver = int(receiver)
            receiver1 = registration.objects.filter(contact = receiver )
        

            if (len(receiver1) > 0):

                # receiver = str(receiver)

                otp = random.randint(1111, 9999)
                print('=>>>>>>>>',receiver, otp)

                request.session['otp'] = otp
                print("ON GOING OTP")
                url = "https://www.fast2sms.com/dev/bulk"
                payload = "sender_id=FSTSMS&message=" + str(otp) +"&language=english&route=p&numbers=" + str(receiver)
                headers = {
                'authorization': "QDo5cIdOBq6xG8YygsMkleWt7FAbXpjhimvZPz4J0VunCNEUf1D9H8ugEpaBMfK3FnwOhojeyZQXTWJm",
                'Content-Type': "application/x-www-form-urlencoded",
                'Cache-Control': "no-cache",
                }
                response = requests.request("POST", url, data=payload, headers=headers)

                print("ON GOING OTP2")

                return JsonResponse({'contact_data': receiver, 'msg': 'Success'})

            else:
                return JsonResponse({'msg': 'Fail'})

        else:
            return JsonResponse({'msg': 'invalid'})
        # except:
        #     return JsonResponse({'msg': 'error'})

    else:
        return render(request, 'login_system/login.html')


def otp_login(request):
    
    otp_sent = request.session.get('otp', 'otp')
    receiver = request.session.get('receiver', 'receiver')
    print('Inside otp login view')
    print(receiver)

    # otp_sent = str(otp_sent)
    print(otp_sent)
    print(type(otp_sent))

    try:
        if request.method == 'POST':
            d1 = request.POST.get('d1')
            d2 = request.POST.get('d2')
            d3 = request.POST.get('d3')
            d4 = request.POST.get('d4')

            print(d1, d2, d3, d4)

            otp_str = str(d1+d2+d3+d4)
            otp_str = int(otp_str)
            print(otp_str)
            print(type(otp_str))

            # comparing the generated OTP to user received/entered OTP
            if otp_str == otp_sent:

                data = registration.objects.get(contact=receiver)
                print('contact data : ', data.contact)

                request.session['contact'] = data.contact

                password = data.password_saved
                print('this is password : ', password)

                x = User.objects.get(username=data)
                print('this is x : ', x)
                request.session['storeID'] = data.storeID
                # request.session['contact'] = data

                user = authenticate(username=data, password=password)
                print('this is user from contact ---> ', user)

                login(request, user)

                return HttpResponseRedirect('/store')

            else:
                return render(request, 'login_system/login.html', {'error': 'Invalid OTP'})

            # render(request, 'login_system/login.html',{'error': 'Invalid OTP'})

        else:
            return HttpResponseRedirect('/signin')

    except:
        return render(request, 'login_system/login.html', {'error': 'Invalid OTP'})


'''----------------------------------------------------------------------------------------------------------------------------------------------------'''
# RESEND OTP again


def resend_otp(request):

    if request.is_ajax():

        receiver = request.session.get('receiver', 'receiver')
        print(receiver)

        
        if len(receiver) == 10:
            print('inside the otp mobile section')
            receiver = int(receiver)
            # user = customers.get_user_by_phone(receiver)
            data = registration.objects.get(contact=receiver)
            print('contact data : ', data)

            if data:

                receiver = str(receiver)
                number = '+91'+receiver

                otp = random.randint(1111, 9999)
                print(number, otp)

                request.session['otp'] = otp

                account_sid = 'AC9efb6171a5b9a3fd668ba5a8fa075e6f'
                auth_token = '507335111388d4440bd176ea2b433e63'
                client = Client(account_sid, auth_token)

                message = client.messages.create(
                        body="\nDear, {receiver} \nYour one time pasword for ABACUS login is : " +
                        str(otp),
                        from_='+12183043798',
                        to=number
                    )
                print(message.sid)

                return JsonResponse({'msg': 'Success'})

            else:
                return JsonResponse({'msg': 'Fail'})

        else:
            return JsonResponse({'msg': 'invalid'})
        # except:
        #     return JsonResponse({'msg': 'error'})

    else:
        return render(request, 'login_system/login.html')

    return redirect('send_otp')

'''----------------------------------------------------------------------------------------------------------------------------------------------------'''
# LOGOUT function to end the session of a LOGED-IN user
def signout(request):
    print(request.user)
    logout(request)
    # del request.session['storeID']
    return HttpResponseRedirect('/signin')


def validate_email(request):
    try:
        flag = False
        email = request.GET['email']
        print(email)

        retrieved_mail = User.objects.filter(email=email)
        if len(retrieved_mail) == 1:
            flag = True
        else:
            flag = False

        print(retrieved_mail)
        print('hello')

        # creating JSON object

        if retrieved_mail:

            print('Valid mail : ', email)
            return HttpResponse('true')

        else:
            print('Invalid Email')
            return HttpResponse('false')

    except:
        return render(request, 'store-manager/manual-entry.html')
'''----------------------------------------------------------------------------------------------------------------------------------------------------'''


def check_email(request):
    print(request.GET)
    exit()
    return 'a'
