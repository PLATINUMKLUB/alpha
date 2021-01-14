 # if request.is_ajax():

    #     Store_categrory = request.POST.get('Store_category')
    #     Store_sub_category = request.POST.get('Store_sub_category')

    #     print(Store_categrory, Store_sub_category)

    #     category_data = category(category=Store_categrory)
    #     category_data.save()
    #     print('data saved')

    #     sub_category_data = store_sub_category(category=category_data, sub_category=Store_sub_category)
    #     sub_category_data.save()
        
    #     return JsonResponse({
    #         'msg': 'Success'
    #     })

    