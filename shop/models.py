from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=50)
    desc = models.CharField(max_length=200)
    price = models.BigIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(1000000),]
)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products", 
        null=True,
        blank=True
        )


    image = models.ImageField(upload_to='products/', blank=True, null=True)

    pub_date = models.DateField()

    def __str__(self):
        return self.name
