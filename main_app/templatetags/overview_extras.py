from django import template

register = template.Library()



@register.filter('MakeList')
def MakeList(data):
    realList = eval(data)
    return realList

