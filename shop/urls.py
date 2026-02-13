
from django.urls import path
from .import views

urlpatterns = [
    path('',views.index,name="shophome"),
    path("add-to-cart/<int:pid>/", views.add_to_cart, name="add_to_cart"),
    path("cart-data/", views.cart_data, name="cart_data"),

    path("update-cart/<int:pid>/<str:action>/", views.update_cart, name="update_cart"),

] 