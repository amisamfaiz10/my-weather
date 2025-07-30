from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request,"Weather/Home.html")

def about(request):
    return render(request,"Weather/About.html")