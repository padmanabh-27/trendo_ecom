from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from .models import Product,Category

def index(request):

    categories = Category.objects.prefetch_related("products")

    return render(request, "shop/index.html", {
        "categories": categories
    })
def add_to_cart(request, pid):

    cart = request.session.get("cart", {})

    pid = str(pid)

    if pid in cart:
        cart[pid] += 1
    else:
        cart[pid] = 1

    request.session["cart"] = cart

    return JsonResponse({"status": "ok"})


def update_cart(request, pid, action):

    cart = request.session.get("cart", {})
    pid = str(pid)

    if pid in cart:
        if action == "inc":
            cart[pid] += 1
        elif action == "dec":
            cart[pid] -= 1

            if cart[pid] <= 0:
                del cart[pid]

    request.session["cart"] = cart
    return JsonResponse({"status": "ok"})


def cart_data(request):

    cart = request.session.get("cart", {})

    # 🔧 FIX: convert old list cart to new dict cart
    if isinstance(cart, list):
        new_cart = {}
        for pid in cart:
            pid = str(pid)
            new_cart[pid] = new_cart.get(pid, 0) + 1
        cart = new_cart
        request.session["cart"] = cart

    product_ids = [int(pid) for pid in cart.keys()]

    products = Product.objects.filter(id__in=product_ids)

    items = []
    total = 0

    for p in products:
        qty = cart.get(str(p.id), 0)
        subtotal = p.price * qty
        total += subtotal

        items.append({
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "qty": qty,
            "subtotal": subtotal
        })

    return JsonResponse({
        "items": items,
        "total": total
    })
